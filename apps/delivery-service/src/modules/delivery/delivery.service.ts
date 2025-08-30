import { deliveryRepository } from "./delivery.repository";
import { DeliveryConfig } from "../../../../../modules/config/settingConfig";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  DriverTransaction,
  TrustPointsLogRepo,
  TrustPointsLogService,
} from "../../../types/delivery";
import { trustPointsLogGenerator } from "../../../../../modules/btuid/deliveryBtuid";
import { finderClient } from "../../..";
import {
  GetDriverRequest,
  OrderWithDrivers,
  OrderWithDriver,
} from "../../../../partners-stores-managers-dashboards-service/src/types/finderClient";
import { lastUpdate, driverOrderMap } from "../../main";
import {sendOrderToDriver, sendOrderToStore, waitForDriverDecision, waitForStoreDecision} from "../../../../socket-service/socket/socket"
import { DriverId, DriverOrderDecision, DriverOrderRequest ,StoreId, StoreOrderDecision, StoreOrderRequest} from "../../../../socket-service/types/types";
import { roundUpToNearestThousand } from "../../../../partners-stores-managers-dashboards-service/src/modules/stores/stores.service";
export type OrderNotifyResult =
  | { status: "accepted"; decision: DriverOrderDecision }
  | { status: "rejected_all"; triedDrivers: DriverId[] }
  | { status: "no_candidate"; triedDrivers: DriverId[] };

export type Options = {
  timeoutMs?: number;   // مهلة انتظار رد السائق
  maxAttempts?: number; // الحد الأقصى للمحاولات
};


export type StoreNotifyResult =
  | { status: "accepted"; decision: StoreOrderDecision }
  | { status: "rejected"; decision: StoreOrderDecision }
  | { status: "timeout" };
export const deliveryServices = {
  loginService: async (username, password) => {
    const { encrypted_password, driver_id ,vehicle } =
      await deliveryRepository.fetchDriverIdPasswordByUserName(username);
      console.log("vehicle : ",vehicle)
    if (await bcrypt.compare(password, encrypted_password)) {
      const token = jwt.sign(
        { driver_id: driver_id ,vehicle : vehicle},
        process.env.TOKEN_SECRET_DRIVER
      );
      await deliveryRepository.updateEffectiveToken(token, driver_id);

      return token;
    }

    return null;
  },
  getDriverTokenByIdService: async (driverId) => {
    return deliveryRepository.fetchDriverTokenById(driverId);
  },
  logoutService: async (driverId) => {
    return deliveryRepository.logout(driverId);
  },
  getDriverProfileService: async (driverId) => {
    return deliveryRepository.getDriverProfile(driverId);
  },
  driverWalletBalanceService: async (driverId) => {
    return deliveryRepository.driverWalletBalance(driverId);
  },
  driverAchievementsService: async (driverId) => {
    return deliveryRepository.driverAchievements(driverId);
  },

  //-----------------------------------------------------
  getDriverFee: (distToStore, distToCustomer) => {
    return roundUpToNearestThousand(
      DeliveryConfig.driverFeePerKm * (distToStore + distToCustomer)
    );
  },
  //-----------------------------------------------------

 async  orderNotificationToDriver  (
  baseFinderBody: GetDriverRequest,
  orderPayload: OrderWithDriver,
  opts: Options = {}
): Promise<OrderNotifyResult> {
  const timeoutMs = opts.timeoutMs ?? 20000;
  const maxAttempts = 1//Math.max(1, opts.maxAttempts ?? 5);
  console.log("baseFinderBody",baseFinderBody)
  const tried = new Set<string>();

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const candidate = await finderClient.getDriver({
      ...baseFinderBody
    }).catch(() => null);

    const driverId = candidate;
        console.log("driverId, ",driverId)
    if (driverId?.order.driverIds.length == 0 ) {
      // لا يوجد مرشح جديد
      return { status: tried.size ? "rejected_all" : "no_candidate", triedDrivers: [...tried] };
    }
    console.log(driverId?.order.driverIds)
        let driver = driverId?.order.driverIds.at(0)?.id||""

    tried.add(driver);
    console.log("driverId",driverId)
    // أرسل الطلب للسائق
    sendOrderToDriver(driver, orderPayload);

    // انتظر قرار السائق
    try {
      const decision = await waitForDriverDecision(orderPayload.orderId, driver, timeoutMs);
      console.log("decision ",decision)
      if (decision.accepted) {
        decision.dis=candidate?.order.driverIds.at(0)?.distance||0
        decision.driverId =driver
        return { status: "accepted", decision };
      }
    } catch (e) {
            console.log("decision ",e)

    }
  }

  return { status: "rejected_all", triedDrivers: [...tried] };
} ,
  async  orderNotificationToStore(
  storeId: StoreId,
  orderPayload: StoreOrderRequest, // يحتوي storeId = نفس المرسل
  opts: Options = {}
): Promise<StoreNotifyResult> {
  const timeoutMs = opts.timeoutMs ?? 20000;

  // أرسل الطلب للمتجر المحدد
  sendOrderToStore(storeId, orderPayload);

  try {
    const decision = await waitForStoreDecision(orderPayload.orderId, storeId, timeoutMs);
    console.log("store decision ," ,decision)
    return decision.accepted
      ? { status: "accepted", decision }
      : { status: "rejected", decision };
  } catch {
    return { status: "timeout" };
  }
},
//--------------------------------------------
  driverReward(deliveryMin, expectedMin) {
    let time = expectedMin - deliveryMin;
    if (time > 0) {
      return time * DeliveryConfig.deliverPointPerMinute;
    } else if (time < 0) {
      return (time * DeliveryConfig.deliverPointPerMinute) / 2;
    } else return 0;
  },
  insertDriverTransactionService: async (params: DriverTransaction) => {
    return deliveryRepository.insertDriverTransaction(params);
  },
  insertTrustPointsLogService: async (params: TrustPointsLogService) => {
    let id = trustPointsLogGenerator.getExtraBtuid();
    let log: TrustPointsLogRepo = {
      log_id: id,
      driver_id: params.driver_id,
      operation_type: params.operation_type,
      points: params.points,
      reason: params.reason,
    };
    return deliveryRepository.insertTrustPointsLog(params);
  },


};
function roundDriverFee(arg0: number) {
  throw new Error("Function not implemented.");
}

/*USAGE*/
// // 1) إرسال للمتجر (بدون اختيار)
// import { orderNotificationToStore } from "../services/storeNotification.service";
// const storeRes = await orderNotificationToStore(
//   "ST-100",
//   { orderId: "ORD-9", storeId: "ST-100", items: [{ sku:"X", qty:1 }], total: 15.5 },
//   { timeoutMs: 25000 }
// );

// // 2) إرسال للسائق مع الاختيار وإعادة المحاولة
// import { orderNotificationToDriver } from "../services/driverNotification.service";
// const driverRes = await orderNotificationToDriver(
//   { orderId: "ORD-9", lat: 24.71, lng: 46.67 },
//   {
//     orderId: "ORD-9",
//     storeId: "ST-100",
//     items: [{ sku:"X", qty:1 }],
//     pickupLocation: { lat: 24.71, lng: 46.67 },
//     dropoffLocation: { lat: 24.76, lng: 46.70 },
//   },
//   { timeoutMs: 25000, maxAttempts: 5 }
// );
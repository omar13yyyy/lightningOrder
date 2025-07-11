import { deliveryRepository } from "./delivery.repository";
import {
  DeliveryConfig,
} from "../../../../../modules/config/settingConfig";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { DriverTransaction, TrustPointsLogRepo, TrustPointsLogService } from "../../../types/delivery";
import { trustPointsLogGenerator } from "../../../../../modules/btuid/deliveryBtuid";
import { publishDriverResponse } from "../../../../../modules/nats/publishers/delivery.pub";

export const deliveryServices = {
  loginService: async (username, password) => {
    const { encrypted_password, driver_id } =
      await deliveryRepository.fetchDriverIdPasswordByUserName(username);
    if (await bcrypt.compare(password, encrypted_password)) {
      const token = jwt.sign(
        { driver_id: driver_id },
        process.env.TOKEN_SECRET_TOKEN_SECRET_DRIVER
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
    orderNotificationToDriver : async () =>{
      publishDriverResponse


},
    orderNotificationToCustomer : async () =>{



},
  refusedDriverDelivery : async () =>{
    //if remake notif + reset time
    //else 
},
  driverReward (deliveryMin ,expectedMin){
   let time = expectedMin - deliveryMin
    if(time >0){
      return time *DeliveryConfig.deliverPointPerMinute 
    }else if(time<0){
      return time *DeliveryConfig.deliverPointPerMinute /2
    }else
    return 0;
  },
    insertDriverTransactionService: async (params: DriverTransaction) => {
    return deliveryRepository.insertDriverTransaction(params);
  },
    insertTrustPointsLogService: async (params: TrustPointsLogService) => {
      let id = trustPointsLogGenerator.getExtraBtuid()
      let log : TrustPointsLogRepo = {
        log_id: id,
        driver_id: params.driver_id,
        operation_type: params.operation_type,
        points: params.points,
        reason: params.reason
      }
    return deliveryRepository.insertTrustPointsLog(params);
  },

};

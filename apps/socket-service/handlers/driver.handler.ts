import { Server, Socket } from "socket.io";
import {
  DRIVERS_EVENTS,
  STORES_EVENTS,
} from "../../../modules/events/events";
import {
  DriverLocationPayload, // تأكد أن هذا النوع يحتوي الحقول المذكورة أدناه أو عدل الدوال المساعدة
  DriverOrderDecision,
} from "../types/types";
import { resolveDriverDecision } from "../socket/awaitables";
import { finderClient } from "../../delivery-service";
import { encodeToQuadrants } from "../../../modules/geo/geohash";


type VehicleType = "motorcycle" | "bicycle" | "car";

export interface LocationData {
  id: string;
  latitude: number;
  longitude: number;
  location_code: string;
}

export interface AddAllDriversRequest {
  drivers: LocationData[];
  vehicle: VehicleType;
}

/** واجهة الاعتماد على خدمة الإرسال الخارجية */
interface FinderClient {
  addAllDrivers: (body: AddAllDriversRequest) => Promise<string>;
}


const STALE_MS = 45_000;      // تعتبر النقطة قديمة بعد 45 ثانية
const PUSH_EVERY_MS = 15_000; // نرسل كل 15 ثانية
const DEFAULT_VEHICLE: VehicleType = "car";

/* نخزن آخر موقع معروف لكل سائق مع الطابع الزمني ونوع المركبة (إن توفر) */
type StoredLoc = {
  loc: DriverLocationPayload & {
    vehicle?: string;
    latitude?: number;
    longitude?: number;
    lat?: number;
    lng?: number;
    location_code?: string;
  };
  at: number;
  vehicle?: string;
};

const driverLocations = new Map<string, StoredLoc>();

/* تنظيف دوري للسجلات القديمة */
setInterval(() => {
  const now = Date.now();
  for (const [driverId, rec] of driverLocations.entries()) {
    if (now - rec.at > STALE_MS) driverLocations.delete(driverId);
  }
}, 30_000);

let broadcastLoopStarted = false;


function extractVehicle(
  socket: Socket
): VehicleType | undefined {
  const v = socket.vehicle as VehicleType

  if (v === "car" || v === "motorcycle" || v === "bicycle") return v;
  return undefined;
}

function toLocationData(driverId: string, rec: StoredLoc): LocationData | null {
  console.log("rec",rec)
  const latitude =
    rec.loc.latitude ?? (typeof rec.loc.lat === "number" ? rec.loc.lat : undefined);
  const longitude =
    rec.loc.longitude ?? (typeof rec.loc.lng === "number" ? rec.loc.lng : undefined);
  const location_code = rec.loc.location_code ?? encodeToQuadrants(latitude,longitude);

  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    Number.isNaN(latitude) ||
    Number.isNaN(longitude)
  ) {
    return null; // نتجاهل قيماً غير صالحة
  }

  return {
    id: String(driverId),
    latitude,
    longitude,
    location_code,
  };
}


function ensureBroadcastLoop(finderClient: FinderClient) {
  if (broadcastLoopStarted) return;
  broadcastLoopStarted = true;

  const vehicles: VehicleType[] = ["motorcycle", "bicycle", "car"];

  const tick = async () => {
    const now = Date.now();

    const grouped: Record<VehicleType, LocationData[]> = {
      motorcycle: [],
      bicycle: [],
      car: [],
    };

    for (const [driverId, rec] of driverLocations.entries()) {
      if (now - rec.at > STALE_MS) continue;

      const data = toLocationData(driverId, rec);
      if (!data) continue;

      const vehicle = rec.vehicle ?? DEFAULT_VEHICLE;
      grouped[vehicle].push(data);
    }

    for (const vehicle of vehicles) {
      const drivers = grouped[vehicle];
      if (!drivers.length) continue;

      const body: AddAllDriversRequest = { vehicle, drivers };
      try {
        await finderClient.addAllDrivers(body);
      } catch (err) {
        console.error(
          `[drivers-sync] addAllDrivers failed for vehicle=${vehicle}:`,
          err
        );
      }
    }
  };

  setTimeout(tick, 1500);
  setInterval(tick, PUSH_EVERY_MS);
}


export function registerDriversHandlers(
  io: Server,
  socket: Socket,
) {

  ensureBroadcastLoop(finderClient);

  socket.on(
    DRIVERS_EVENTS.DRIVER_LOCATION_RESPONSE,
    (payload: DriverLocationPayload & { vehicle?: VehicleType }) => {
      // console.log("DRIVER_LOCATION_RESPONSE", payload);

      const driverId =
        (socket.data?.driverId as string | undefined) ||
        (payload as any).driverId ||
        (payload as any).id;

      if (!driverId) return;

      const vehicle = socket.vehicle
      console.log(vehicle )
      const prev = driverLocations.get(String(driverId));

      driverLocations.set(String(driverId), {
        loc: { ...payload },
        at: Date.now(),
        vehicle: vehicle ,
      });
    }
  );

  // قرار قبول/رفض الطلب من السائق
  socket.on(
    DRIVERS_EVENTS.DRIVERS_ORDER_RESPONSE,
    (decision: DriverOrderDecision) => {
      // مرّر القرار لمن ينتظرها
      console.log("decision",socket.driver_id)
      resolveDriverDecision(decision,socket.driver_id);
    }
  );
}

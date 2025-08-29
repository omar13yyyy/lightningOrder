import { redis } from '../cache/redis';
import { query } from '../database/commitDashboardSQL';

export const getDeliveryCostPerKm = async (): Promise<number> => {
  const DELIVERY_COST_PER_KM = "settings:delivery_cost_perkm";

  const cashdCost = await redis.get(DELIVERY_COST_PER_KM);
  if (cashdCost) {
    return parseFloat(cashdCost);
  }
  const  getDeliveryCostForKmDB= async () => {
    //TODO after login or first reques save token in redis
      const { rows } = await query(
        "select setting_value from system_settings where setting_key = 'delivery_cost_per_km' ",
      [])
      return rows[0].setting_value
  }
  const cost = await getDeliveryCostForKmDB();

  await redis.set(DELIVERY_COST_PER_KM, cost, "EX", 6 * 60 * 60);

  return parseFloat(cost);
};
export const getDeliveryTimePerKm = async (): Promise<number> => {
  const DELIVERY_time_PER_KM = "settings:delivery_time_per_km";

  const cashdTime = await redis.get(DELIVERY_time_PER_KM);
  if (cashdTime) {
    return parseFloat(cashdTime);
  }
  const getDeliveryTimeForKmDB= async () => {
    //TODO after login or first reques save token in redis
      const { rows } = await query(
        "select setting_value from system_settings where setting_key = 'delivery_time_per_km' ",
      [])
      return rows[0].setting_value
  }
  const time = await getDeliveryTimeForKmDB();

  await redis.set(DELIVERY_time_PER_KM, time, "EX", 6 * 60 * 60);

  return parseFloat(time);
};
export const getMaxDistance = async (): Promise<number> => {
  const MAX_DISTANCE_KM = "settings:max_distance_km";

  const cashdMaxDistance = await redis.get(MAX_DISTANCE_KM);
  if (cashdMaxDistance) {
    return parseFloat(cashdMaxDistance);
  }
 const getMaxDistanceDB= async () => {
    //TODO after login or first reques save token in redis
      const { rows } = await query(
        "select setting_value from system_settings where setting_key = 'max_distance_km' ",
      [])
      return rows[0].setting_value
  }
  const time = await getMaxDistanceDB();

  await redis.set(MAX_DISTANCE_KM, time, "EX", 6 * 60 * 60);

  return parseFloat(time);
};
export const getMinDeliveryCost = async (): Promise<number> => {
  const MIN_DELIVERY_COST = "settings:min_delivery_cost";

  const cashdMinDeliveryCost = await redis.get(MIN_DELIVERY_COST);
  if (cashdMinDeliveryCost) {
    return parseFloat(cashdMinDeliveryCost);
  }
 const getMinDeliveryCostDB= async () => {
    //TODO after login or first reques save token in redis
      const { rows } = await query(
        "select setting_value from system_settings where setting_key = 'min_delivery_cost' ",
      [])
      return rows[0].setting_value
  }
  const time = await getMinDeliveryCostDB();

  await redis.set(MIN_DELIVERY_COST, time, "EX", 6 * 60 * 60);

  return parseFloat(time);
};
export const getDeliveryPointPerMin = async (): Promise<number> => {
  const DELiVERY_POINT_PER_MINUTE = "settings:delivery_point_per_minute";

  const cashDeliveryPointPerMin = await redis.get(DELiVERY_POINT_PER_MINUTE);
  if (cashDeliveryPointPerMin) {
    return parseFloat(cashDeliveryPointPerMin);
  }
 const getcashDeliveryPointPerMinDB= async () => {
    //TODO after login or first reques save token in redis
      const { rows } = await query(
        "select setting_value from system_settings where setting_key = 'delivery_point_per_minute' ",
      [])
      return rows[0].setting_value
  }
  const time = await getcashDeliveryPointPerMinDB();

  await redis.set(DELiVERY_POINT_PER_MINUTE, time, "EX", 6 * 60 * 60);

  return parseFloat(time);
};
export const getDriverFeePerKm = async (): Promise<number> => {
  const DELIVERY_POINT_PER_MINUTE = "settings:driver_fee_per_km";

  const cashDeliveryPointPerMin = await redis.get(DELIVERY_POINT_PER_MINUTE);
  if (cashDeliveryPointPerMin) {
    return parseFloat(cashDeliveryPointPerMin);
  }
 const getCashgetDriverFeePerKmMinDB= async () => {
    //TODO after login or first reques save token in redis
      const { rows } = await query(
        "select setting_value from system_settings where setting_key = 'driver_fee_per_km' ",
      [])
      return rows[0].setting_value
  }
  const time = await getCashgetDriverFeePerKmMinDB();

  await redis.set(DELIVERY_POINT_PER_MINUTE, time, "EX", 6 * 60 * 60);

  return parseFloat(time);
};


export const driversForOrder = async (): Promise<number> => {
  const DRIVER_FOR_ORDER = "settings:driver_for_order";

  const cashDriversForOrder = await redis.get(DRIVER_FOR_ORDER);
  if (cashDriversForOrder) {
    return parseFloat(cashDriversForOrder);
  }
 const driversForOrderDB= async () => {
    //TODO after login or first reques save token in redis
      const { rows } = await query(
        "select setting_value from system_settings where setting_key = 'driver_for_order' ",
      [])
      return rows[0].setting_value
  }
  const time = await driversForOrderDB();

  await redis.set(DRIVER_FOR_ORDER, time, "EX", 6 * 60 * 60);

  return parseFloat(time);
};

export const maxDistanceDriverFromStore = async (): Promise<number> => {
  const MAX_DISTANCE_DRIVER_FROM_STORE = "settings:max_distance_driver_from_store";

  const cashMaxDistanceDriverFromStore = await redis.get(MAX_DISTANCE_DRIVER_FROM_STORE);
  if (cashMaxDistanceDriverFromStore) {
    return parseFloat(cashMaxDistanceDriverFromStore);
  }
 const driversForOrderDB= async () => {
    //TODO after login or first reques save token in redis
      const { rows } = await query(
        "select setting_value from system_settings where setting_key = 'max_distance_driver_from_store' ",
      [])
      return rows[0].setting_value
  }
  const time = await driversForOrderDB();

  await redis.set(MAX_DISTANCE_DRIVER_FROM_STORE, time, "EX", 6 * 60 * 60);

  return parseFloat(time);
};


export class DeliveryConfig {
  static maxDistance: number ; 
  static timePerKM: number ; 
  static costPerKM: number ;
  static MinDeliveryCost: number ; 
  static deliverPointPerMinute: number ; 
  static driverFeePerKm: number ; 
  static driversForOrder :number
    static maxDistanceDriverFromStore :number

  constructor(){
    DeliveryConfig.update()
  }
  static async update() {
   this.maxDistance = await getMaxDistance();; 
   this.timePerKM =await getDeliveryTimePerKm();  
   this.costPerKM = await getDeliveryCostPerKm();  
   this.MinDeliveryCost = await getMinDeliveryCost();
   //this.deliverPointPerMinute = await getDeliveryPointPerMin();
   //this.driversForOrder =await driversForOrder()
   //this.driverFeePerKm = await getDriverFeePerKm();
   //this.driverFeePerKm = await getDriverFeePerKm();
 //   this.maxDistanceDriverFromStore =await maxDistanceDriverFromStore()
  }
}

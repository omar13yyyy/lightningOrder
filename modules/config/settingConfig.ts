import { redis } from '../cashe/redis';
import { query } from '../database/commitDashboardSQL';







export const getDeliveryCostPerKm = async (): Promise<number> => {
  const DELIVERY_COST_PER_KM = "settings:delivery_cost_perkm";

  const cachedCost = await redis.get(DELIVERY_COST_PER_KM);
  if (cachedCost) {
    return parseFloat(cachedCost);
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

  const cachedTime = await redis.get(DELIVERY_time_PER_KM);
  if (cachedTime) {
    return parseFloat(cachedTime);
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

  const cachedMaxDistance = await redis.get(MAX_DISTANCE_KM);
  if (cachedMaxDistance) {
    return parseFloat(cachedMaxDistance);
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

  const cachedMinDeliveryCost = await redis.get(MIN_DELIVERY_COST);
  if (cachedMinDeliveryCost) {
    return parseFloat(cachedMinDeliveryCost);
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
export class DeliveryConfig {
  static maxDistance: number ; 
  static timePerKM: number ; 
  static costPerKM: number ;
    static MinDeliveryCost: number ; 
 
  constructor(){
    DeliveryConfig.update()
  }
  static async update() {
   this.maxDistance = await getMaxDistance();; 
   this.timePerKM =await getDeliveryTimePerKm();  
   this.costPerKM = await getDeliveryCostPerKm();  
    this.MinDeliveryCost = await getMinDeliveryCost();
  }
}

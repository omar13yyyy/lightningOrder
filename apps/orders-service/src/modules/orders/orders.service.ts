import { ordersRepository } from './orders.repository';
import { partnerClient } from "../../../index"
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
//------------------------------------------------------------------------------------------

 export const ordersService = {

//------------------------------------------------------------------------------------------



  partnergetCurrentStatisticsService: async (
    partnerId: string,
    internal_id:number
  ): Promise<{
 accepted : number, 
 rejected : number,
 with_driver :number,
 delivered : number,
  returned : number
    
  }> => {
    if (internal_id > 0) {
      return await ordersRepository.getCurrentStatistics(internal_id);
    }
   const stores = await partnerClient.geInfoByStoreIds(partnerId);
    const storeIds = stores.map((row) => row.internal_id);
    console.log(storeIds+"lllllllllllllllllllllllllll")
    return await ordersRepository.getCurrentStatistics(storeIds);
  },
  //------------------------------------------------------------------------------------------

previousOrderService: async (
  internal_id: number,
  state: string,
  paymentMethod: number,
  fromPrice: number,
  toPrice: number,
  fromDate: number,
  toDate: number,
  limit: number,
  offset: number
): Promise<{

  order_id: string,
  created_at: string,
  store_name: string,
  customer_name: string,
  customer_phone_number: string,
  driver_name: string,
  driver_phone_number: string, 
  type: string,
  related_rating: number,
  payment_method: string,
  order_details_text: string 


}[]> => {
  // TODO: تأكد أن المتجر ينتمي لنفس الشريك

  return await ordersRepository.previousOrder(
    internal_id,
    state,
    paymentMethod,
    fromPrice,
    toPrice,
    fromDate,
    toDate,
    limit,
    offset
  );
},

  //------------------------------------------------------------------------------------------

getCurrentOrders: async (
  storeId: number,
  limit: number,
  offset: number
): Promise<{
  order_id: string,
  created_at: string,
  store_name: string,
  type: string,
  payment_method: string,
  order_details_text: number
}[]> => {
  return await ordersRepository.getCurrentOrders(storeId, limit, offset);
},
//-----------------------------------------------------------------------------------------
getBillPastOrdersService: async ( 
   orderId: string
): Promise<{
    order_details_text: string;
  
}> => {
   return await ordersRepository.getBillPastOrders(orderId)
},
//------------------------------------------------------------------------------------------
getBillCurrentOrdersService: async ( 
   orderId: string
): Promise<{
    order_details_text: string;
  
}> => {
   return await ordersRepository.getBillPastOrders(orderId)
},
//------------------------------------------------------------------------------------------

 }






 
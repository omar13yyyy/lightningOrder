import { ordersRepository } from './orders.repository';
import { partnerClient } from "../../../index"
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
//------------------------------------------------------------------------------------------

 export const ordersService = {

//------------------------------------------------------------------------------------------


/*
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
storeId:number,
state:number,
paymentMethod:number,
fromPrice:number,
toPrice:number,
fromDate:number,
toDate:number,
limit:number,
offset:number
  ): Promise<{
     order_id:string,
        created_at:string,
        store_name:string,
        customer_name:string,
        customer_phone_number:string,
        driver_name:string,
        driveer_phone_number:number
        type:string,
        related_rating:number
        payment_method:string,
        order_details_text:number,
    
  }> => {

    if (internal_id > 0) {
      return await partnersRepository.getStatistics(internal_id);
    }

    const stores = await partnersRepository.getStoreIdsByPartnerId(partnerId);
    const storeIds = stores.map((row) => row.internal_id);
    console.log(storeIds+"lllllllllllllllllllllllllll")
    return await partnersRepository.getStatistics(storeIds);
  },
  //------------------------------------------------------------------------------------------

     getCurrentOrders: async (
storeId:number,
limit:number,
offset:number
  ): Promise<{
        order_id:string,
        created_at:string,
        store_name:string,
        type:string,
        payment_method:string,
        order_details_text:number,
    
  }> => {
    
    return await ordersRepository.getCurrentOrders(storeId, limit,offset);
  },
  //------------------------------------------------------------------------------------------
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





*/


 }

import { ordersRepository } from "./orders.repository";
import { partnerClient } from "../../../index";
import { RateControlerParams, RateRepoParams } from "../../../../partners-stores-managers-dashboards-service/src/types/order";

export const ordersService = {
  //------------------------------------------------------------------------------------------



  partnergetCurrentStatisticsService: async (
    partnerId: number,
    store_id: string
  ): Promise<{
    accepted: number;
    rejected: number;
    with_driver: number;
    delivered: number;
    returned: number;
    driver_not_Received: number;
    customer_not_Received: number;
  }> => {
    if (store_id) {
      const { internal_id } = await partnerClient.getStoreId(store_id);

      return await ordersRepository.getCurrentStatistics(internal_id);
    }
    const stores = await partnerClient.geInfoByStoreIds(partnerId);
    const storeIds = stores.map((row) => row.internal_id);
    console.log(storeIds + "storeIds");
    return await ordersRepository.getCurrentStatistics(storeIds);
  },
  //------------------------------------------------------------------------------------------

  previousOrderService: async (
    partnerId: number,
    storeId: string,
    state: string,
    paymentMethod: string,
    fromPrice: number,
    toPrice: number,
    fromDate: Date,
    toDate: Date,
    pageSize: number ,
      page: number,
  ) => {
          const offset = (page - 1) * pageSize;

    if (storeId) {
      const { internal_id } = await partnerClient.getStoreId(storeId);
 const [rows, total] = await Promise.all([

     ordersRepository.previousOrder(
        internal_id,
          pageSize,
      offset,
        state,
        paymentMethod,
        fromPrice,
        toPrice,
        fromDate,
        toDate,

      ),
 
          ordersRepository.getprevorderCountstore(internal_id),
   ]);
          console.log(total)

     return {
    data: {
      pastorder: rows,
      pagination: {
    total: total,
    page: Number(page),
    pageSize: Number(pageSize),
    totalPages: Math.ceil(total / pageSize),
  },
    }
  };

   } 
    const stores = await partnerClient.geInfoByStoreIds(partnerId);
    const storeIds = stores.map((row) => row.internal_id);
    console.log(storeIds + "storeIds");
 const [rows, total] = await Promise.all([

    ordersRepository.previousOrder(
      storeIds, 
        pageSize,
      offset,
      state,
      paymentMethod,
      fromPrice,
      toPrice,
      fromDate,
      toDate,
  
    ),
              ordersRepository.getprevorderCountstore(storeIds),

       ]);
       console.log(total)
         return {
    data: {
      pastorder: rows,
      pagination: {
    total: total,
    page: Number(page),
    pageSize: Number(pageSize),
    totalPages: Math.ceil(total / pageSize),
  },
    }
  };
       
  },

  //------------------------------------------------------------------------------------------

  getCurrentOrders: async (
    partnerId: number,
    storeId: string,
    limit: number,
    lastCursor?: string
  ): Promise<{
    orders: {
      order_id: string;
      created_at: string;
      store_name: string;
      type: string;
      payment_method: string;
      order_details_text: string;
    }[];
    hasNextPage: boolean;
    nextCursor?: string;
  }> => {
    if (storeId) {
      const { internal_id } = await partnerClient.getStoreId(storeId);
      return await ordersRepository.getCurrentOrders(
        internal_id,
        limit,
        lastCursor
      );
    }
    const stores = await partnerClient.geInfoByStoreIds(partnerId);
    const storeIds = stores.map((row) => row.internal_id);
    return await ordersRepository.getCurrentOrders(storeIds, limit, lastCursor);
  },
  //-----------------------------------------------------------------------------------------
  getBillPastOrdersService: async (
    orderId: string
  ): Promise<{
    order_details_text: string;
  }> => {
    return await ordersRepository.getBillPastOrders(orderId);
  },
  //------------------------------------------------------------------------------------------
  getBillCurrentOrdersService: async (
    orderId: string
  ): Promise<{
    order_details_text: string;
  }> => {
    return await ordersRepository.getBillPastOrders(orderId);
  },
  //------------------------------------------------------------------------------------------

  getCurrentStatisticsStore: async (
    store_id: string
  ): Promise<{
    accepted: number;
    rejected: number;
    with_driver: number;
    delivered: number;
    returned: number;
    driver_not_Received: number;
    customer_not_Received: number;
  }> => {
    const { internal_id } = await partnerClient.getStoreId(store_id);

    return await ordersRepository.getCurrentStatistics(internal_id);
  },
  //------------------------------------------------------------------------------------------


//---------------------------omar-------------------------------------






  getCurrentCustomerOrdersService: async (
    customerId: string,
    dateOffset:string,
    limit :number
  )=> {

       let rows =  await ordersRepository.getCurrentCustomerOrders(customerId,limit,dateOffset);


    return {
      hasNext: rows.length > limit,
      order : rows
    }
    
  },



  previousCustomerOrderService: async (
    customerId: string,
    dateOffset:string,
    limit :number
  )=> {

   let rows =  await ordersRepository.previousCustomerOrder(customerId,limit,dateOffset);


        return {
      hasNext: rows.length > limit,
      order : rows
    } 
    

  },
    //------------------------------------
    
  addRateService: async (
    params :RateControlerParams,customerId : number
  )=> {

    await ordersRepository.addRating(  params.orderId,
    customerId,
    params.driverRate,
    params.orderRate,
    "");

  },






















};


import { ordersRepository } from "./orders.repository";
import { partnerClient } from "../../../index";
import { RateControlerParams, RateRepoParams } from "../../../../partners-stores-managers-dashboards-service/src/types/order";
import { orderFinancialLogsGenerator, orderGenerator,electronicPaymentGenerator } from "../../../../../modules/btuid/orderBtuid";
import { CurrentOrderRepo, ElectronicPaymentRepo, ElectronicPaymentService, OrderFinancialLogRepo, OrderFinancialLogService } from "../../../types/orders";
import { log } from "console";

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



    //------------------------------------


  orderService: async (
driverId
  )=> {


    

  },
    //------------------------------------




  previousDriverOrderService: async (
    driverId: string,
    offset:string,
    limit :number
  )=> {

   let rows =  await ordersRepository.previousDriverDeliveOrder(driverId,limit,offset);


        return {
      hasNext: rows.length > limit,
      order : rows
    } 
    

  },
      //------------------------------------


  deliveredService: async (
driverId
  )=> {
   let rows =  await ordersRepository.delivered(driverId);


  },
    //------------------------------------




  confirmReceiptService: async (
driverId
  )=> {
   let rows =  await ordersRepository.confirmReceipt(driverId);


  },
    //------------------------------------



  customerRefusedToReceiveService: async (
driverId
  )=> {
   let rows =  await ordersRepository.customerRefusedToReceive(driverId);


  },
    //------------------------------------
  driverRefusedToReceiveService: async (
driverId
  )=> {
   let rows =  await ordersRepository.driverRefusedToReceive(driverId);


  },
    //------------------------------------

  orderNotificationToStore: async () => {},
    //-------------------------------------------------------------------------------

  orderNotificationToCustomer: async () => {},

  //-------------------------------------------------------------------------------

  orderListen: async () => {},
  //-------------------------------------------------------------------------------

  initOrderService : async () => {
    let id: string = orderGenerator.getExtraBtuid();

    let internalId = await ordersRepository.intiOrder(id)
    return {
      id :id ,
      internalId : internalId
    } ;
  },

  insertCurrentOrderService : async (params : CurrentOrderRepo) => {

   return await ordersRepository.insertCurrentOrder(params)
  
  },
    insertOrderStatusService : async (orderId: string, internal_id: number, status: string) => {

   return await ordersRepository.insertOrderStatus(orderId,internal_id,status)
  
  },
  insertOrderFinancialLogService : async (params : OrderFinancialLogService) => {

    let id = orderFinancialLogsGenerator.getExtraBtuid()
    let log :OrderFinancialLogRepo ={
      log_id: id,
      driver_id: params.driver_id,
      order_id: params.order_id,
      order_internal_id: params.order_internal_id,
      store_id: params.store_id,
      order_amount: params.order_amount,
      platform_commission: params.platform_commission,
      driver_earnings: params.driver_earnings
    }
   return await ordersRepository.insertOrderFinancialLog(log)
  
  },
  insertElectronicPaymentService : async (params : ElectronicPaymentService) => {

    let id = electronicPaymentGenerator.getExtraBtuid()
    let payment :ElectronicPaymentRepo= {
      payment_id: id,
      order_id: params.order_id,
      card_type: params.card_type,
      customer_id: params.customer_id,
      paid_amount: params.paid_amount,
      bank_transaction: params.bank_transaction,
    }
   return await ordersRepository.insertElectronicPayment(payment)
  
  },

};

import { printOrderInput } from "../../../../../dev/modules/printOrderInput";
import { orderGenerator } from "../../../../../modules/btuid/orderBtuid";
import { query } from "../../../../../modules/database/commitOrdersSQL";
import {
  OrderInput,
  RateControlerParams,
  ResolvedOrderItem,
} from "../../../../partners-stores-managers-dashboards-service/src/types/order";
import { resolvepartnerId } from "../../../../partners-stores-managers-dashboards-service/src/utils/resolvepartnerId";
import { resolveStoreId } from "../../../../partners-stores-managers-dashboards-service/src/utils/resolveStoreId";
import { ordersService } from "./orders.service";
import { createOrderCase } from "./orders.useCases/order.UseCase";

//------------------------------------------------------------------------------------------

export const ordersControler = {
  //------------------------------------------------------------------------------------------

  getCurrentStatistics: async (req, res) => {
    try {
      const partnerId = resolvepartnerId(req);
      const storeId = resolveStoreId(req);

      const stats = await ordersService.partnergetCurrentStatisticsService(
        partnerId,
        storeId
      );

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error in partnerInfo:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  //------------------------------------------------------------------------------------------

  previousOrder: async (req, res) => {
    try {
      const partnerId = resolvepartnerId(req);
      const storeId = resolveStoreId(req);

      const {
        state,
        paymentMethod,
        fromPrice,
        toPrice,
        fromDate,
        toDate,
        pageSize,
        page,
      } = req.query;

      const stats = await ordersService.previousOrderService(
        partnerId,
        storeId,
        state,
        paymentMethod,
        fromPrice,
        toPrice,
        fromDate,
        toDate,
        pageSize,
        page
      );

      return res.status(200).json({
        success: true,
        ...stats,
      });
    } catch (error) {
      console.error("Error in partnerInfo:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  //------------------------------------------------------------------------------------------

  getCurrentOrders: async (req, res) => {
    try {
      const partnerId = resolvepartnerId(req);
      const { limit, lastCursor } = req.query;
      const storeId = resolveStoreId(req);

      const stats = await ordersService.getCurrentOrders(
        partnerId,
        storeId,
        parseInt(limit),
        lastCursor
      );

      return res.status(200).json({
        success: true,
        data: {
          orders: stats.orders,
          hasNextPage: stats.hasNextPage,
          nextCursor: stats.nextCursor,
        },
      });
    } catch (error) {
      console.error("Error in getCurrentOrders:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  //------------------------------------------------------------------------------------------
  getBillPastOrders: async (req, res) => {
    try {
      const { orderId } = req.query;
      const stats = await ordersService.getBillPastOrdersService(orderId);

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error in partnerInfo:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  //------------------------------------------------------------------------------------------
  getBillCurrentOrders: async (req, res) => {
    try {
      const { orderId } = req.query;
      const stats = await ordersService.getBillPastOrdersService(orderId);

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error in partnerInfo:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  //------------------------------------------------------------------------------------------

  getCurrentStatisticsStore: async (req, res) => {
    try {
      const storeId = resolveStoreId(req);

      const stats = await ordersService.getCurrentStatisticsStore(storeId);

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error in partnerInfo:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  //-------------------------------------------------------------------------------------------
  sendUserOrder: async (req, res) => {
    try {
      const body = req.body;
      console.log(body)
      await createOrderCase(
         body.OrderInputs,
  "cash",
  body.orders_type,
  req.customer_id,
  body.store_id,
  body.couponCode,
   body.delivery_note,
  body.latitudes,
  body.longitudes,
  body.total_price
      )
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  //------------------------------------------------------------------------------------------

  previousCustomerOrder: async (req, res) => {
    try {
      const { dateOffset, limit } = req.query;
      let customerId = req.customer_id;
      const result = await ordersService.previousCustomerOrderService(
        customerId,
        dateOffset,
        limit
      );

      return res.send(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  //------------------------------------------------------------------------------------------

  getCurrentCustomerOrders: async (req, res) => {
    const { dateOffset, limit } = req.query;
    console.log("dateOffset ", dateOffset);
    let customerId = req.customer_id;
    const result = await ordersService.previousCustomerOrderService(
      customerId,
      dateOffset,
      limit
    );

    return res.send(result);
  },
  //------------------------------------------------------------------------------------------

  //Test
  rate: async (req, res) => {
    const { orderId, orderRate, driverRate } = req.body;
    let customerId = req.customer_id;
    const result = await ordersService.addRateService(
      {
        orderId: orderId,
        orderRate: orderRate,
        driverRate: driverRate,
      } as RateControlerParams,
      customerId
    );

    return res.send(result);
  },
  //------------------------------------------------------------------------------------------

  previousDriverOrder: async (req, res) => {
    try {
      const { offset, limit } = req.query;
      let driverId = req.driver_id;
      const result = await ordersService.previousDriverOrderService(
        driverId,
        offset,
        limit
      );

      return res.send(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  delivered: async (req, res) => {
    try {
      let driverId = req.driver_id;
      const result = await ordersService.deliveredService(driverId);
      return res.status(200).json({
        success: true,
        message: "Done",
      });
      return res.send(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  confirmReceipt: async (req, res) => {
    try {
      let driverId = req.driver_id;
      const result = await ordersService.confirmReceiptService(driverId);

      return res.status(200).json({
        success: true,
        message: "Done",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  customerRefusedToReceive: async (req, res) => {
    try {
      let driverId = req.driver_id;
      const result = await ordersService.customerRefusedToReceiveService(
        driverId
      );

      return res.status(200).json({
        success: true,
        message: "Done",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  driverRefusedToReceive: async (req, res) => {
    try {
      let driverId = req.driver_id;
      const result = await ordersService.driverRefusedToReceiveService(
        driverId
      );

      return res.status(200).json({
        success: true,
        message: "Done",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  //-------------------------------------------------------------------------------

};

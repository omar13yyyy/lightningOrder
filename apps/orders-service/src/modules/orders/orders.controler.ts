import { ordersService } from "./orders.service";

<<<<<<< HEAD

  //------------------------------------------------------------------------------------------

export const ordersControler = {


=======
>>>>>>> laila
//------------------------------------------------------------------------------------------

export const ordersControler = {
  //------------------------------------------------------------------------------------------

  getCurrentStatistics: async (req, res) => {
    try {
      const partnerId =req.user.partner_id; 
      const { storeId } = req.query;

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
      const partnerId = req.user.partner_id; 
      const {
        storeId,
        state,
        paymentMethod,
        fromPrice,
        toPrice,
        fromDate,
        toDate,
      pageSize,page
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
      pageSize,page
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
      const partnerId = req.user.partner_id; 
      const { storeId, limit, lastCursor } = req.query;

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
      const { storeId } = req.query;

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

  //------------------------------------------------------------------------------------------
};

  
  
  import { ordersService } from './orders.service';
  //------------------------------------------------------------------------------------------

export const ordersControler = {
//------------------------------------------------------------------------------------------

  getCurrentStatistics: async (req, res)=> {
    try {
      const partnerId = req.body; 
     const { storeId } = req.query;

      const stats = await ordersService.partnergetCurrentStatisticsService( partnerId,storeId);

      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in partnerInfo:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }},
    //------------------------------------------------------------------------------------------

  previousOrder: async (req, res)=> {
    try {
      const partnerId = req.body; 
     const { storeId,state,paymentMethod,fromPrice,toPrice,fromDate,toDate,limit,offset } = req.query;

      const stats = await ordersService.previousOrderService( storeId,state,paymentMethod,fromPrice,toPrice,fromDate,toDate,limit,offset);

      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in partnerInfo:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }},
    //------------------------------------------------------------------------------------------

      getCurrentOrders: async (req, res)=> {
    try {
      const partnerId = req.body; 
     const { storeId,limit,offset } = req.query;

      const stats = await ordersService.getCurrentOrders( storeId,limit,offset);

      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in partnerInfo:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }},
    //------------------------------------------------------------------------------------------
    getBillPastOrders: async (req, res)=> {
    try {
   const { orderId} = req.body;
      const stats = await ordersService.getBillPastOrdersService(orderId);

      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in partnerInfo:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },
  //------------------------------------------------------------------------------------------
      getBillCurrentOrders: async (req, res)=> {
    try {
   const { orderId} = req.body;
      const stats = await ordersService.getBillPastOrdersService(orderId);

      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in partnerInfo:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },
  //------------------------------------------------------------------------------------------
  }
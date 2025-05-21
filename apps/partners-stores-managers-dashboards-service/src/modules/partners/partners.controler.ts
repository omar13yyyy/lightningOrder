import { partnersService } from './partners.service';
//------------------------------------------------------------------------------------------

export const partnersController = {
  //------------------------------------------------------------------------------------------

  partnerLogin: async (req, res)=> {
    const { userName, password } = req.body;

    try {
      const token = await partnersService.loginService(userName, password);

      if (token != null) {
        res.send({ token });
      } else {
        res.status(401).send('The phone number or password is incorrect.');
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).send('Internal server error');
    }
  },
//------------------------------------------------------------------------------------------

  partnerInfo: async (req, res)=> {
    try {
 const { storeId } = req.query;
       const partnerId = req.body; 

      const stats = await partnersService.infoService(storeId, partnerId);

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
  }
  ,
  //------------------------------------------------------------------------------------------

    geInfoByStoreIds: async (req, res)=> {
    try {
       const partnerId = req.body; 

      const stats = await partnersService.geInfoByStoreIdsService( partnerId);

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
  }
  ,
  //------------------------------------------------------------------------------------------

  partnergetAllStores: async (req, res)=> {
    try {
      const partnerId = req.body; 

      const stats = await partnersService.partnergetAllStoresService( partnerId);

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

  getStatistics: async (req, res)=> {
    try {
      const partnerId = req.body; 
   const { storeId,untilnow,fromDate,toDate } = req.query;
      const stats = await partnersService.getStatisticsService(partnerId,storeId,untilnow,fromDate,toDate);

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

    bestSeller: async (req, res)=> {
    try {
      const partnerId = req.body; 
   const { storeId ,fromDate,toDate} = req.query;
      const stats = await partnersService.bestSellerService(partnerId,storeId,fromDate,toDate);

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
  //-------------------------------------------------------------------------
  profile: async (req, res)=> {
    try {
      const {partnerId} = req.body; 
      const stats = await partnersService.profileService(partnerId);

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
  //-------------------------------------------------------------------------------
   changeStoreState: async (req, res)=> {
    try {
      const {storeId,state,partnerId} = req.body; 
      const stats = await partnersService.changeStoreState(storeId,state,partnerId);

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
  //------------------------------------------------------------------------------
   getStoreProfile: async (req, res)=> {
    try {
      const {storeId,partnerId} = req.body; 
      const stats = await partnersService.getStoreProfile(storeId,partnerId);

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
  //------------------------------------------------------------------------------
};

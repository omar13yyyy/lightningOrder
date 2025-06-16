import { partnersService } from "./partners.service";
//------------------------------------------------------------------------------------------

export const partnersController = {
  //------------------------------------------------------------------------------------------

partnerLogin: async (req, res) => {
  const { userName, password } = req.body;
console.log(userName+'ussssseeeeeeeeeeeerrrrrrrr name')
  try {
    const token = await partnersService.loginService(userName, password);

    if (token != null) {
      res.send({
       data:{ token,
        username: userName, 
      }});
    } else {
      res.status(401).send({ message: "The phone number or password is incorrect." });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ message: "Internal server error" });
  }
},

  //------------------------------------------------------------------------------------------

  partnerInfo: async (req, res) => {
    try {
      const { storeId } = req.query;
    const partnerId = req.user.partner_id; 
      console.log(partnerId + "llll");
      const stats = await partnersService.infoService(storeId, partnerId);

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

  geInfoByStoreIds: async (req, res) => {
    try {
      const partnerId =req.user.partner_id; 
      const stats = await partnersService.geInfoByStoreIdsService(partnerId);

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

  partnergetAllStores: async (req, res) => {
    try {
      const partnerId = req.user.partner_id; 

      const stats = await partnersService.partnergetAllStoresService(partnerId);

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

  getStatistics: async (req, res) => {
    try {
      const partnerId = req.user.partner_id; 
      const { storeId, fromDate, toDate } = req.query;
      const stats = await partnersService.getStatisticsService(
        partnerId,
        storeId,
        fromDate,
        toDate
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
  //-------------------------------------------------------------------------------------------------------
  bestSeller: async (req, res) => {
    try {
      const partnerId = req.user.partner_id; 
      const { storeId, fromDate, toDate } = req.query;
      const stats = await partnersService.bestSellerService(
        partnerId,
        storeId,
        fromDate,
        toDate
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
  //-------------------------------------------------------------------------
  profile: async (req, res) => {
    try {
      const  partnerId = req.user.partner_id; 
      const stats = await partnersService.profileService(partnerId);

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
  //-------------------------------------------------------------------------------
  changeStoreState: async (req, res) => {
    try {
      const partnerId = req.user.partner_id; 
      const { storeId, state } = req.body;
      const stats = await partnersService.changeStoreState(
        storeId,
        state,
        partnerId
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
  //------------------------------------------------------------------------------
  getStoreProfile: async (req, res) => {
    try {
      const partnerId = req.user.partner_id; 
      const { storeId } = req.query;
      const stats = await partnersService.getStoreProfile(storeId, partnerId);

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
  //------------------------------------------------------------------------------
  getSpecialCustomers: async (req, res) => {
    try {
            const partnerId = req.user.partner_id; 

      const { storeId, fromDate, toDate } = req.query;
      const stats = await partnersService.getSpecialCustomers(partnerId, storeId,fromDate,toDate);

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
  //-------------------------------------------------------------------------------------------------
  gePartnerBalance: async (req, res) => {
    try {
       const partnerId = req.user.partner_id; 

      const { storeId } = req.query;
      const stats = await partnersService.gePartnerBalance(storeId, partnerId);

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
  //-------------------------------------------------------------------------------------------------

  walletTransferHistorystore: async (req, res) => {
    try {
                  const partnerId = req.user.partner_id; 

      const { store_id ,pageSize,page} = req.query;
      const stats = await partnersService.walletTransferHistorystore(
        store_id,
        partnerId,pageSize,page
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
  //-------------------------------------------------------------------------------------------------

 walletTransferHistory :async (req , res) => {
  try {
    const partnerId =req.user.partner_id; 
    const {page} = req.query;
    const {pageSize} = req.query || 10;

    const result = await partnersService.walletTransferHistory(partnerId, page, pageSize);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error in walletTransferHistory:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
},

  //-------------------------------------------------------------------------------------------------
  BalanceWithdrawalRequest: async (req, res) => {
    try {
      const  partnerId  =req.user.partner_id; 

      if (!partnerId) {
        return res.status(400).json({
          success: false,
          message: "partnerId is required",
        });
      }

      const result = await partnersService.BalanceWithdrawalRequest(partnerId);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error in BalanceWithdrawalRequest:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  //-------------------------------------------------------------------------------------------------

  changeModifiersItemState: async (req, res) => {
    try {
      const { storeId, modifiersId, state } = req.query;
      const stats = await partnersService.changeModifiersItemState(
        storeId,
        modifiersId,
        state
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
  //-------------------------------------------------------------------------------------------------
  changeStoreStatemanger: async (req, res) => {
    try {
      const { storeId, state } = req.body;
      const stats = await partnersService.changeStoreStatemanger(
        storeId,
        state
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
  //----------------------------------------------------------------------------------------------------
  getStoreProfilemanger: async (req, res) => {
    try {
      const { storeId } = req.body;
      const stats = await partnersService.getStoreProfilemanger(storeId);

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
  //---------------------------------------------------------------------------------------------------------
  getStoreBalance: async (req, res) => {
    try {
      const { storeId } = req.query;
      const stats = await partnersService.getStoreBalance(storeId);

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
  //----------------------------------------------------------------------------------------------------------
  walletTransferHistoryStore: async (req, res) => {
    try {
      const { storeId } = req.query;
      const stats = await partnersService.walletTransferHistoryStore(storeId);

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
  //----------------------------------------------------------------------------------------------------------------

  getStatisticsStore: async (req, res) => {
    try {
      const { storeId, fromDate, toDate } = req.query;
      const stats = await partnersService.getStatisticsStore(
        storeId,
        fromDate,
        toDate
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
  //-------------------------------------------------------------------------------------------------------

  getCoupons: async (req, res) => {
    try {
      const { storeId, limit, offset } = req.query;
      const stats = await partnersService.getCoupons(storeId, limit, offset);

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
  //-----------------------------------------------------------------------------------------------------------------
};

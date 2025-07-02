import { resolveStoreId } from "../../utils/resolveStoreId";
import { resolvepartnerId } from "../../utils/resolvepartnerId.ts";

import { partnersService } from "./partners.service";
//------------------------------------------------------------------------------------------

export const partnersController = {
  //------------------------------------------------------------------------------------------

  partnerLogin: async (req, res) => {
    const { userName, password } = req.body;
    console.log(userName + "ussssseeeeeeeeeeeerrrrrrrr name");
    try {
      const stats = await partnersService.loginService(userName, password);

      if (stats != null) {
        return res.status(200).json({
          success: true,
          data: stats,
        });
      } else {
        res
          .status(401)
          .send({ message: "The phone number or password is incorrect." });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  },

  //------------------------------------------------------------------------------------------

  partnerInfo: async (req, res) => {
    try {
      const storeId = resolveStoreId(req);
      const partnerId = resolvepartnerId(req);
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
      const partnerId = resolvepartnerId(req);
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
      const partnerId = resolvepartnerId(req)

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
      const storeId = resolveStoreId(req);

      const partnerId = resolvepartnerId(req)
      const { fromDate, toDate } = req.query;
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
      const storeId = resolveStoreId(req);

      const partnerId = resolvepartnerId(req)
      const { fromDate, toDate } = req.query;
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
      console.log('we are in controler of profile')
      const  partnerId = resolvepartnerId(req)
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
      const storeId = resolveStoreId(req);

      const  partnerId = resolvepartnerId(req)
      const { state } = req.body;
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
      const storeId = resolveStoreId(req);

      const partnerId = resolvepartnerId(req)
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
      const partnerId = resolvepartnerId(req)
      const storeId = resolveStoreId(req);

      const { fromDate, toDate } = req.query;
      const stats = await partnersService.getSpecialCustomers(
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
  //-------------------------------------------------------------------------------------------------
  gePartnerBalance: async (req, res) => {
    try {
      const partnerId = resolvepartnerId(req)

      const storeId = resolveStoreId(req);
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
      const storeId = resolveStoreId(req);
      console.log(storeId + "stooooooooreeeiiiid");
      const partnerId = resolvepartnerId(req)

      const { pageSize, page } = req.query;
      const stats = await partnersService.walletTransferHistorystore(
        storeId,
        partnerId,
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
  //-------------------------------------------------------------------------------------------------

  walletTransferHistory: async (req, res) => {
    try {
      const partnerId = resolvepartnerId(req);
      const { page } = req.query;
      const { pageSize } = req.query || 10;

      const result = await partnersService.walletTransferHistory(
        partnerId,
        page,
        pageSize
      );

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Error in walletTransferHistory:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  //-------------------------------------------------------------------------------------------------
  BalanceWithdrawalRequest: async (req, res) => {
    try {
      const partnerId = resolvepartnerId(req)

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

  //-------------------------------------------------------------------------------------------------
  changeStoreStatemanger: async (req, res) => {
    try {
      const storeId = resolveStoreId(req);

      const { state } = req.body;
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
      const storeId = resolveStoreId(req);
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
      const storeId = resolveStoreId(req);
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
      const storeId = resolveStoreId(req);
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
      const storeId = resolveStoreId(req);

      const { fromDate, toDate } = req.query;
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

  //-----------------------------------------------------------------------------------------------------------------
};

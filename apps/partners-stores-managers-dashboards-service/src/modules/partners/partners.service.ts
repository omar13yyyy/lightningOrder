import { partnersRepository } from "./partners.repository";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { serverHost, storeImagePath } from "../../../../../modules/config/urlConfig";
import { imageService } from "../../../../image-service/src/image.service";
//------------------------------------------------------------------------------------------

export const partnersService = {
  //------------------------------------------------------------------------------------------

  loginService: async (
    userName,
    reqPassword
  )=> {
    const result = await partnersRepository.fetchPartnerIdPasswordByUserName(
      userName
    );
    const { encrypted_password,  partner_id } = result[0];
console.log(partner_id+'paaaaaaaaaaaarrrrrrrrtnerid')
    const isMatch = await bcryptjs.compare(reqPassword, encrypted_password);
    if (isMatch) {
      const token = jwt.sign(
        { partner_id: partner_id  , role: "partner"},
        process.env.TOKEN_SECRET_ADMIN as string
      );
      return {token,
          role: 'partner',
    partner_id: partner_id,}
    }

    return null;
  },
  //------------------------------------------------------------------------------------------
  infoService: async (
    storeId: string,
    partnerId: string
  ): Promise<{
    categoris_in_stores: number;
    items_in_stores: number;
    stores_count?: number;
  }> => {
    if (storeId) {
      const { internal_id } = await partnersRepository.getStoreId(storeId);

      return await partnersRepository.geInfoByStoreIds(internal_id, true);
    }

    const stores = await partnersRepository.getStoreIdsByPartnerId(partnerId);
    const storeIds = stores.map((row) => row.internal_id);
    return await partnersRepository.geInfoByStoreIds(storeIds, false);
  },

  //---------------------------------------------------------------------------------------

  getStoreId: async (storeId) => {
    return await partnersRepository.getStoreId(storeId);
  },
  //---------------------------------------------------------------------------------------

  geInfoByStoreIdsService: async (partnerId) => {
    return await partnersRepository.getStoreIdsByPartnerId(partnerId);
  },
  //---------------------------------------------------------------------------------------

  partnergetAllStoresService: async (partner_id) => {
    //استدعاء دالة تحديث قيمة في الترانزكشن للمتجر
    return await partnersRepository.getAllStores(partner_id);
  },
  //---------------------------------------------------------------------------------------
  getStatisticsService: async (
    partnerId: string,
    store_id: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<{
    orders: number;
    sales_with_commission: number;
    sales_without_commission: number;
    platform_commission_sales: number;
    visit_count: number;
  }> => {
    const untilnow = !(fromDate && toDate);

    let storeIds: string[];
    if (store_id) {
      storeIds = [store_id];
    } else {
      const stores = await partnersRepository.getStoreIdsByPartnerId(partnerId);
      storeIds = stores.map((row) => row.store_id);
    }

    console.log("Store IDs:", storeIds);

    if (untilnow) {
      // TODO: استدعاء دالة التحديث قبل حساب الإحصائيات إن احتجت
    }
    if (fromDate && toDate) {
      return await partnersRepository.getStatisticsindate(
        storeIds,
        fromDate,
        toDate
      );
    }

    return await partnersRepository.getStatistics(storeIds);
  },
  //------------------------------------------------------------------------------------------
  bestSellerService: async (
    partnerId: string,
    store_id: string,
    fromDate: Date,
    toDate: Date
  ): Promise<
    Array<{
      product_name: string;
      product_id: number;
      size_name: string;
      times_sold: number;
      total_revenue: number;
    }>
  > => {
    // !!:true أو false نحول قيمة store_id إلى
    const isSingleStore = !!store_id;

    let storeIds: number[];

    if (isSingleStore) {
      const { internal_id } = await partnersRepository.getStoreId(store_id);
      storeIds = [internal_id];
    } else {
      const stores = await partnersRepository.getStoreIdsByPartnerId(partnerId);
      storeIds = stores.map((row) => row.internal_id);
    }

    return partnersRepository.bestSeller(storeIds, fromDate, toDate);
  },

  //------------------------------------------------------------------------------------------
  profileService: async (
    partnerId: string
  ): Promise<{
    partner_name: string;
    phone_number: number;
    company_name_ar: string;
    company_name_en: string;
    bank_name: string;
    iban: string;
    status: string;
    email: string;
  }> => {
    return await partnersRepository.profile(partnerId);
  },
  //------------------------------------------------------------------------------------------
  changeStoreState: async (
    storeId: string,
    state: string,
    partnerId: string
  ): Promise<{ success: boolean; message: string }> => {
  console.log(storeId,state)
     const store = await partnersRepository.getStoreId(storeId);

    const result = await partnersRepository.updateStoreState(
      store.internal_id,
      state
    );

    if (result.rowCount === 1) {
      return {
        success: true,
        message: "تم تحديث حالة المتجر بنجاح",
      };
    } else {
      return {
        success: false,
        message: "حدث خطأ أثناء تحديث الحالة",
      };
    }
  },
  //--------------------------------------------------------------------------------------

  getStoreProfile: async (
    storeId: string,
    partnerId: string
  ): Promise<{
    store_name: string;
    phone_number: string;
    email: string;
    full_address: string;
    min_order_price: number;
    latitude: number;
    longitude: number;
    logo_image_url: string;
    cover_image_url: string;
    store_description: string;
    platform_commission: number;
        status:string;

    category_name_ar: string;
    category_name_en: string;
    tag_name_ar: string;
    tag_name_en: string;
  }> => {
    let data =await partnersRepository.getStoreProfile(storeId, partnerId);
    data.logo_image_url=await imageService.getImageUrl(data.logo_image_url)
        data.cover_image_url=await imageService.getImageUrl(data.cover_image_url)


    return  data
  },
  //--------------------------------------------------------------------------------------
  getSpecialCustomers: async (
    partnerId:string,
    storeId: string,
    fromDate: Date,
    toDate: Date
  ): Promise<
    {
      customer_id: number;
      full_name: string;
      phone_number: string;
      order_count: number;
    }[]
  > => {
         // !!:true أو false نحول قيمة store_id إلى
    const isSingleStore = !!storeId;

    let storeIds: number[];

    if (isSingleStore) {
      const { internal_id } = await partnersRepository.getStoreId(storeId);
      storeIds = [internal_id];
    } else {
      const stores = await partnersRepository.getStoreIdsByPartnerId(partnerId);
      storeIds = stores.map((row) => row.internal_id);
    }
    return await partnersRepository.getSpecialCustomers(
      storeIds,
      fromDate,
      toDate
    );
  },
  //------------------------------------------------------------------------------------------
  gePartnerBalance: async (
    internal_id: string  ,
      partnerId: string,

  ): Promise<{ wallet_balance: number }> => { 
    const isSingleStore = !!internal_id ;
    // استدعاء تابع تحديث جدول الاحصائيات و البارتنر
    if (isSingleStore) {
      return await partnersRepository.gePartnerBalancestore(internal_id); // استرجاع الرصيد للمتجر
    } else {
      return await partnersRepository.gePartnerBalancepartner(partnerId); // استرجاع الرصيد للـ partner
    }
  },

  //-----------------------------------------------------------------------------------------

  walletTransferHistorystore: async (
    store_id: string,
    partner_id: string,
  pageSize: number ,
      page: number,

  ) => {
      const offset = (page - 1) * pageSize;
 const [rows, total] = await Promise.all([
       partnersRepository.walletTransferHistorystore(
      store_id,
      pageSize,
      offset
    ),
        partnersRepository.getWalletTransferHistoryCountstore(store_id),
  ]);
   return {
    data: {
      transactions: rows,
      pagination: {
    total: total,
    page: Number(page),
    pageSize: Number(pageSize),
    totalPages: Math.ceil(total / pageSize),
  },
    }
  };
  },
  //-----------------------------------------------------------------------------------------
walletTransferHistory: async (
  partnerId: string,
  page: number,
  pageSize: number
) => {
  const offset = (page - 1) * pageSize;

  const [rows, total] = await Promise.all([
    partnersRepository.getWalletTransferHistoryRows(partnerId, pageSize, offset),
    partnersRepository.getWalletTransferHistoryCount(partnerId),
  ]);

  return {
    data: {
      transactions: rows,
      pagination: {
    total: total,
    page: Number(page),
    pageSize: Number(pageSize),
    totalPages: Math.ceil(total / pageSize),
  },
    }
  };
},


  //-----------------------------------------------------------------------------------------
  BalanceWithdrawalRequest: async (
    partnerId: string
  ): Promise<{ withdrawal_id: string }> => {
    return await partnersRepository.walletBalanceWithdrawalRequest(partnerId);
  },

  //-----------------------------------------------------------------------------------------
  
  //----------------------------------------------------------------------
  changeStoreStatemanger: async (
    storeId: string,
    state: string
  ): Promise<{ success: boolean; message: string }> => {
    const result = await partnersRepository.updateStoreState(storeId, state);

    if (result.rowCount === 1) {
      return {
        success: true,
        message: "تم تحديث حالة المتجر بنجاح",
      };
    } else {
      return {
        success: false,
        message: "حدث خطأ أثناء تحديث الحالة",
      };
    }
  },
  //---------------------------------------------------------------------------------------------------

  getStoreProfilemanger: async (
    storeId: string
  ): Promise<{
    store_name: string;
    phone_number: string;
    email: string;
    full_address: string;
    min_order_price: number;
    latitude: number;
    longitude: number;
    logo_image_url: string;
    cover_image_url: string;
    store_description: string;
    platform_commission: number;
    category_name_ar: string;
    category_name_en: string;
    tag_name_ar: string;
    tag_name_en: string;
  }> => {
    return await partnersRepository.getStoreProfilemanger(storeId);
  },
  //--------------------------------------------------------------------------------------
  getStoreBalance: async (
    internal_id: string
  ): Promise<{ wallet_balance: number }> => {
    return await partnersRepository.getStoreBalance(internal_id); // استرجاع الرصيد للـ partner
  },
  //------------------------------------------------------------------------------------------
  walletTransferHistoryStore: async (
    store_id: string
  ): Promise<
    Array<{
      transaction_id: string;
      transaction_type: string;
      sales_without_commission: number;
      amount_platform_commission: number;
      transaction_date: Date;
      notes: string;
      sales_with_commission: number;
      store_name: string;
    }>
  > => {
    return await partnersRepository.walletTransferHistoryStore(store_id);
  },
  //------------------------------------------------------------------------------------------
  getStatisticsStore: async (
    store_id: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<{
    orders: number;
    sales_with_commission: number;
    sales_without_commission: number;
    platform_commission_sales: number;
    visit_count: number;
  }> => {
    const untilnow = !(fromDate && toDate);

    if (untilnow) {
      // TODO: استدعاء دالة التحديث قبل حساب الإحصائيات إن احتجت
    }
    if (fromDate && toDate) {
      return await partnersRepository.getStatisticsindate(
        store_id,
        fromDate,
        toDate
      );
    }

    return await partnersRepository.getStatistics(store_id);
  },

  //------------------------------------------------------------------------------------------
};

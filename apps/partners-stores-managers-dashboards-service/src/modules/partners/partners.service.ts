import { partnersRepository } from "./partners.repository";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
//------------------------------------------------------------------------------------------

export const partnersService = {
  //------------------------------------------------------------------------------------------

  loginService: async (
    userName: string,
    reqPassword: string
  ): Promise<string | null> => {
    const result = await partnersRepository.fetchPartnerIdPasswordByUserName(
      userName
    );
    const { encrypted_password,  partner_id } = result[0];
console.log(partner_id+'paaaaaaaaaaaarrrrrrrrtnerid')
    const isMatch = await bcryptjs.compare(reqPassword, encrypted_password);
    if (isMatch) {
      const token = jwt.sign(
        { partner_id: partner_id },
        process.env.TOKEN_SECRET_ADMIN as string
      );
      return token;
    }

    return null;
  },
  //------------------------------------------------------------------------------------------
  infoService: async (
    storeId: string,
    partnerId: number
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
    partnerId: number,
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
    partnerId: number,
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
    partnerId: number
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
    partnerId: number
  ): Promise<{ success: boolean; message: string }> => {
    // تحقق من ملكية المتجر
    const store = await partnersRepository.getStoreByIdAndPartner(
      storeId,
      partnerId
    );

    if (!store) {
      return {
        success: false,
        message: "هذا المتجر لا يتبع لك",
      };
    }

    // نفّذ التحديث
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
    partnerId: number
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
    return await partnersRepository.getStoreProfile(storeId, partnerId);
  },
  //--------------------------------------------------------------------------------------
  getSpecialCustomers: async (
    partnerId:number,
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
      partnerId: number,

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
    partner_id: number,
  pageSize: number ,
      page: number,

  ) => {
      const offset = (page - 1) * pageSize;
 const [rows, total] = await Promise.all([
       partnersRepository.walletTransferHistorystore(
      store_id,
      partner_id,
      pageSize,
      offset
    ),
        partnersRepository.getWalletTransferHistoryCountstore(partner_id,store_id),
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
  partnerId: number,
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
    partnerId: number
  ): Promise<{ withdrawal_id: string }> => {
    return await partnersRepository.walletBalanceWithdrawalRequest(partnerId);
  },

  //-----------------------------------------------------------------------------------------
  changeItemState: async (
    storeId: string,
    itemId: number,
    newState: boolean
  ) => {
    const productData = await partnersRepository.getProductDataByStoreId(
      storeId
    );

    if (!productData) {
      throw new Error("Store not found or product data missing");
    }

    const items = productData.items;

    if (!Array.isArray(items)) {
      throw new Error("Items list not found in product data");
    }

    const updatedItems = items.map((item: any) =>
      item.id === itemId ? { ...item, state: newState } : item
    );

    productData.items = updatedItems;

    await partnersRepository.updateProductDataByStoreId(storeId, productData);

    return { success: true };
  },
  //-----------------------------------------------------------------------------------------
  getModifiers: async (
    storeId: string
  ): Promise<{ modifiers_in_stores: string[] }> => {
    return await partnersRepository.getModifiers(storeId);
  },

  //----------------------------------------------------------------------------------------
  changeModifiersItemState: async (
    storeId: string,
    modifiersId: number,
    newState: boolean
  ) => {
    const productData = await partnersRepository.getProductDataByStoreId(
      storeId
    );

    if (!productData) {
      throw new Error("Store not found or product data missing");
    }

    const modifiers = productData.modifier;

    if (!Array.isArray(modifiers)) {
      throw new Error("modifiers list not found in product data");
    }

    const updatedmodifiers = modifiers.map((modifiers: any) =>
      modifiers.id === modifiersId
        ? { ...modifiers, state: newState }
        : modifiers
    );

    productData.items = updatedmodifiers;

    await partnersRepository.updateProductDataByStoreId(storeId, productData);

    return { success: true };
  },
  //----------------------------------------------------------------------
  changeStoreStatemanger: async (
    storeId: number,
    state: string
  ): Promise<{ success: boolean; message: string }> => {
    // نفّذ التحديث
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
    storeId: number
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

  getCoupons: async (
    storeId: string,
    limit: number,
    offset: number
  ): Promise<
    Array<{
      code: string;
      description: string;
      discount_value_percentage: number;
      on_expense: string;
      min_order_value: number;
      expiration_date: Date;
      max_usage: number;
      real_usage: number;
      coupon_type: string;
      store_name: string;
    }>
  > => {
    return await partnersRepository.getCoupons(storeId, limit, offset);
  },
  //------------------------------------------------------------------------------------------
};

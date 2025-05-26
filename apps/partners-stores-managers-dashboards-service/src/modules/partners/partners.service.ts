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
    const { encrypted_password, customer_id } = result[0];

    const isMatch = await bcryptjs.compare(reqPassword, encrypted_password);
    if (isMatch) {
      const token = jwt.sign(
        { partner_id: customer_id },
        process.env.TOKEN_SECRET_ADMIN as string
      );
      return token;
    }

    return null;
  },
//------------------------------------------------------------------------------------------
  infoService: async (
    internal_id: number,
    partnerId: string
  ): Promise<{
    categoris_in_stores: number;
    items_in_stores: number;
    stores_count?: number;
  }> => {
    if (internal_id > 0) {
      return await partnersRepository.geInfoByStoreIds(internal_id, true);
    }

    const stores = await partnersRepository.getStoreIdsByPartnerId(partnerId);
    const storeIds = stores.map((row) => row.internal_id);
    return await partnersRepository.geInfoByStoreIds(storeIds, false);
  },
  //---------------------------------------------------------------------------------------

  geInfoByStoreIdsService: async (partnerId) => {
    return await partnersRepository.getStoreIdsByPartnerId(partnerId);
  },
    //---------------------------------------------------------------------------------------

  partnergetAllStoresService: async (partner_id) => {
    return await partnersRepository.getAllStores(partner_id);
  },
  //---------------------------------------------------------------------------------------
  getStatisticsService: async (
  partnerId: string,
  internal_id: number,
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

  let storeIds: number[];
  if (internal_id > 0) {
    storeIds = [internal_id];
  } else {
    const stores = await partnersRepository.getStoreIdsByPartnerId(partnerId);
    storeIds = stores.map(row => row.internal_id);
  }

  console.log("Store IDs:", storeIds);

  if (untilnow) {
    // TODO: استدعاء دالة التحديث قبل حساب الإحصائيات إن احتجت
  }
  if (fromDate && toDate) {
    return await partnersRepository.getStatisticsindate(storeIds, fromDate, toDate);
  }

  return await partnersRepository.getStatistics(storeIds);
},
//------------------------------------------------------------------------------------------
bestSellerService: async ( 
   partnerId: string,
  internal_id: number,

  fromDate: Date,
  toDate: Date
): Promise<Array<{
  product_name: string;
  product_id: number;
  size_name: string;
  times_sold: number;
  total_revenue: number;
}>> => {
  const isSingleStore = internal_id > 0;
  const storeIds = isSingleStore
    ? [internal_id]
    : (
        await partnersRepository.getStoreIdsByPartnerId(partnerId)
      ).map((row) => row.internal_id); 
  return partnersRepository.bestSeller(storeIds, fromDate, toDate);
},
  //------------------------------------------------------------------------------------------
profileService: async ( 
   partnerId: number
): Promise<{
   partner_name:string,
    phone_number:number,
    company_name_ar:string,
    company_name_en:string,
    bank_name:string,
    iban:string,
    status:string,
    email:string
}> => {
   return await partnersRepository.profile(partnerId);

},
  //------------------------------------------------------------------------------------------
changeStoreState: async (
  storeId: number,
  state: string,
  partnerId: number
): Promise<{ success: boolean; message: string }> => {

  // تحقق من ملكية المتجر
  const store = await partnersRepository.getStoreByIdAndPartner(storeId, partnerId);

  if (!store) {
    return {
      success: false,
      message: 'هذا المتجر لا يتبع لك',
    };
  }

  // نفّذ التحديث
  const result = await partnersRepository.updateStoreState(storeId, state);

  if (result.rowCount === 1) {
    return {
      success: true,
      message: 'تم تحديث حالة المتجر بنجاح',
    };
  } else {
    return {
      success: false,
      message: 'حدث خطأ أثناء تحديث الحالة',
    };
  }
}
,
//--------------------------------------------------------------------------------------

getStoreProfile: async (
  storeId: number,
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

   return   await partnersRepository.getStoreProfile(storeId, partnerId);

},
//--------------------------------------------------------------------------------------
getSpecialCustomers: async (
  internal_id: number,
  fromDate: Date,
  toDate: Date
): Promise<{
  customer_id: number;
  full_name: string;
  phone_number: string;
  order_count: number;
}[]> => {
  return await partnersRepository.getSpecialCustomers(internal_id, fromDate, toDate);
}
,
//------------------------------------------------------------------------------------------
gePartnerBalance: async (
  partnerId: string,
  internal_id: number
): Promise<{ wallet_balance: number }> => {
  const isSingleStore = internal_id > 0;  
// استدعاء تابع تحديث جدول الاحصائيات و البارتنر 
  if (isSingleStore) {
    return await partnersRepository.gePartnerBalancestore(internal_id);  // استرجاع الرصيد للمتجر
  } else {
    return await partnersRepository.gePartnerBalancepartner(partnerId);  // استرجاع الرصيد للـ partner
  }
},

  
//-----------------------------------------------------------------------------------------

walletTransferHistorystore: async (
  store_id:string,
  partner_id:string
): Promise<Array<{
  transaction_id: string,
  transaction_type: string,
  sales_without_commission: number,
  amount_platform_commission: number,
  transaction_date: Date,
  notes: string,
  sales_with_commission: number,
  store_name: string
}>> => {
  return await partnersRepository.walletTransferHistorystore(store_id,partner_id);
}
,
  
//-----------------------------------------------------------------------------------------
walletTransferHistory: async (
  partner_id:string

): Promise<Array<{
  transaction_id: string,
  transaction_type: string,
  sales_without_commission: number,
  amount_platform_commission: number,
  transaction_date: Date,
  notes: string,
  sales_with_commission: number,
  store_name: string
}>> => {
  return await partnersRepository.walletTransferHistory(partner_id);
}
,
  
//-----------------------------------------------------------------------------------------

};

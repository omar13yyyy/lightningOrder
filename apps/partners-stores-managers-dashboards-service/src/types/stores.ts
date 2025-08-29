import { OrderInput } from "./order";

type StoreStatus = 'busy' | 'open' | 'closed' 
type OrdersType = 'take_away' | 'delivery' | 'take_away_and_delivery';

export interface StoreItem {
  rating_previous_day: string; 
  number_of_raters: number;
  store_id: string;
  distance_km: number;
  title: string;
  status: StoreStatus
  delivery_price: number;
  min_order_price: number;
  logo_image_url: string;
  cover_image_url: string;
  orders_type: OrdersType
  preparation_time: number;
  tags: (string | null)[];
  couponCode:String;
  discount_value_percentage :number,
  coupon_min_order_value :number,
  delivery_discount_percentage :number,
  isOpen:Boolean

}

export interface StoresResponse {
  hasNext :boolean;
  stores: StoreItem[];
  trendStores: StoreItem[];

}

export interface StoresAndTrendResponse {
  stores: StoreItem[];
  trendStores: StoreItem[];

}




//---------------------------


export interface LanguageReq {
  ln: string;
}
export interface LanguageService {
  ln: string;
}
export interface LanguageRepo {
  ln: string;
}

//-----------------------------


export interface CategoryReq {
  ln: string;
  categoryId: string;

}



export interface CategoryService  {
  categoryId: string;
  ln: string;
}



export interface CategoryRepo  {
  categoryId: string;

  ln: string;
}
//---------------------------
export interface TagReq {
  ln: string;
  categoryId: string;

}
export interface TagService {
  ln: string;
  categoryId: string;

}

export interface TagRepo{
  ln: string;
  categoryId: string;

}

//-----------------------------




export interface NearStoresReq {
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: number;
  offset: number;
}


export interface NearStoresService {
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: number;
  offset: number;
}

export interface NearStoresRepo {
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: number;
  offset: number;
  distanceKm:number;

}




//-----------------------------



export interface NearStoresByCategoryReq {
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: number;
  offset: number;
  categoryId: string;
}

export interface NearStoresByCategoryService {
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: number;
  offset: number;
  categoryId: string;
}

export interface NearStoresByCategoryRepo {
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: number;
  offset: number;
  categoryId: string;
  distanceKm:number;
}


//-----------------------------
export interface NearStoresByTagReq {
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: number;
  offset: number;
  tagId: string;
}




export interface NearStoresBytagService {
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: number;
  offset: number;
  tagId: string;
}

export interface NearStoresBytagRepo {
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: number;
  offset: number;
  tagId: string;
  distanceKm:number;

}
//-----------------------------


export interface SearchForStoreReq {
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: number;
  offset: number;
  storeName: string;
}
export interface SearchForStoreService{
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: number;
  offset: number;
  storeName: string;
}


export interface SearchForStoreRepo{
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: number;
  offset: number;
  storeName: string;
  distanceKm:number
}

//-----------------------------

export interface StoreProductsReq {
  ln: string;
  storeId: string;
}

export interface StoreProductsService {
  ln: string;
  storeId: string;
}

export interface StoreProductsRepo {
  ln: string;
  storeId: string;
}
//-----------------------------

export interface StoreReq {
  ln: string;
  storeId: string;
}

export interface StoreService {
  ln: string;
  storeId: string;
}

export interface StoreRepo {
  ln: string;
  storeId: string;
}

//-------------------------------

export interface StoreIdReq {
  storeId: string;
}
export interface StoreIdService {
  storeId: string;
}

export interface StoreIdRepo{
  storeId: string;
}


//-----------------------------

export interface StoreDistance{
  latitudes: string;
  logitudes: string;
  storeId: string;
}



//-----------------------------

export interface  OrderInputWithStoreId{
  storeId: string;
  order:OrderInput;
}
//-----------------------------

export interface CouponDetailsReq {
  couponCode: string;
  storeId: string;
}
export interface CouponDetailsService {
  couponCode: string;
  storeId: string;
}


export interface CouponDetailsRepo{
  couponCode: string;
  storeId: string;
}

export interface ProductSoldRepo {
  product_sold_id: string; 
  order_id: string | null;
  customer_id: number | null;
  store_internal_id: number | null;
  product_name_en: string | null;
  product_name_ar: string | null;
  internal_store_id: number | null;
  product_internal_id: number | null;
  product_id: string | null;
  size_name_en: string | null;
  size_name_ar: string | null;
  price: number | null;
  full_price: number | null;
  coupon_code: string | null;

}


export interface ProductSoldService {
  order_id: string | null;
  customer_id: number | null;
  store_internal_id: number | null;
  product_name_en: string | null;
  product_name_ar: string | null;
  internal_store_id: number | null;
  product_internal_id: number | null;
  product_id: string | null;
  size_name_en: string | null;
  size_name_ar: string | null;
  price: number | null;
  full_price: number | null;
  coupon_code: string | null;

}





export interface StoreTransactionRepo {
  transaction_id: string;
  partner_id: string;
  store_id: string;
  internal_store_id: number;
  transaction_type: 'deposit'| 'withdraw'|'discount'|'NULL'; // حسب القيم المتوقعة في enum
  amount: number;
  amount_platform_commission: number;
  notes?: string | null;
}

export interface StoreTransactionService {
  partner_id: string;
  store_id: string;
  internal_store_id: number;
  transaction_type: 'deposit'| 'withdraw'|'discount'|'NULL'; // حسب القيم المتوقعة في enum
  amount: number;
  amount_platform_commission: number;
  notes?: string | null;
}

type StoreStatus = 'busy' | 'open' | 'closed' 
type OrdersType = 'take_away' | 'delivery' | 'take_away_and_delivery';

export interface StoreItem {
  rating_previous_day: string; // لاحظ أنها string وليست number
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
}

export interface StoresResponse {
  hasNext :boolean;
  data: StoreItem[];
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
  limit: string;
  offset: string;
}


export interface NearStoresService {
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: string;
  offset: string;
}

export interface NearStoresRepo {
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: string;
  offset: string;
  distanceKm:number;

}




//-----------------------------



export interface NearStoresByCategoryReq {
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: string;
  offset: string;
  categoryId: string;
}

export interface NearStoresByCategoryService {
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: string;
  offset: string;
  categoryId: string;
}

export interface NearStoresByCategoryRepo {
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: string;
  offset: string;
  categoryId: string;
  distanceKm:number;
}


//-----------------------------
export interface NearStoresByTagReq {
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: string;
  offset: string;
  tagId: string;
}




export interface NearStoresBytagService {
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: string;
  offset: string;
  tagId: string;
}

export interface NearStoresBytagRepo {
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: string;
  offset: string;
  tagId: string;
  distanceKm:number;

}
//-----------------------------


export interface SearchForStoreReq {
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: string;
  offset: string;
  storeName: string;
}
export interface SearchForStoreService{
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: string;
  offset: string;
  storeName: string;
}


export interface SearchForStoreRepo{
  ln: string;
  latitudes: string;
  logitudes: string;
  locationCode: string;
  limit: string;
  offset: string;
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









import { storesRepository } from "./stores.repository";
import {
  getDeliveryTimePerKm,
  getDeliveryCostPerKm,
  getMaxDistance,
  DeliveryConfig,
} 
from "../../../../../modules/config/settingConfig";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { CategoryService, CouponDetailsRepo, CouponDetailsService, LanguageService, NearStoresByCategoryRepo, NearStoresByCategoryReq, NearStoresBytagRepo, NearStoresBytagService, NearStoresRepo,
   NearStoresService, OrderInputWithStoreId, SearchForStoreRepo, SearchForStoreService, StoreIdRepo, StoreIdService, StoreItem, StoreProductsReq, StoreRepo, StoreService, StoresResponse, TagService } from "../../types/stores";
import { MenuData, OrderInput, ResolvedModifier, ResolvedModifierItem, ResolvedOrderItem, TotalResolved } from "../../types/order";
import { serverHost, storeImagePath } from "../../../../../modules/config/urlConfig";
function roundUpToNearestThousand(num) : number {
  return Math.ceil(num / 1000) * 1000;
}
function roundUpToNearestten(num) :number{
  return Math.ceil(num / 1000) * 1000;
}

function processRow(row) : StoreItem{

 const result : StoreItem = {
   store_id: row.store_id,
   title: row.title,
   tags: row.tags,
   status: row.status,
   delivery_price: roundUpToNearestThousand(DeliveryConfig.costPerKM * row.distance_km),
   min_order_price: row.min_order_price,
   distance_km: row.distance_km.toFixed(1),
   preparation_time: roundUpToNearestten(
     row.preparation_time + DeliveryConfig.timePerKM * row.distance_km
   ),
   rating_previous_day: row.rating_previous_day,
   number_of_raters: row.number_of_raters,
   logo_image_url: serverHost+storeImagePath+row.logo_image_url,
   cover_image_url:serverHost+storeImagePath+ row.cover_image_url,
   orders_type: row.orders_type,
   couponCode :row.copounCode,
    discount_value_percentage :row.discount_value_percentage,
   min_order_value :row.min_order_value,
    delevery_discount_percentage :row.delevery_discount_percentage


 }
return result
}
function rowsJson(storeRows,trendRows,limit): StoresResponse {
  let hasNext = storeRows.length > limit || trendRows.length > limit/2
    const stores: StoreItem[] = [];
    const trendStores: StoreItem[] = [];

const idsToRemove = new Set(trendRows.map(item => item.store_id));

const rowsAfterFilter = storeRows.filter(item => !idsToRemove.has(item.store_id));


for (let i = 0; i < trendRows.length - 1; i++) {
  trendStores.push(processRow(trendRows[i]))

}
for (let i = 0; i < rowsAfterFilter.length - 1; i++) {
  stores.push(processRow(rowsAfterFilter[i]))

}

  return {
    hasNext : hasNext,
    trendStores:trendStores,
    stores:stores

  };
}

export const storesServices = {
  getCategoryTagsService: async (params :TagService)  => {
    return await storesRepository.fetchCategoryTags({ln:params.ln,categoryId:params.categoryId} as CategoryService);
  },
  getStoreCategoriesService: async (language : LanguageService) => {
   const res = (await storesRepository.fetchStoreCategories({ln:language.ln} as LanguageService)).map(row => ({
    category_id :row.category_id,
    category_name : row.category_name,
    category_image : serverHost+storeImagePath+row.category_image
   }));
    return res
  },

  getNearStoresService: async (
    params : NearStoresService
  ) => {
    let storeRows = await storesRepository.getNearStores(
    {
      ln: params.ln,
      latitudes: params.latitudes,
      logitudes: params.logitudes,
      locationCode: params.locationCode,
      limit: params.limit,
      offset: params.offset,
      distanceKm: DeliveryConfig.maxDistance,
    } as NearStoresRepo
    
    
    );
    let trendRows = await storesRepository.getNearTrendStores(
      {
      ln: params.ln,
      latitudes: params.latitudes,
      logitudes: params.logitudes,
      locationCode: params.locationCode,
      limit: params.limit/2,
      offset: params.offset,
      distanceKm: DeliveryConfig.maxDistance,
    } as NearStoresRepo
    );



    
        return rowsJson(storeRows,trendRows,params.limit) 

  },


    getNearStoresByTagService: async (
    params : NearStoresBytagService

  ) => {
    let storeRows = await storesRepository.getNearStoresbyTag(
   {
      ln:params.ln,
      latitudes:params.latitudes,
      logitudes:params.logitudes,
      locationCode:params.locationCode,
      limit:params.limit+1,
      offset:params.offset,
      distanceKm:DeliveryConfig.maxDistance,
      tagId:params.tagId
    } as NearStoresBytagRepo
    );
    let trendRows = await storesRepository.getNearTrendStoresbyTag(
   {
      ln:params.ln,
      latitudes:params.latitudes,
      logitudes:params.logitudes,
      locationCode:params.locationCode,
      limit:params.limit/2+1,
      offset:params.offset,
      distanceKm:DeliveryConfig.maxDistance,
      tagId:params.tagId
    } as NearStoresBytagRepo
    );
    return rowsJson(storeRows,trendRows,params.limit) 

    
  },
      getNearStoresByCategoryService: async (
      params : NearStoresByCategoryReq

  ) => {
    let storeRows = await storesRepository.getNearStoresbyCategory(
        {
      ln:params.ln,
      latitudes:params.latitudes,
      logitudes:params.logitudes,
      locationCode:params.locationCode,
      limit:params.limit+1,
      offset:params.offset,
      distanceKm:DeliveryConfig.maxDistance,
      categoryId:params.categoryId
    } as NearStoresByCategoryRepo
    );
      let trendRows = await storesRepository.getNearTrendStoresbyCategory(
        {
      ln:params.ln,
      latitudes:params.latitudes,
      logitudes:params.logitudes,
      locationCode:params.locationCode,
      limit:params.limit/2+1,
      offset:params.offset,
      distanceKm:DeliveryConfig.maxDistance,
      categoryId:params.categoryId
    } as NearStoresByCategoryRepo
    );
        return rowsJson(storeRows,trendRows,params.limit) 

  },


/*
  getNearTrendStoresService: async (
          params : NearStoresService

  ) => {
    let rows = await storesRepository.getNearTrendStores(
      {
      ln: params.ln,
      latitudes: params.latitudes,
      logitudes: params.logitudes,
      locationCode: params.locationCode,
      limit: params.limit,
      offset: params.offset,
      distanceKm: DeliveryConfig.maxDistance,
    } as NearStoresRepo
    
    );
        return rowsJson(rows,params.limit) 

  },
      getNearTrendStoresByTagService: async (
    params : NearStoresBytagService

  ) => {
    let rows = await storesRepository.getNearTrendStoresbyTag(
   {
      ln:params.ln,
      latitudes:params.latitudes,
      logitudes:params.logitudes,
      locationCode:params.locationCode,
      limit:params.limit+1,
      offset:params.offset,
      distanceKm:DeliveryConfig.maxDistance,
      tagId:params.tagId
    } as NearStoresBytagRepo
    );
    return rowsJson(rows,params.limit) 

    
  },
      getNearTrendStoresByCategoryService: async (
      params : NearStoresByCategoryReq

  ) => {
    let rows = await storesRepository.getNearTrendStoresbyCategory(
        {
      ln:params.ln,
      latitudes:params.latitudes,
      logitudes:params.logitudes,
      locationCode:params.locationCode,
      limit:params.limit+1,
      offset:params.offset,
      distanceKm:DeliveryConfig.maxDistance,
      categoryId:params.categoryId
    } as NearStoresByCategoryRepo
    );
        return rowsJson(rows,params.limit) 

  },

  */
    SearchForStoreService: async (
    params :SearchForStoreService
  ) => {
    let rows = await storesRepository.SearchForStore(
           {
      ln: params.ln,
      latitudes: params.latitudes,
      logitudes: params.logitudes,
      locationCode: params.locationCode,
      limit: params.limit,
      offset: params.offset,
      distanceKm: DeliveryConfig.maxDistance,
    } as SearchForStoreRepo
    );
        return rowsJson(rows,[],params.limit) 

  },
  getStoreProductsService: async (params :StoreService) => {
    let rows = await storesRepository.fetchStoreProduct({ln:params.ln, storeId:params.storeId}as StoreRepo );
    if(rows != undefined){
     for(let i =0 ; i< rows.items.length ;i++) {
      rows.items[0].image_url =serverHost +storeImagePath+ rows.items[0].image_url
     }


    }
        return 

  },
  getCouponDetailsService: async (coupon :CouponDetailsService) => {
    const copounDetails = await storesRepository.fetchCouponStore(
      {couponCode:coupon.couponCode,
      storeId:coupon.storeId}as CouponDetailsRepo
    );
    return copounDetails;
  },
  getWorkingHoursServie: async (params :StoreIdService) => {
    return await storesRepository.fetchWorkingHours({storeId : params.storeId}as StoreIdRepo);
  },
//--------------------------------------------------------
  getOrderItemsService: async (params :OrderInputWithStoreId) => {
    const {ar,en} =await storesRepository.getOrderItems({storeId : params.storeId}as StoreIdRepo);
    const arOrder =resolveOrderDetails(ar,params.order)
    //TODO Enable english 
    //const enOrder= resolveOrderDetails(en,params.order)
  
    return{
      ar :arOrder,
     // en :enOrder,
    }
  },
};
//--------------------------------------------------------
export function resolveOrderDetails(menu: MenuData, order: OrderInput): TotalResolved {
  let totalPrice =0 ;
  let orderResolves :ResolvedOrderItem[] =  order.map(orderItem => {
  
    const item = menu.items.find(i => i.item_id === orderItem.item_id);
    if (!item) throw new Error(`Item not found: ${orderItem.item_id}`);

    const size = item.sizes.find(s => s.size_id === orderItem.size_id);
    if (!size) throw new Error(`Size not found for item ${orderItem.item_id}`);

    const resolvedModifiers: ResolvedModifier[] = orderItem.modifiers.map(modInput => {
      const modifier = menu.modifiers.find(m => m.modifiers_id === modInput.modifiers_id);
      if (!modifier) throw new Error(`Modifier not found: ${modInput.modifiers_id}`);
      let modiCount = 0;
      const resolvedItems: ResolvedModifierItem[] = modInput.modifiers_item.map(modItemInput => {
        const modItem = modifier.items.find(mi => mi.modifiers_item_id === modItemInput.modifiers_item_id);
        if (!modItem ||!modItem.is_enable) throw new Error(`Modifier item not found or disabled: ${modItemInput.modifiers_item_id}`);
  modiCount += modItemInput.number;
          totalPrice += modItem.price*modItemInput.number
        return {
          name: modItem.name,
          number : modItemInput.number ,
          price: modItem.price
        };
      });
      if(modiCount>modifier.max ||modiCount<modifier.min) throw new Error(`Modifier item count not currect: ${modifier.modifiers_id}`);
        
      return {
        title: modifier.title,
        items: resolvedItems
      };
    });
    totalPrice +=size.price
    return {
      item_name: item.name,
      size_name: size.name,
      size_price: size.price,
      size_calories: size.calories,
      modifiers: resolvedModifiers
    };
  });
  return {
          order :orderResolves,
          total_price:totalPrice
  }
}
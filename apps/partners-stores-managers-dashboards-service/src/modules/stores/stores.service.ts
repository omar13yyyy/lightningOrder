import { storesRepository } from "./stores.repository";
import {
  getDeliveryTimePerKm,
  getDeliveryCostPerKm,
  getMaxDistance,
} from "../../../../../modules/config/settingConfig";

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { CategoryService, CouponDetailsRepo, CouponDetailsService, LanguageService, NearStoresByCategoryRepo, NearStoresByCategoryReq, NearStoresBytagRepo, NearStoresBytagService, NearStoresRepo,
   NearStoresService, SearchForStoreRepo, SearchForStoreService, StoreIdRepo, StoreIdService, StoreItem, StoreProductsReq, StoreRepo, StoreService, StoresResponse, TagService } from "../../types/stores";
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
   delivery_price: roundUpToNearestThousand(costPerKM * row.distance_km),
   min_order_price: row.min_order_price,
   distance_km: row.distance_km.toFixed(1),
   preparation_time: roundUpToNearestten(
     row.preparation_time + timePerKM * row.distance_km
   ),
   rating_previous_day: row.rating_previous_day,
   number_of_raters: row.number_of_raters,
   logo_image_url: row.logo_image_url,
   cover_image_url: row.cover_image_url,
   orders_type: "take_away",
 }
return result
}
function rowsJson(rows,limit): StoresResponse {
  let hasNext = rows.length > limit
    const result: StoreItem[] = [];

for (let i = 0; i < rows.length - 1; i++) {
  result.push(processRow(rows[i]))

}

  return {
    hasNext : hasNext,
    data:result
  };
}
const costPerKM = await getDeliveryCostPerKm();
const timePerKM = await getDeliveryTimePerKm();
const maxDistance = await getMaxDistance();
export const storesServices = {
  getCategoryTagsService: async (params :TagService)  => {
    return await storesRepository.fetchCategoryTags({ln:params.ln,categoryId:params.categoryId} as CategoryService);
  },
  getStoreCategoriesService: async (language : LanguageService) => {
    return await storesRepository.fetchStoreCategories({ln:language.ln} as LanguageService);
  },

  getNearStoresService: async (
    param : NearStoresService
  ) => {
    let rows = await storesRepository.getNearStores(
    {
      ln: param.ln,
      latitudes: param.latitudes,
      logitudes: param.logitudes,
      locationCode: param.locationCode,
      limit: param.limit,
      offset: param.offset,
      distanceKm: maxDistance,
    } as NearStoresRepo
    
    
    );
        return rowsJson(rows,param.limit) 

  },
    getNearStoresByTagService: async (
    param : NearStoresBytagService

  ) => {
    let rows = await storesRepository.getNearStoresbyTag(
   {
      ln:param.ln,
      latitudes:param.latitudes,
      logitudes:param.logitudes,
      locationCode:param.locationCode,
      limit:param.limit+1,
      offset:param.offset,
      distanceKm:maxDistance,
      tagId:param.tagId
    } as NearStoresBytagRepo
    );
    return rowsJson(rows,param.limit) 

    
  },
      getNearStoresByCategoryService: async (
      param : NearStoresByCategoryReq

  ) => {
    let rows = await storesRepository.getNearStoresbyCategory(
        {
      ln:param.ln,
      latitudes:param.latitudes,
      logitudes:param.logitudes,
      locationCode:param.locationCode,
      limit:param.limit+1,
      offset:param.offset,
      distanceKm:maxDistance,
      categoryId:param.categoryId
    } as NearStoresByCategoryRepo
    );
        return rowsJson(rows,param.limit) 

  },
  getNearTrandStoresService: async (
          param : NearStoresService

  ) => {
    let rows = await storesRepository.getNearTrendStores(
      {
      ln: param.ln,
      latitudes: param.latitudes,
      logitudes: param.logitudes,
      locationCode: param.locationCode,
      limit: param.limit,
      offset: param.offset,
      distanceKm: maxDistance,
    } as NearStoresRepo
    
    );
        return rowsJson(rows,param.limit) 

  },
      getNearTrendStoresByTagService: async (
    param : NearStoresBytagService

  ) => {
    let rows = await storesRepository.getNearTrendStoresbyTag(
   {
      ln:param.ln,
      latitudes:param.latitudes,
      logitudes:param.logitudes,
      locationCode:param.locationCode,
      limit:param.limit+1,
      offset:param.offset,
      distanceKm:maxDistance,
      tagId:param.tagId
    } as NearStoresBytagRepo
    );
    return rowsJson(rows,param.limit) 

    
  },
      getNearTrendStoresByCategoryService: async (
      param : NearStoresByCategoryReq

  ) => {
    let rows = await storesRepository.getNearTrendStoresbyCategory(
        {
      ln:param.ln,
      latitudes:param.latitudes,
      logitudes:param.logitudes,
      locationCode:param.locationCode,
      limit:param.limit+1,
      offset:param.offset,
      distanceKm:maxDistance,
      categoryId:param.categoryId
    } as NearStoresByCategoryRepo
    );
        return rowsJson(rows,param.limit) 

  },
    SearchForStoreService: async (
    param :SearchForStoreService
  ) => {
    let rows = await storesRepository.SearchForStore(
           {
      ln: param.ln,
      latitudes: param.latitudes,
      logitudes: param.logitudes,
      locationCode: param.locationCode,
      limit: param.limit,
      offset: param.offset,
      distanceKm: maxDistance,
    } as SearchForStoreRepo
    );
        return rowsJson(rows,param.limit) 

  },
  getStoreProductsService: async (param :StoreService) => {
    return await storesRepository.fetchStoreProduct({ln:param.ln, storeId:param.storeId}as StoreRepo );
  },
  getCouponDetailsService: async (coupon :CouponDetailsService) => {
    const copounDetails = await storesRepository.fetchCouponStore(
      {couponCode:coupon.couponCode,
      storeId:coupon.storeId}as CouponDetailsRepo
    );
    return copounDetails;
  },
  getWorkingHoursServie: async (param :StoreIdService) => {
    return await storesRepository.fetchWorkingHours({storeId : param.storeId}as StoreIdRepo);
  },
};

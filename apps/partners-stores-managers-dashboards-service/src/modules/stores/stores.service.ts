import { storesRepository } from "./stores.repository";
import {
  getDeliveryTimePerKm,
  getDeliveryCostPerKm,
  getMaxDistance,
  DeliveryConfig,
} from "../../../../../modules/config/settingConfig";
import { partnerClient } from "./indenx";

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { CategoryService, CouponDetailsRepo, CouponDetailsService, LanguageService, NearStoresByCategoryRepo, NearStoresByCategoryReq, NearStoresBytagRepo, NearStoresBytagService, NearStoresRepo,
   NearStoresService, OrderInputWithStoreId, SearchForStoreRepo, SearchForStoreService, StoreDistance, StoreIdRepo, StoreIdService, StoreItem, StoreProductsReq, StoreRepo, StoreService, StoresResponse, TagService } from "../../types/stores";
import { MenuData, OrderInput, ResolvedModifier, ResolvedModifierItem, ResolvedOrderItem, TotalResolved } from "../../types/order";
import { serverHost, storeImagePath } from "../../../../../modules/config/urlConfig";
import { threadId } from "worker_threads";
function roundUpToNearestThousand(num) : number {
  return Math.ceil(num / 1000) * 1000;
}
function roundUpToNearestten(num): number {
  return Math.ceil(num / 1000) * 1000;
}

async function processRow(row) : Promise<StoreItem>{
const delivery_price = roundUpToNearestThousand(DeliveryConfig.costPerKM * row.distance_km)
 const result : StoreItem = {

  
   store_id: row.store_id,
   title: row.title,
   tags: row.tags,
   status: row.status,
   isOpen :true,
   delivery_price: delivery_price > DeliveryConfig.MinDeliveryCost?delivery_price :DeliveryConfig.MinDeliveryCost,
   min_order_price: row.min_order_price,
   distance_km: Math.round(row.distance_km * 10) / 10,
   preparation_time: roundUpToNearestten(
     row.preparation_time + DeliveryConfig.timePerKM * row.distance_km
   ),
   rating_previous_day: row.rating_previous_day,
   number_of_raters: row.number_of_raters,
   logo_image_url: serverHost+storeImagePath+row.logo_image_url,
   cover_image_url:serverHost+storeImagePath+ row.cover_image_url,
   orders_type: row.orders_type,
   couponCode :row.code,
   discount_value_percentage :row.discount_value_percentage,
   coupon_min_order_value :row.coupon_min_order_value,
   delivery_discount_percentage :row.delivery_discount_percentage


 }
return result
}
async function rowsJson(storeRows,trendRows,limit): Promise<StoresResponse> {
  let hasNext = storeRows.length > limit || trendRows.length > limit/2
    const stores: StoreItem[] = [];
    const trendStores: StoreItem[] = [];

const idsToRemove = new Set(trendRows.map(item => item.store_id));

const rowsAfterFilter = storeRows.filter(item => !idsToRemove.has(item.store_id));


for (let i = 0; i < trendRows.length - 1; i++) {
  trendStores.push(await processRow(trendRows[i]))

}
for (let i = 0; i < rowsAfterFilter.length - 1; i++) {
  stores.push(await processRow(rowsAfterFilter[i]))

}

  return {
    hasNext : hasNext,
    trendStores:trendStores,
    stores:stores

  };
}
async function searchProcessRow(row) : Promise<StoreItem>{
const isOpen= await storesServices.isOpenNowService({storeId : row.store_id}as StoreIdRepo)
const delivery_price = roundUpToNearestThousand(DeliveryConfig.costPerKM * row.distance_km)
 const result : StoreItem = {
   store_id: row.store_id,
   title: row.title,
   tags: row.tags,
   status: row.status,
   isOpen :isOpen,
   delivery_price: delivery_price > DeliveryConfig.MinDeliveryCost?delivery_price :DeliveryConfig.MinDeliveryCost,
   min_order_price: row.min_order_price,
   distance_km: Math.round(row.distance_km * 10) / 10,
   preparation_time: roundUpToNearestten(
     row.preparation_time + DeliveryConfig.timePerKM * row.distance_km
   ),
   rating_previous_day: row.rating_previous_day,
   number_of_raters: row.number_of_raters,
   logo_image_url: serverHost+storeImagePath+row.logo_image_url,
   cover_image_url:serverHost+storeImagePath+ row.cover_image_url,
   orders_type: row.orders_type,
   couponCode :row.code,
    discount_value_percentage :row.discount_value_percentage,
   coupon_min_order_value :row.coupon_min_order_value,
    delivery_discount_percentage :row.delivery_discount_percentage


 }
return result
}
async function searchRowsJson(storeRows,trendRows,limit): Promise<StoresResponse> {
  let hasNext = storeRows.length > limit || trendRows.length > limit/2
    const stores: StoreItem[] = [];
    const trendStores: StoreItem[] = [];

  const idsToRemove = new Set(trendRows.map((item) => item.store_id));

  const rowsAfterFilter = storeRows.filter(
    (item) => !idsToRemove.has(item.store_id)
  );


for (let i = 0; i < trendRows.length - 1; i++) {
  trendStores.push(await searchProcessRow(trendRows[i]))

}
for (let i = 0; i < rowsAfterFilter.length - 1; i++) {
  stores.push(await searchProcessRow(rowsAfterFilter[i]))

}

  return {
    hasNext: hasNext,
    trendStores: trendStores,
    stores: stores,
  };
}
export const storesServices = {
  loginService: async (
    userName,
    reqPassword,
  )=> { 

  const result = await storesRepository.fetchStoreIdPasswordByUserName(
      userName
    );
    const { encrypted_password, store_id } = result[0];
    console.log(store_id + "stooooreeeid");
    const isMatch = await bcryptjs.compare(reqPassword, encrypted_password);
    if (isMatch) {
      const token = jwt.sign(
        { store_id: store_id, role: "manager" },
        process.env.TOKEN_SECRET_ADMIN as string
      );
 return {
    token,
    role: 'manager',
    store_id: store_id,
  };   
 }

    return null;
},
//----------------------------------------------------------------------------------------------
  getStoreProductsServicestore: async (params: StoreService) => {
    let row = await storesRepository.fetchStoreProductstore({
      ln: params.ln,
      storeId: params.storeId,
    } as StoreRepo);
    if (row != undefined) {
      for (let i = 0; i < row.products.items.length; i++) {
        row.products.items[i].image_url =
          serverHost + storeImagePath + row.products.items[i].image_url;
      }
    }
    return row;
  },
  //----------------------------------------------------------------------------------------------
  changeItemState: async (itemId, store_id, newState) => {
    const productDataar = await storesRepository.fetchStoreProductstore({
      ln: "ar",
      storeId: store_id,
    } as StoreRepo);
    const productDataen = await storesRepository.fetchStoreProductstore({
      ln: "en",
      storeId: store_id,
    } as StoreRepo);

    if (!productDataar || !productDataen) {
      throw new Error("Store not found or product data missing");
    }

    const itemsar = productDataar.products.items;
    const itemsen = productDataen.products.items;

    if (!Array.isArray(itemsar) || !Array.isArray(itemsen)) {
      throw new Error("Items list not found in product data");
    }

    const updatedItemsar = itemsar.map((item: any) =>
      item.item_id === itemId ? {...item, is_activated: newState } : item
    );

    productDataar.products.items = updatedItemsar;
    const updatedItemsen = itemsen.map((item: any) =>
      item.item_id === itemId ? { ...item, is_activated: newState } : item
    );
    productDataen.products.items = updatedItemsen;
    console.log(productDataar.products,itemId, newState);

    await storesRepository.updateProductDataByStoreId(
      "ar",
      store_id,
      productDataar.products
    );
    await storesRepository.updateProductDataByStoreId(
      "en",
      store_id,
      productDataen.products
    );

    return { success: true };
  },
  //----------------------------------------------------------------------------------------
  changeModifierItemState: async (
    storeId: string,
    modifierItemId: string,
    newState: boolean
  ) => {
    const productDataAr = await storesRepository.fetchStoreProductstore({
      ln: "ar",
      storeId: storeId,
    } as StoreRepo);
    const productDataEn = await storesRepository.fetchStoreProductstore({
      ln: "en",
      storeId: storeId,
    } as StoreRepo);
    console.log(productDataAr);
    if (!productDataAr.products || !productDataEn.products) {
      throw new Error("Store not found or product data missing");
    }

    const productAr = productDataAr.products;
    const productEn = productDataEn.products;

    const modifiersAr = productAr.modifiers;
    const modifiersEn = productEn.modifiers;

    if (!Array.isArray(modifiersAr) || !Array.isArray(modifiersEn)) {
      throw new Error("Modifiers list not found in product data");
    }

    const updatedModifiersAr = modifiersAr.map((modifier) => {
      const updatedItems = modifier.items.map((item) =>
        item.modifiers_item_id === modifierItemId
          ? { ...item, is_enable: newState }
          : item
      );
      return { ...modifier, items: updatedItems };
    });

    const updatedModifiersEn = modifiersEn.map((modifier) => {
      const updatedItems = modifier.items.map((item) =>
        item.modifiers_item_id === modifierItemId
          ? { ...item, is_enable: newState }
          : item
      );
      return { ...modifier, items: updatedItems };
    });

    // تحديث البيانات
    productAr.modifiers = updatedModifiersAr;
    productEn.modifiers = updatedModifiersEn;

    // رفعها إلى قاعدة البيانات
    await storesRepository.updateProductDataByStoreId("ar", storeId, productAr);
    await storesRepository.updateProductDataByStoreId("en", storeId, productEn);

    return { success: true };
  },
  //------------------------------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------

  getCoupons: async (
        partnerId: number,

    storeId: string,
    page: number,
    pageSize: number) => {
  // ): Promise<
  //   Array<{
  //     code: string;
  //     description: string;
  //     discount_value_percentage: number;
  //     on_expense: string;
  //     min_order_value: number;
  //     expiration_date: Date;
  //     max_usage: number;
  //     real_usage: number;
  //     coupon_type: string;
  //     store_name: string;
  //   }>
  // > 
 
      const offset = (page - 1) * pageSize;

    const isSingleStore = !!storeId;

    let storeIds: number[];

    if (isSingleStore) {
        const { internal_id } = await partnerClient.getStoreId(storeId);
            storeIds = [internal_id];
          } else {
                  const stores = await partnerClient.geInfoByStoreIds(partnerId);
                  storeIds = stores.map((row) => row.internal_id);
          }

   const [rows, total] = await Promise.all([
 storesRepository.getCoupons(storeIds,  pageSize,offset),
        storesRepository.getCouponsCountstore(storeIds),

   ]);
  return {
    data: {
      copouns: rows,
      pagination: {
    total: total,
    page: Number(page),
    pageSize: Number(pageSize),
    totalPages: Math.ceil(total / pageSize),
  },
    }
  };
  },
  //------------------------------------------------------------------------------------------------------------------
  getCategoryTagsService: async (params: TagService) => {
    return await storesRepository.fetchCategoryTags({
      ln: params.ln,
      categoryId: params.categoryId,
    } as CategoryService);
  },
  getStoreCategoriesService: async (language: LanguageService) => {
    const res = (
      await storesRepository.fetchStoreCategories({
        ln: language.ln,
      } as LanguageService)
    ).map((row) => ({
      category_id: row.category_id,
      category_name: row.category_name,
      category_image: serverHost + storeImagePath + row.category_image,
    }));
    return res;
  },

  getNearStoresService: async (params: NearStoresService) => {
    let storeRows = await storesRepository.getNearStores({
      ln: params.ln,
      latitudes: params.latitudes,
      logitudes: params.logitudes,
      locationCode: params.locationCode,
      limit: params.limit,
      offset: params.offset,
      distanceKm: DeliveryConfig.maxDistance,
    } as NearStoresRepo);
    let trendRows = await storesRepository.getNearTrendStores({
      ln: params.ln,
      latitudes: params.latitudes,
      logitudes: params.logitudes,
      locationCode: params.locationCode,
      limit: params.limit / 2,
      offset: params.offset,
      distanceKm: DeliveryConfig.maxDistance,
    } as NearStoresRepo);

    return rowsJson(storeRows, trendRows, params.limit);
  },

  getNearStoresByTagService: async (params: NearStoresBytagService) => {
    let storeRows = await storesRepository.getNearStoresbyTag({
      ln: params.ln,
      latitudes: params.latitudes,
      logitudes: params.logitudes,
      locationCode: params.locationCode,
      limit: params.limit + 1,
      offset: params.offset,
      distanceKm: DeliveryConfig.maxDistance,
      tagId: params.tagId,
    } as NearStoresBytagRepo);
    let trendRows = await storesRepository.getNearTrendStoresbyTag({
      ln: params.ln,
      latitudes: params.latitudes,
      logitudes: params.logitudes,
      locationCode: params.locationCode,
      limit: params.limit / 2 + 1,
      offset: params.offset,
      distanceKm: DeliveryConfig.maxDistance,
      tagId: params.tagId,
    } as NearStoresBytagRepo);
    return rowsJson(storeRows, trendRows, params.limit);
  },
  getNearStoresByCategoryService: async (params: NearStoresByCategoryReq) => {
    let storeRows = await storesRepository.getNearStoresbyCategory({
      ln: params.ln,
      latitudes: params.latitudes,
      logitudes: params.logitudes,
      locationCode: params.locationCode,
      limit: params.limit + 1,
      offset: params.offset,
      distanceKm: DeliveryConfig.maxDistance,
      categoryId: params.categoryId,
    } as NearStoresByCategoryRepo);
    let trendRows = await storesRepository.getNearTrendStoresbyCategory({
      ln: params.ln,
      latitudes: params.latitudes,
      logitudes: params.logitudes,
      locationCode: params.locationCode,
      limit: params.limit / 2 + 1,
      offset: params.offset,
      distanceKm: DeliveryConfig.maxDistance,
      categoryId: params.categoryId,
    } as NearStoresByCategoryRepo);
    return rowsJson(storeRows, trendRows, params.limit);
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
  SearchForStoreService: async (params: SearchForStoreService) => {
    let rows = await storesRepository.SearchForStore({
      ln: params.ln,
      latitudes: params.latitudes,
      logitudes: params.logitudes,
      locationCode: params.locationCode,
      limit: params.limit,
      offset: params.offset,
      distanceKm: DeliveryConfig.maxDistance,
      storeName :params.storeName
    } as SearchForStoreRepo
    );
        return searchRowsJson(rows,[],params.limit) 

  },
  getStoreProductsService: async (params: StoreService) => {
    let row = await storesRepository.fetchStoreProduct({
      ln: params.ln,
      storeId: params.storeId,
    } as StoreRepo);
    if (row != undefined) {
      for (let i = 0; i < row.products.items.length; i++) {
        row.products.items[i].image_url =
          serverHost + storeImagePath + row.products.items[i].image_url;
      }
    }
    return row;
  },
  getCouponDetailsService: async (coupon: CouponDetailsService) => {
    const copounDetails = await storesRepository.fetchCouponStore({
      couponCode: coupon.couponCode,
      storeId: coupon.storeId,
    } as CouponDetailsRepo);
    return copounDetails;
  },
  getWorkingHoursServie: async (params: StoreIdService) => {
    return await storesRepository.fetchWorkingHours({
      storeId: params.storeId,
    } as StoreIdRepo);
  },
//--------------------------------------------------------
  getOrderItemsService: async (params :OrderInputWithStoreId) => {
    const {ar,en} =await storesRepository.getOrderItems({storeId : params.storeId}as StoreIdRepo);
    const arOrder =resolveOrderDetails(ar,params.order)
    //TODO Enable english 
    const enOrder= resolveOrderDetails(en,params.order)
    //TODO if enOrder.total_price, ==arOrder.total_price,
    return{
      ar :arOrder.order,
      en :enOrder.order,
      total_price :enOrder.total_price,

    }
  },

  storeDistanceService: async (params :StoreDistance) => {
    return await storesRepository.storeDistance({  latitudes: params.latitudes,
  logitudes: params.logitudes,
  storeId: params.storeId}as StoreDistance) <= DeliveryConfig.maxDistance



  },
isOpenNowService: async (param: StoreIdRepo) => {
    return await storesRepository.isOpenNow(param) > 0
  },


};
//--------------------------------------------------------

export function resolveOrderDetails(menu: MenuData, order: OrderInput) {
  let totalPrice =0 ;
  let orderResolves :ResolvedOrderItem[] =  order.OrderInputs.map(orderItem => {
  
    const item = menu.items.find(i => i.item_id === orderItem.item_id);
    if (!item) throw new Error(`Item not found: ${orderItem.item_id}`);

    const size = item.sizes.find((s) => s.size_id === orderItem.size_id);
    if (!size) throw new Error(`Size not found for item ${orderItem.item_id}`);

    const resolvedModifiers: ResolvedModifier[] = orderItem.modifiers.map(
      (modInput) => {
        const modifier = menu.modifiers.find(
          (m) => m.modifiers_id === modInput.modifiers_id
        );
        if (!modifier)
          throw new Error(`Modifier not found: ${modInput.modifiers_id}`);
        let modiCount = 0;
        const resolvedItems: ResolvedModifierItem[] =
          modInput.modifiers_item.map((modItemInput) => {
            const modItem = modifier.items.find(
              (mi) => mi.modifiers_item_id === modItemInput.modifiers_item_id
            );
            if (!modItem || !modItem.is_enable)
              throw new Error(
                `Modifier item not found or disabled: ${modItemInput.modifiers_item_id}`
              );
            modiCount += modItemInput.number;
            totalPrice += modItem.price * modItemInput.number;
            return {
              name: modItem.name,
              number: modItemInput.number,
              price: modItem.price,
            };
          });
        if (modiCount > modifier.max || modiCount < modifier.min)
          throw new Error(
            `Modifier item count not currect: ${modifier.modifiers_id}`
          );

        return {
          title: modifier.title,
          items: resolvedItems,
        };
      }
    );
    totalPrice += size.price;
    return {
      item_name: item.name,
      size_name: size.name,
      size_price: size.price,
      size_calories: size.calories,
      modifiers: resolvedModifiers,
      count :orderItem.count,
      note : orderItem.note,
    };
  });
  if(totalPrice==order.total_price){
  return {
          order :orderResolves,
          total_price:totalPrice
  }
}else 
  throw "totalPrice is change "


  //--------------------------------------------------------






  
}

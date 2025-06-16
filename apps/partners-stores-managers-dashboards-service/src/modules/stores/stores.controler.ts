
import { CategoryReq, CategoryService, CouponDetailsReq, StoreProductsReq, LanguageReq,
     NearStoresByCategoryReq, NearStoresByTagReq, NearStoresReq, SearchForStoreReq, StoreIdReq, 
     TagReq,
     TagService,
     NearStoresService,
     NearStoresBytagService,
     NearStoresByCategoryService,
     SearchForStoreService,
     StoreProductsService,
     CouponDetailsService} from '../../types/stores';
import { storesServices } from './stores.service';
export const storesController ={
    getCategoryTags : async    (req, res)=>{
        const query :TagReq = req.query; 
        const params :TagService = {
            categoryId : query.categoryId, 
            ln : query.ln
        }
    const result = await storesServices.getCategoryTagsService(params );
        res.send(result)
} ,
getStoreCategories: async   (req, res)=>{
        const query :CategoryReq = req.query; 
        const params :CategoryService = {
            categoryId : query.categoryId, 
            ln : query.ln
        }
    const result = await storesServices.getStoreCategoriesService(params);
    res.send(result)
}
,
getNearStores: async   (req, res)=>{
    const body : NearStoresReq= req.body 
    const params :NearStoresService = {
        ln: body.ln,
        latitudes:  body.latitudes,
        logitudes:  body.logitudes,
        locationCode:  body.locationCode,
        limit:  body.limit,
        offset:  body.offset,
    }
    const result = await storesServices.getNearStoresService(params);
    res.send(result)
},
getNearStoresByTag: async   (req, res)=>{
    const body :NearStoresByTagReq = req.body  ; 
    const params :NearStoresBytagService = {
        ln: body.ln,
        latitudes: body.latitudes,
        logitudes: body.logitudes,
        locationCode: body.locationCode,
        limit: body.limit,
        offset: body.offset,
        tagId:  body.tagId
    }
    const result = await storesServices.getNearStoresByTagService(params);
    res.send(result)
},
getNearStoresByCategory: async   (req, res)=>{
     const body :NearStoresByCategoryReq =  req.body  ; 
        const params :NearStoresByCategoryService = {
        ln: body.ln,
        latitudes: body.latitudes,
        logitudes: body.logitudes,
        locationCode: body.locationCode,
        limit: body.limit,
        offset: body.offset,
        categoryId:  body.categoryId
    }
    const result = await storesServices.getNearStoresByCategoryService(params);
    res.send(result)
},

/*
getNearTrendStores: async   (req, res)=>{
    const query :NearStoresReq = req.query   
        const params :NearStoresService = {
        ln: query.ln,
        latitudes:  query.latitudes,
        logitudes:  query.logitudes,
        locationCode:  query.locationCode,
        limit:  query.limit,
        offset:  query.offset,
    }
    const result = await storesServices.getNearTrendStoresService(params);
    res.send(result)
},
getNearTrendStoresByTag: async   (req, res)=>{
      const query :NearStoresByTagReq = req.query ; 
    const params :NearStoresBytagService = {
        ln: query.ln,
        latitudes: query.latitudes,
        logitudes: query.logitudes,
        locationCode: query.locationCode,
        limit: query.limit,
        offset: query.offset,
        tagId:  query.tagId
    }
    const result = await storesServices.getNearTrendStoresByTagService(params);
    res.send(result)
},
getNearTrendStoresByCategory: async   (req, res)=>{
      const query :NearStoresByCategoryReq =  req.query ; 
        const params :NearStoresByCategoryService = {
        ln: query.ln,
        latitudes: query.latitudes,
        logitudes: query.logitudes,
        locationCode: query.locationCode,
        limit: query.limit,
        offset: query.offset,
        categoryId:  query.categoryId
    }
    const result = await storesServices.getNearTrendStoresByCategoryService(params);
    res.send(result)
},
*/
searchForStore: async   (req, res)=>{
    const body :SearchForStoreReq = req.body ; 
    const params :SearchForStoreService = {
               ln: body.ln,
        latitudes: body.latitudes,
        logitudes: body.logitudes,
        locationCode: body.locationCode,
        limit: body.limit,
        offset: body.offset,
        storeName: body.storeName
    }
    const result = await storesServices.SearchForStoreService(params);
    res.send(result)
},
getWorkShifts: async   (req, res)=>{
    const query :StoreIdReq = req.query  ; 
    const params : StoreIdReq = {
        storeId:query.storeId
    }

    const result = await storesServices.getWorkingHoursServie(params);
    res.send(result)
},
getStoreProducts: async   (req, res)=>{
    const query : StoreProductsReq = req.query 
     const params :StoreProductsService ={
         ln: query.ln,
         storeId: query.storeId
     }
    const result = await storesServices.getStoreProductsService(params);
    res.send(result)
},
getCouponDetails: async   (req, res)=>{
    const body :CouponDetailsReq = req.body 
const params :CouponDetailsService ={
         couponCode: body.couponCode,
         storeId: body.storeId
     }
    const result = await storesServices.getCouponDetailsService(params);
    res.send(result)
}



}
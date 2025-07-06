
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
import { resolveStoreId } from '../../utils/resolveStoreId';
import { resolvepartnerId } from '../../utils/resolvepartnerId';

export const storesController ={


      //------------------------------------------------------------------------------------------
    
    StoreLogin: async (req, res) => {
      const { userName, password } = req.body;
    console.log(userName+'ussssseeeeeeeeeeeerrrrrrrr name')
      try {
        const stats = await storesServices.loginService(userName, password);
    
        if (stats != null) {
          res.send({
                data: stats,
});
        } else {
          res.status(401).send({ message: "The phone number or password is incorrect." });
        }
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    },
    
      //------------------------------------------------------------------------------------------
    changeItemState: async   (req, res)=>{
    const {itemId,state} = req.body; 

   const storeId = resolveStoreId(req);
   console.log(storeId)
       const result = await storesServices.changeItemState(itemId,storeId,state);
    res.send(result)
},
//---------------------------------------------------------------------------------------------------
  changeModifiersItemState: async (req, res) => {
    try {   const storeId = resolveStoreId(req);

      const {  modifiers_item_id, state } = req.body;
      const stats = await storesServices.changeModifierItemState(
        storeId,
        modifiers_item_id,
        state
      );

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error :", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

    //-------------------------------------------------------------------------------------------------------
  
    getCoupons: async (req, res) => {
      try {
      const partnerId = resolvepartnerId(req); 

          const storeId = resolveStoreId(req);
        const {  page, pageSize } = req.query;
        const stats = await storesServices.getCoupons(partnerId,storeId, page, pageSize);
  
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
    getCategoryTag : async    (req, res)=>{
        const ln = req.query.ln; 
        const categoryId = req.query.categoryId; 
    const result = await storesServices.getCategoryTagsService({ln : ln,categoryId :categoryId} as TagService);
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
         storeId: resolveStoreId(req)
     }
    const stats = await storesServices.getStoreProductsServicestore(params);

      return res.status(200).json(stats)},
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
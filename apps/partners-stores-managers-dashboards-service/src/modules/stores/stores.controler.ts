
import { storesServices } from './stores.service';
export const storesController ={
    getCategoryTag : async    (req, res)=>{
        const ln = req.query.ln; 
        const categoryId = req.query.categoryId; 
    const result = storesServices.getCategoryTagsService(ln,categoryId);
        res.send(result)
} ,
getStoreCategories: async   (req, res)=>{
    const ln = req.query.ln; // undefined لأن 'ln' بدون قيمة

    const result = storesServices.getStoreCategoriesService(ln);
    res.send(result)
}
,
getStoreProducts: async   (req, res)=>{
    const ln = req.query.ln; 
    const storeId = req.query.storeId; 

    const result = storesServices.getStoreProductsService(ln,storeId);
    res.send(result)
},
getCouponDetails: async   (req, res)=>{
    const {couponCode,storeId} = req.body

    const result = storesServices.getCouponDetailsService(couponCode,storeId);
    res.send(result)
}
}
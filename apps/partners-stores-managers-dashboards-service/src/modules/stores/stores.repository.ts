import {query} from '../../../../../modules/database/commitCustomerSQL'

export const storesRepository= {


fetchCategoryTags : async (ln,categoryId) =>{
    //TODO after login or first reques save token in redis
    if(ln=="ar"){
    const {rows} =  await query('select tag_id,tag_name_ar as tag_name from tags where category_id=$1 ',[categoryId])
    return rows
}else if(ln=="en")
{
    const {rows} =  await query('select tag_id,tag_name_en as tag_name from tags where category_id=$1 ',[categoryId])
    return rows
}
},
fetchStoreCategories : async (ln) =>{
    //TODO after login or first reques save token in redis
    if(ln=="ar"){
        //TODO make server return url with ip
     const {rows} =await query('select tag_id,category_name_ar as category_name,category_image from store_categories ',[])
        return rows 
}else if(ln=="en"){
    const {rows} =await query('select tag_id,category_name_en as category_name,category_image from store_categories ',[])
    return rows     
}
},
fetchStoreProduct:async(ln,storeId)=>{
    if(ln=="ar"){
        //TODO make server return url with ip
     const {rows,rowCount} =await query('select product_data_ar_jsonb as products from products where store_id = $1 ',[storeId])
     if(rowCount>0){
        return rows[0]

     }else 
     return({

     })
}else if(ln=="en"){
    const {rows,rowCount} =await query('select product_data_en_jsonb as products from products where store_id = $1 ',[storeId])
    if(rowCount>0){
        return rows[0]

     }else 
     return({

     })     
}},
fetchCouponStore:async(couponCode,storeId)=>{
    //TODO : check order coupon if end 
    //TODO : get round from setting
    const {rows,rowCount} =await query(`select discount_value_percentage as products,min_order_value from coupons where code =$1 AND store_id = $2 AND expiration_date > now() AND
         real_usage IS NULL OR max_usage IS NULL OR real_usage < max_usage `,[couponCode,storeId])
         if(rowCount>0){
            return rows[0]

         }else 
         return({

         })
}
}


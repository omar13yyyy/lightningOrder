import {storesRepository} from './stores.repository'
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken'

export const  storesServices = {
    getCategoryTagsService : async (ln ,categoryId)=>{
        return await storesRepository.fetchCategoryTags(ln,categoryId)
    },
    getStoreCategoriesService : async (ln)=>{
        return await storesRepository.fetchStoreCategories(ln)
    },
    getStoreProductsService  : async (ln,storeId)=>{
        return await storesRepository.fetchStoreProduct(ln,storeId)
    },
    getCouponDetailsService  : async (couponCode,storeId)=>{
        return await storesRepository.fetchCouponStore(couponCode,storeId)
    },
}
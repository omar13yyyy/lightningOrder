import {storesRepository} from './stores.repository'
import bcrypt from "bcrypt"
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
        const copounDetails = await storesRepository.fetchCouponStore(couponCode,storeId)
        return copounDetails
    },
        getWorkingHoursServie: async (storeId) => {
    return await storesRepository.fetchWorkingHours(storeId);
  },
}
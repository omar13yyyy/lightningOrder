import {storesRepository} from './stores.repository'
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken'
//--------------------------------------------------------------------------------------------------
export const  storesServices = {
 loginService: async (
    userName: string,
    reqPassword: string
  ): Promise<string | null> => {
    const result = await storesRepository.fetchStoreIdPasswordByUserName(
      userName
    );
    const { encrypted_password,  store_id } = result[0];
console.log(store_id+'stooooreeeid')
    const isMatch = await bcryptjs.compare(reqPassword, encrypted_password);
    if (isMatch) {
      const token = jwt.sign(
        { store_id: store_id },
        process.env.TOKEN_SECRET_ADMIN as string
      );
      return token;
    }

    return null;
  },
  //----------------------------------------------------------------------------------------------
  changeItemState : async (itemId,store_id, newState)=>{
          const productDataar= await storesRepository.fetchStoreProduct("ar",store_id)
                    const productDataen= await storesRepository.fetchStoreProduct("en",store_id)

  if (!productDataar||!productDataen) {
      throw new Error("Store not found or product data missing");
    }
console.log(productDataar.products.items,newState)

const itemsar = productDataar.products.products.items;
const itemsen = productDataen.products.products.items;

    if (!Array.isArray(itemsar)||!Array.isArray(itemsen)) {
      throw new Error("Items list not found in product data");
    }

    const updatedItemsar = itemsar.map((item: any) =>
      item.id === itemId ? { ...item, is_activated: newState } : item
    );

productDataar.products.products.items = updatedItemsar;
  const updatedItemsen = itemsen.map((item: any) =>
      item.id === itemId ? { ...item, is_activated: newState } : item
    );
productDataen.products.products.items = updatedItemsen;



    await storesRepository.updateProductDataByStoreId('ar',store_id, productDataar);
    await storesRepository.updateProductDataByStoreId('en',store_id, productDataen);

    return { success: true };  
  },
    //----------------------------------------------------------------------------------------
  changeModifierItemState: async (
  storeId: string,
  modifierItemId: string,
  newState: boolean
) => {
  const productDataAr = await storesRepository.fetchStoreProduct('ar', storeId);
  const productDataEn = await storesRepository.fetchStoreProduct('en', storeId);
console.log(productDataAr)
  if (!productDataAr.products || !productDataEn.products) {
    throw new Error('Store not found or product data missing');
  }

  const productAr = productDataAr.products;
  const productEn = productDataEn.products;

  const modifiersAr = productAr.modifiers;
  const modifiersEn = productEn.modifiers;

  if (!Array.isArray(modifiersAr) || !Array.isArray(modifiersEn)) {
    throw new Error('Modifiers list not found in product data');
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
  await storesRepository.updateProductDataByStoreId('ar', storeId, productAr);
  await storesRepository.updateProductDataByStoreId('en', storeId, productEn);

  return { success: true };
}
,
  //--------------------------------------------------------------------------------------------------------
  
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
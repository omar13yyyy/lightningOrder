/*
export const services = { fun1, fun2 };

*/

import { storesController } from "./modules/stores/stores.controler";
import express from 'express';
export const visitorStoreRouter= express.Router()

visitorStoreRouter.route('/getCategoryTags').post(storesController.getCategoryTag)
visitorStoreRouter.route('/getStoreCategories').post(storesController.getStoreCategories)
visitorStoreRouter.route('/getStoreProducts').post(storesController.getStoreProducts)
visitorStoreRouter.route('/getCouponDetails').post(storesController.getCouponDetails)






/*
join in json

{
let partners = select partners where id = 1

let store = select store where partner_id = 1

stores.map(store => ({
    ...store
    patner: patner.find (p=>p.id == store.partner_id)


}))
}

*/
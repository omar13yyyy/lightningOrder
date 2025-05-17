/*
export const services = { fun1, fun2 };

*/

import { storesController } from "./modules/stores/stores.controler";
import express from 'express';
export const visitorStoreRouter= express.Router()

visitorStoreRouter.route('/getCategoryTags').get(storesController.getCategoryTag)
visitorStoreRouter.route('/getStoreCategories').get(storesController.getStoreCategories)
visitorStoreRouter.route('/getStoreProducts').get(storesController.getStoreProducts)
visitorStoreRouter.route('/getCouponDetails').get(storesController.getCouponDetails)






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
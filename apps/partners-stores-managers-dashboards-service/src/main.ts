/*
export const services = { fun1, fun2 };

*/
//import { userHyperdAuth } from '../../app-geteway/src/middleware/userHyperdAuth.middleware';

import { storesController } from "./modules/stores/stores.controler";
import { partnersController } from "./modules/partners/partners.controler";
import express from 'express';
import { get } from "http";
import checkStoreOwnership from "../../app-geteway/src/middleware/checkStoreOwnership";
export const visitorStoreRouter= express.Router()
export const partnerRouter= express.Router()


visitorStoreRouter.route('/getCategoryTags').get(storesController.getCategoryTags)
visitorStoreRouter.route('/getStoreCategories').get(storesController.getStoreCategories)
visitorStoreRouter.route('/getStoreProducts').get(storesController.getStoreProducts)
visitorStoreRouter.route('/getCouponDetails').get(storesController.getCouponDetails)
visitorStoreRouter.route('/getNearStores').post(storesController.getNearStores)
visitorStoreRouter.route('/getNearStoresByTag').post(storesController.getNearStoresByTag)
visitorStoreRouter.route('/getNearStoresByCategory').post(storesController.getNearStoresByCategory)
/*
visitorStoreRouter.route('/getTrendStores').get(storesController.getNearTrendStores)
visitorStoreRouter.route('/getNearTrendStoresByTag').get(storesController.getNearTrendStores)
visitorStoreRouter.route('/getNearTrendStoresByCategory').get(storesController.getNearTrendStoresByCategory)
*/


visitorStoreRouter.route('/SearchForStore').post(storesController.searchForStore)

visitorStoreRouter.route('/getWorkShifts').get(storesController.getWorkShifts)
visitorStoreRouter.route('/getStoreProducts').get(storesController.getStoreProducts)
visitorStoreRouter.route('/getCouponDetails').get(storesController.getCouponDetails)



partnerRouter.route('/partnerLogin').post(partnersController.partnerLogin)
//partnerRouter.use(userHyperdAuth);
partnerRouter.route('/partnergetAllStors').get(partnersController.partnergetAllStores)
partnerRouter.route('/partnerInfo').get(partnersController.partnerInfo)
partnerRouter.route('/getStatistics').get(partnersController.getStatistics)

partnerRouter.route('/partnergetAllStores').get(partnersController.partnergetAllStores)
partnerRouter.route('/bestSeller').get(partnersController.bestSeller)
partnerRouter.route('/profile').get(partnersController.profile)
partnerRouter.route('/changeStoreState').post(partnersController.changeStoreState)
partnerRouter.route('/getStoreProfile').post(partnersController.getStoreProfile)
partnerRouter.route('/getSpecialCustomers').get(partnersController.getSpecialCustomers)

//partnerRouter.route('/getCurrentStatistics').get(partnersController.getCurrentStatistics)





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
/*
export const services = { fun1, fun2 };

*/
import auth from '../../app-geteway/src/middleware/auth.middleware';

import { storesController } from "./modules/stores/stores.controler";
import { partnersController } from "./modules/partners/partners.controler";
import express from 'express';
import { get } from "http";
import checkStoreOwnership from "../../app-geteway/src/middleware/checkStoreOwnership";
export const visitorStoreRouter= express.Router()
export const partnerRouter= express.Router()
export const storeRouter= express.Router()

visitorStoreRouter.route('/getCategoryTags').get(auth,storesController.getCategoryTag)
visitorStoreRouter.route('/getStoreCategories').get(storesController.getStoreCategories)
visitorStoreRouter.route('/getStoreProducts').get(storesController.getStoreProducts)
visitorStoreRouter.route('/getCouponDetails').get(storesController.getCouponDetails)
visitorStoreRouter.route('/getNearStores').post(storesController.getNearStores)
visitorStoreRouter.route('/getStoresByTag').post(storesController.getNearStoresByTag)
visitorStoreRouter.route('/getStoresByCategory').post(storesController.getNearStoresByCategory)
/* 
visitorStoreRouter.route('/getNearTrendStores').get(storesController.getNearTrendStores)
visitorStoreRouter.route('/getTrendStoresByTag').get(storesController.getNearTrendStores)
visitorStoreRouter.route('/getTrendStoresByCategory').get(storesController.getNearTrendStoresByCategory)
 */


visitorStoreRouter.route('/SearchForStore').post(storesController.searchForStore)

visitorStoreRouter.route('/getWorkShifts').get(storesController.getWorkShifts)
visitorStoreRouter.route('/getStoreProducts').get(storesController.getStoreProducts)
visitorStoreRouter.route('/getCouponDetails').get(storesController.getCouponDetails)




storeRouter.route('/StoreLogin').post(storesController.StoreLogin)
storeRouter.route('/getStoreProducts').get(auth,storesController.getStoreProducts)
storeRouter.route('/changeItemState').post(auth,storesController.changeItemState)
storeRouter.route('/changeModifiersItemState').post(auth,storesController.changeModifiersItemState)




partnerRouter.route('/partnerLogin').post(partnersController.partnerLogin)
//partnerRouter.use(userHyperdAuth);
partnerRouter.use(auth);

partnerRouter.route('/partnergetAllStors').get(partnersController.partnergetAllStores)
partnerRouter.route('/geInfoByStoreIds').get(partnersController.geInfoByStoreIds)

partnerRouter.route('/partnerInfo').get(auth,partnersController.partnerInfo)
partnerRouter.route('/getStatistics').get(partnersController.getStatistics)

partnerRouter.route('/partnergetAllStores').get(partnersController.partnergetAllStores)
partnerRouter.route('/bestSeller').get(partnersController.bestSeller)
partnerRouter.route('/profile').get(partnersController.profile)
partnerRouter.route('/changeStoreState').post(partnersController.changeStoreState)
partnerRouter.route('/getStoreProfile').get(partnersController.getStoreProfile)
partnerRouter.route('/getSpecialCustomers').get(partnersController.getSpecialCustomers)
partnerRouter.route('/walletTransferHistorystore').get(partnersController.walletTransferHistorystore)
partnerRouter.route('/walletTransferHistory').get(partnersController.walletTransferHistory)
partnerRouter.route('/gePartnerBalance').get(partnersController.gePartnerBalance)
partnerRouter.route('/BalanceWithdrawalRequest').post(partnersController.BalanceWithdrawalRequest)

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
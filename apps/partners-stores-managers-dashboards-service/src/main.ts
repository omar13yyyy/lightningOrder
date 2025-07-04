/*
export const services = { fun1, fun2 };

*/
import {auth} from '../../app-geteway/src/middleware/auth.middleware';
import { dataEntryControler } from "./modules/dashBoard/dataEntry/dashBoard.dataEntry.controler";

import { storesController } from "./modules/stores/stores.controler";
import { partnersController } from "./modules/partners/partners.controler";
import express from 'express';
import { get } from "http";
import checkStoreOwnership from "../../app-geteway/src/middleware/checkStoreOwnership";
export const visitorStoreRouter= express.Router()
export const partnerRouter= express.Router()
export const storeRouter= express.Router()
export const dataentryRouter= express.Router()

visitorStoreRouter.route('/getCategoryTags').get(/* auth ,*/storesController.getCategoryTag)
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

dataentryRouter.route('/Login').post(dataEntryControler.Login)
dataentryRouter.route('/getPartners').get(dataEntryControler.getPartners)
dataentryRouter.route('/getPartnersForSearch').get(dataEntryControler.getPartnersForSearch)
dataentryRouter.route('/changeParenterState').post(dataEntryControler.changeParenterState)
dataentryRouter.route('/getPartner').get(dataEntryControler.getPartner)
dataentryRouter.route('/addPartner').post(dataEntryControler.addPartner)
dataentryRouter.route('/editPartner').post(dataEntryControler.editPartner)
dataentryRouter.route('/deleteCategory').post(dataEntryControler.deleteCategory)
dataentryRouter.route('/editCategory').post(dataEntryControler.editCategory)
dataentryRouter.route('/addCategory').post(dataEntryControler.addCategory)
dataentryRouter.route('/addNewItem').post(dataEntryControler.addNewItem)
dataentryRouter.route('/EditItem').post(dataEntryControler.EditItem)
dataentryRouter.route('/deleteItem').post(dataEntryControler.deleteItem)
dataentryRouter.route('/EditItemWithImage').post(dataEntryControler.EditItemWithImage)


partnerRouter.route('/partnerLogin').post(partnersController.partnerLogin)
storeRouter.route('/StoreLogin').post(storesController.StoreLogin)



partnerRouter.route('/partnergetAllStors').get(auth(['partner','admin']),partnersController.partnergetAllStores)
partnerRouter.route('/geInfoByStoreIds').get(auth(['partner','admin']),partnersController.geInfoByStoreIds)
partnerRouter.route('/partnergetAllStores').get(auth(['partner','admin']),partnersController.partnergetAllStores)
partnerRouter.route('/BalanceWithdrawalRequest').post(auth(['partner','admin']),partnersController.BalanceWithdrawalRequest)
partnerRouter.route('/walletTransferHistory').get(auth(['partner','admin']),partnersController.walletTransferHistory)

partnerRouter.use(auth(['partner','manager','admin']));
storeRouter.use(auth(['partner','manager','admin']));

partnerRouter.route('/partnerInfo').get(partnersController.partnerInfo)

storeRouter.route('/getStoreProducts').get(storesController.getStoreProducts)
storeRouter.route('/changeItemState').post(storesController.changeItemState)
storeRouter.route('/changeModifiersItemState').post(storesController.changeModifiersItemState)
storeRouter.route('/getCoupons').get(storesController.getCoupons)


partnerRouter.route('/getStatistics').get(partnersController.getStatistics)
partnerRouter.route('/bestSeller').get(partnersController.bestSeller)
partnerRouter.route('/profile').get(partnersController.profile)
partnerRouter.route('/changeStoreState').post(partnersController.changeStoreState)
partnerRouter.route('/getStoreProfile').get(partnersController.getStoreProfile)
partnerRouter.route('/getSpecialCustomers').get(partnersController.getSpecialCustomers)
partnerRouter.route('/walletTransferHistorystore').get(partnersController.walletTransferHistorystore)
partnerRouter.route('/gePartnerBalance').get(partnersController.gePartnerBalance)

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
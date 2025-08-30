/*
export const services = { fun1, fun2 };

*/
import {auth} from '../../app-geteway/src/middleware/auth.middleware';
import { dataEntryControler } from "./modules/dashBoard/dataEntry/dashBoard.dataEntry.controler";
import multer from 'multer';

import { storesController } from "./modules/stores/stores.controler";
import { partnersController } from "./modules/partners/partners.controler";
import express from 'express';
import { get } from "http";
import checkStoreOwnership from "../../app-geteway/src/middleware/checkStoreOwnership";
export const visitorStoreRouter= express.Router()
export const partnerRouter= express.Router()
export const storeRouter= express.Router()
export const dataentryRouter= express.Router()
const upload = multer({ storage: multer.memoryStorage() });

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
dataentryRouter.route('/addModifier').post(dataEntryControler.addModifier)
dataentryRouter.route('/editModifier').post(dataEntryControler.editModifier)
dataentryRouter.route('/deleteModifier').post(dataEntryControler.deleteModifier)
dataentryRouter.route('/addModifierItem').post(dataEntryControler.addModifierItem)
dataentryRouter.route('/editModifiersItem').post(dataEntryControler.editModifiersItem)
dataentryRouter.route('/deleteModifierItem').post(dataEntryControler.deleteModifierItem)
dataentryRouter.route('/addSize').post(dataEntryControler.addSize)
dataentryRouter.route('/editSize').post(dataEntryControler.editSize)
dataentryRouter.route('/deleteSize').post(dataEntryControler.deleteSize)
dataentryRouter
  .route('/addStoreBranch')
  .post(
    upload.fields([
      { name: 'logo',  maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
    dataEntryControler.addStoreBranch
  );dataentryRouter.route('/getCategories').get(dataEntryControler.getCategories)
dataentryRouter.route('/createCategory').post(dataEntryControler.createCategory)
dataentryRouter.route('/getTags').get(dataEntryControler.getTags)
dataentryRouter.route('/createTag').post(dataEntryControler.createTag)
dataentryRouter.route('/addDriver')
  .post(
    upload.fields([
      { name: 'driver_image', maxCount: 1 },
      { name: 'plate', maxCount: 1 },
      { name: 'driving_license_image', maxCount: 1 },
      { name: 'images', maxCount: 5 },
    ]),
    dataEntryControler.addDriver
  );

dataentryRouter.route('/getDriverDetails').get(dataEntryControler.getDriverDetails);
dataentryRouter.route('/getDrivers').get(dataEntryControler.getDrivers);
dataentryRouter.post('/addTrend', upload.single('contract_image'), dataEntryControler.addTrend);
dataentryRouter.post('/stopTrend', dataEntryControler.stopTrend);
dataentryRouter.get('/getStoreTrends', dataEntryControler.getStoreTrends);
// القراءة العامة
dataentryRouter.route('/getWorkShifts').get(dataEntryControler.getWorkShifts);

// إدارة الشيفتات
dataentryRouter.route('/addWorkShift').post(dataEntryControler.addWorkShift);
dataentryRouter.route('/deleteWorkShift').post(dataEntryControler.deleteWorkShift);
dataentryRouter.get('/newWithdrawalRequestsPartner', dataEntryControler.newWithdrawalRequestsPartner);
dataentryRouter.get('/waitWithdrawalRequestsPartner', dataEntryControler.waitWithdrawalRequestsPartner);
dataentryRouter.post('/withdrawalRequestsStatusPartner', dataEntryControler.withdrawalRequestsStatusPartner);
dataentryRouter.post('/withdrawalRequestDonePartner', dataEntryControler.withdrawalRequestDonePartner);
dataentryRouter.get('/withdrawalRequestsDriver', dataEntryControler.withdrawalRequestsDriver);




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
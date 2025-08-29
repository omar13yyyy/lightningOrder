import {AllpartnersService} from '../partners-stores-managers-dashboards-service/index'

export const partnerClient ={

     geInfoByStoreIds: async (partnerId: string) => {
    return await AllpartnersService.partnersService.geInfoByStoreIdsService(partnerId);
  },
     getStoreId: async (store_id: string) => {
    return await AllpartnersService.partnersService.getStoreId(store_id);
  }
}



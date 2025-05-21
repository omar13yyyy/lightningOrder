import {AllpartnersService} from '../partners-stores-managers-dashboards-service/index'
export const partnerClient ={

     geInfoByStoreIds: async (partnerId: string) => {
    return await AllpartnersService.partnersService.geInfoByStoreIdsService(partnerId);
  }

}

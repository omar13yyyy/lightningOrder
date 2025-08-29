import { AllpartnersService } from "../partners-stores-managers-dashboards-service/index";
import { allCustomersServices } from "../customers-service/index";
import { allDeliveryServices } from "../delivery-service/index";

import { storesServicesExport } from "../partners-stores-managers-dashboards-service/src/modules/index";

import { ServiceClient } from "../../modules/http-client/service-client";
import { AddAllDriversAndOrdersRequest, OrderWithDrivers, AddAllStoresRequest, GetNearStoresRequest, NearStoresResponse }
 from "../partners-stores-managers-dashboards-service/src/types/finderClient";


export const customersServicesClient =allCustomersServices

export const storesServicesClient =storesServicesExport

export const deliveryServicesClient =allDeliveryServices





export const partnerClient = {
  geInfoByStoreIds: async (partnerId: number) => {
    return await AllpartnersService.partnersService.geInfoByStoreIdsService(
      partnerId
    );
    
  },
  getStoreId: async (store_id: string) => {
    return await AllpartnersService.partnersService.getStoreId(store_id);
  },
};


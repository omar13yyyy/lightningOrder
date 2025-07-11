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
let finderHost :string= process.env.FINDER_HOST_PORT||"http://localhost:8001"

const finderService = new ServiceClient(finderHost);

export const finderClient = {
  driverFinder: async (driverFinderBody:AddAllDriversAndOrdersRequest): Promise<OrderWithDrivers> => {
    return await finderService.request({
      method: "POST",
      data: driverFinderBody,
      url: `/driverFinder`,
    });
  },

  addAllStores: async (addAllStoresBody:AddAllStoresRequest): Promise<string> => {
    return await finderService.request({
      method: "POST",
      data: addAllStoresBody,
      url: `/addAllStores`,
    });
  },

  getNearStores: async (getNearStoresBody :GetNearStoresRequest): Promise<NearStoresResponse> => {
    return await finderService.request({
      method: "POST",
      data: getNearStoresBody,
      url: `/getNearStores`,
    });
  },
    addAllTrendStores: async (addAllStoresBody :AddAllStoresRequest): Promise<string> => {
    return await finderService.request({
      method: "POST",
      data: addAllStoresBody,
      url: `/addAllTrendStores`,
    });
  },

  getNearTrendStores: async (getNearStoresBody :GetNearStoresRequest): Promise<NearStoresResponse> => {
    return await finderService.request({
      method: "POST",
      data: getNearStoresBody,
      url: `/getNearTrendStores`,
    });
  },
};

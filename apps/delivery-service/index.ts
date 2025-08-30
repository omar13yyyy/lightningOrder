import { ServiceClient } from '../../modules/http-client/service-client'
import { AddAllDriversAndOrdersRequest, OrderWithDrivers, AddAllStoresRequest, GetNearStoresRequest, AddAllDriversRequest, GetDriverRequest, DeleteDriverRequest, NearStoresResponse, OrdersWithDriversResponse } from '../partners-stores-managers-dashboards-service/src/types/finderClient'
import { DriverId } from '../socket-service/types/types'
import {deliveryServices} from './src/modules/delivery/delivery.service'

export const allDeliveryServices =deliveryServices




let finderHost :string= process.env.FINDER_HOST_PORT||"http://localhost:8001"

const finderService = new ServiceClient(finderHost);

export const finderClient = {
  driverFinder: async (driverFinderBody:AddAllDriversAndOrdersRequest): Promise<string> => {
    return await finderService.request({
      method: "POST",
      data: driverFinderBody,
      url: `/driverFinder`,
    });
  },
  addAllDrivers: async (driverFinderBody:AddAllDriversRequest): Promise<string> => {
    return await finderService.request({
      method: "POST",
      data: driverFinderBody,
      url: `/addAllDrivers`,
    });
  },
    getDriver: async (driverFinderBody:GetDriverRequest): Promise<OrdersWithDriversResponse> => {
      console.log("get driver driverFinderBody",driverFinderBody)
    return await finderService.request({
      method: "POST",
      data: driverFinderBody,
      url: `/getDriver`,
    });
  },
    deleteDriver: async (driverFinderBody:DeleteDriverRequest): Promise<string> => {
    return await finderService.request({
      method: "DELETE",
      data: driverFinderBody,
      url: `/deleteDriver`,
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

interface LocationData {
  id: string;
  latitude: number;
  longitude: number;
  location_code: string;
}
export interface AddAllDriversAndOrdersRequest {
  drivers: LocationData[];
  orders: LocationData[];
  driversForOrder: number;
  maxDistance: number;
}



export interface OrdersWithDriversResponse {
  orders: {
    order: OrderWithDrivers[];
  };
}

interface idWithDist {
  id: string;
  distance: number;
}
export interface OrderWithDrivers {
  orderId: string;
  driverIds: idWithDist[];
}





export interface AddAllStoresRequest {
  stores: LocationData[];
}
export interface GetNearStoresRequest {
  id: string;
  latitude: number;
  longitude: number;
  location_code: string;
  maxDistance: number;
  limit: number;
  offset: number;
}




export interface NearStoresResponse {
  stores: {
    storeIds: idWithDist[];
    id: string;
  };
}

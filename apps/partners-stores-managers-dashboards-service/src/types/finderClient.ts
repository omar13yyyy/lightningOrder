import { TotalResolved } from "./order";

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
export interface AddAllDriversRequest {
  drivers: LocationData[];
  vehicle:"motorcycle"|"bicycle"|"car" 
}
export interface GetDriverRequest {
  driversForOrder: number;
  maxDistance: number;
  id :string;
  location_code : string;
  longitude:number;
  latitude:number;
  vehicle:string
}

export interface GetDriverResponse {
  driverIds
  orderId
}



export interface DeleteDriverRequest {
  id :string;
  locationCode : string;
}

export interface OrdersWithDriversResponse {
    order: OrderWithDrivers;
  
}

interface idWithDist {
  id: string;
  distance: number;
}
export interface OrderWithDrivers {
  orderId: string;
  driverIds: idWithDist[];
}
export interface OrderWithDriver {
  orderId:string;
  totalResolved : TotalResolved;
  orderCouponDetails :string;
  storeNameAr: string;      
  storeNameEn: string;       
  storeLat: number;          
  storeLon: number;          
  customerLat: number;       
  customerLon: number;       // Customer longitude
  customerNumber: string;    // Customer phone number
  paymentMethod: "cash"|"online"
  deliveryDiscount: number;  
  orderDiscount: number;     
  totalBill: number;         

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

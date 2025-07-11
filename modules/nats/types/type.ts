import {TotalResolved} from "../../../apps/partners-stores-managers-dashboards-service/src/types/order"

export interface PublishDriversCollectRequest{
    orderInfo :OrderInfo
}

export interface PublishDriversCollectResponse{
    drivers : DriverInfo[]
}
export interface PublishDriversSingleRequest{
        drivers : DriverInfo;
        orderLocationDetails:OrderLocationDetails
}

export interface PublishDriversSingleResponse{
    driverId : string 
    status:string // accepted , 
    
}
export interface PublishOrderCreated{
     orderResolved : TotalResolved
     orderCouponDetails :OrderCouponDetails

     status :string; 

}
export interface PublishOrderAccepted{
     storeId : string ;
     orderId :string ;
     status :string;     
}
export interface PublishOrderDetails{
        driverId : string;
        orderResolved : TotalResolved
        orderCouponDetails :OrderCouponDetails
}
interface DriverInfo{
    id : string ;
}
interface OrderInfo{
    id : string ;
    latitude : number;
longitude:number;
location_code:string ;
    driverType:string

}
interface OrderLocationDetails{
    id : string ;
    latitude : number;
longitude:number;
location_code:string ;
    driverType:string

}
interface OrderCouponDetails{
 couponCode : string;
 discount_percentage : number;

}
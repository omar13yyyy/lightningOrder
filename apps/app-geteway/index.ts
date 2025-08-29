import {allCustomersServices} from '../customers-service/index'
import { CustomerServeceParams } from '../customers-service/types/customers'
import {allDeliveryServices} from '../delivery-service/index'


export const customersServices ={

     fetchTokenEffective : async (customerId: number) => {
    return await allCustomersServices.getCustomerTokenByIdService({customerId:customerId} as CustomerServeceParams)
  }
}
export const deliveryServices ={

     fetchTokenEffective : async (driverId) => {
    return await allDeliveryServices.getDriverTokenByIdService(driverId)
  }
}
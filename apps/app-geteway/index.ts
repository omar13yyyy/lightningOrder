import {AllCustomersServices} from '../customers-service/index'
import { CustomerServeceParams } from '../customers-service/types/customers'
import {AllDeliveryServices} from '../delivery-service/index'


export const customersServices ={

     fetchTokenEffective : async (customerId: number) => {
    return await AllCustomersServices.getCustomerTokenByIdService({customerId:customerId} as CustomerServeceParams)
  }
}
export const deliveryServices ={

     fetchTokenEffective : async (driverId) => {
    return await AllDeliveryServices.getDriverTokenByIdService(driverId)
  }
}
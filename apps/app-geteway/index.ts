import {AllCustomersServices} from '../customers-service/index'
import { CustomerServeceParams } from '../customers-service/types/customers'


export const customersServices ={

     fetchTokenEffective : async (customerId: number) => {
    return await AllCustomersServices.getCustomerTokenByIdService({customerId:customerId} as CustomerServeceParams)
  }
}

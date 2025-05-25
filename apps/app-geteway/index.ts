import {AllCustomersServices} from '../customers-service/index'


export const customersServices ={

     fetchTokenEffective : async (customerId: string) => {
    return await AllCustomersServices.getCustomerTokenByIdService(customerId)
  }
}

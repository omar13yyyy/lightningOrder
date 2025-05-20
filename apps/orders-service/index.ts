import {partner} from '../partners-stores-managers-dashboards-service/index'
export const partnerClient ={
    getPartnerId : async    ()=>{


    return  partner.partnerController.getPartnerId(null,null)    
} 

}
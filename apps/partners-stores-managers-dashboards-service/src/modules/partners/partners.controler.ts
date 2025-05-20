import { partnerServices } from './partners.service';
export const partnerController ={
    getPartnerId : async    (req, res)=>{
    const {number ,  password} = req.body 

    const id =await  partnerServices.getPartnerIdService();

    if(id!=null)
        return  id
    else
        return -1        
} 

}
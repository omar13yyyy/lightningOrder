import { ar } from '@faker-js/faker';
import { query} from '../../../../../modules/database/commitDeliverySQL';
//------------------------------------------------------------------------------------------

export const deliveryRepository = {
  //------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------------
getDriverProfile : async (driverId) => {
 query(` 
      
SELECT full_name ,phone_number,
email,vehicle_type,user_name,
bank_name,iban,is_activated 
From drivers where driver_id =$1


    `,[driverId])

},
//-----------------------------------------------------------------------------------------------------------

logout : async (driverId) => {
     await query(` 
      
        DELETE from effective_tokens_delivery where user_id = $1

    `,[driverId])

},
//-----------------------------------------------------------------------------------------------------------

fetchDriverTokenById : async (userId)=>{
    //todo if not exist in redis search in database dont forget logout
   const {rows} =(await query('select token from effective_tokens_delivery where user_id = $1 LIMIT 1',[userId]))[0].token

    return rows[0].token

},
//-----------------------------------------------------------------------------------------------------------

fetchDriverIdPasswordByUserName : async (userName)=>{
   const {rows} = await query('select driver_id,encrypted_password from drivers where user_name = $1 LIMIT 1',[userName])
    return  rows[0]


},
//-----------------------------------------------------------------------------------------------------------

updateEffectiveToken : async (token ,driverId) =>{
    //TODO after login or first reques save token in redis
    
     await query('UPDATE effective_tokens_delivery SET token =$1 where user_id =$2 ',[token,userId])

},
}
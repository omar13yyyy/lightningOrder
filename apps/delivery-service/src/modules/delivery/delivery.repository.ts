import { ar } from '@faker-js/faker';
import { query} from '../../../../../modules/database/commitDeliverySQL';
import { DriverTransaction, TrustPointsLogRepo } from '../../../types/delivery';
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
    
     await query('UPDATE effective_tokens_delivery SET token =$1 where user_id =$2 ',[token,driverId])

},
driverAchievements : async (driverId) =>{
    //TODO after login or first reques save token in redis
    
   const {rows} = await query(`SELECT  update_driver_points_by_id($1)`,[driverId])

},
driverWalletBalance : async (driverId) =>{
    //TODO after login or first reques save token in redis
    
   const {rows} = await query(`SELECT update_driver_points_by_id($1)`,[driverId])

},
insertDriverTransaction : async (
  dt: DriverTransaction
)=> {
 await query(
    `INSERT INTO driver_transactions (
      transaction_id,
      user_id,
      transaction_type,
      amount,
      transaction_at,
      notes,
      platform_commission,
      driver_earnings
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    )
    RETURNING transaction_id`,
    [
      dt.transaction_id,
      dt.user_id,
      dt.transaction_type,
      dt.amount,
      dt.transaction_at,
      dt.notes,
      dt.platform_commission,
      dt.driver_earnings
    ]
  )

},
insertTrustPointsLog : async (
  log: TrustPointsLogRepo
) => {
  const res = await query(
    `INSERT INTO trust_points_log (
      log_id,
      driver_id,
      operation_type,
      points,
      reason,
      log_date
    ) VALUES (
      $1, $2, $3, $4, $5, now()
    )
    RETURNING log_id`,
    [
      log.log_id,
      log.driver_id,
      log.operation_type,
      log.points,
      log.reason,
    ]
  );

},
}
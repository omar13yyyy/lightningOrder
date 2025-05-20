import {query} from '../../../../../modules/database/commitCustomerSQL'

export const userRepository= {

    fetchPartnerId : async ()=>{
    //todo if not exist in redis search in database dont forget logout
   const {rows} =(await query('SQL',[]))[0].token

    return rows[0].token

}
}
import {userRepository} from './custorers.repository'
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken'

export const  customersServices = {

    getCustomerTokenByIdService: async ()=>{ userRepository.fetchCustomerTokenById},

    loginService :  async (number,reqPassword) => {
            if(await userRepository.isCustomerNumberUsed){
            const {password , customer_id} =await userRepository.fetchCustomerIdPasswordByNumber(number)[0]
            if( await bcryptjs.compare(reqPassword, password)){
             
            const token  =  jwt.sign( {customer_id : customer_id
              } , process.env.TOKEN_SECRET_ADMIN)
              await userRepository.updateEffectiveToken(token,customer_id)
              return token 
            }
          }
              return null 
    },
    customerRegisterService  : async (fullName ,phoneNumber,email,password,birthDate,address,code) =>{
      if(await userRepository.isValidCode(phoneNumber,code)){
        const encryptedPassword = await bcryptjs.hash(password, 10);
      if(!await userRepository.isCustomerNumberUsed(phoneNumber)){
        await userRepository.insertCustomer(fullName ,phoneNumber,email,encryptedPassword,birthDate,address)

      }
    }},
    confirmedCodeIsValidService : async (phoneNumber,code) =>{
      return await userRepository.isValidCode(phoneNumber,code)

    },
    addCodeService : async (phoneNumber) => {
      const codeString  = Math.floor(1000 + Math.random() * 9000);
      const code= codeString.toString();

      console.log("code for " ,phoneNumber," is : ", code)
      await userRepository.insertConfirmationCode(phoneNumber,code)
    },
    customerResetPasswordService  : async (phoneNumber,password,code) =>{
      if(await userRepository.isValidCode(phoneNumber,code)){
        const encryptedPassword = await bcryptjs.hash(password, 10);
      if(await userRepository.isCustomerNumberUsed(phoneNumber)){
        await userRepository.updateCustomerPassword(phoneNumber,encryptedPassword)

    }}
  },
    
}
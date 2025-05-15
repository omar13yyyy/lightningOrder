
import { customersServices } from './custorers.service';
export const customersController ={
    customerLogin : async    (req, res)=>{
    const {number ,  password} = req.body 

    const token = customersServices.loginService(number,password);
    if(token!=null)
        res.send({"token" : token})
    else
    res.status(401).send('The phone number or password is incorrect.');
} ,
customerRegister : async    (req, res)=>{

    const {fullName ,phoneNumber,email,encryptedPassword,birthDate,address,code} = req.body 

    const token = customersServices.customerRegisterService(fullName ,phoneNumber,email,encryptedPassword,birthDate,address,code);
    
    if(token!=null)
        res.send({"token" : token})
    else
    res.status(401).send('The phone number or password is incorrect.');
} ,
confirmation : async   (req, res)=>{
    const {phoneNumber} = req.body
    await customersServices.addCodeService(phoneNumber);
},
checkCodeValidity:async   (req, res)=>{

    const {phoneNumber,code} = req.body
    await customersServices.confirmedCodeIsValidService(phoneNumber,code)

},
resetPassword : async (req, res)=>{

    const {phoneNumber,newPassword,code} = req.body
    await customersServices.customerResetPasswordService(phoneNumber,phoneNumber,code)

}
}
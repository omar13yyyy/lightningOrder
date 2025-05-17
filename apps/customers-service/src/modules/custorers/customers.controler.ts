
import { customersServices } from './customers.service';
export const customersController ={
    customerLogin : async    (req, res)=>{
    const {number ,  password} = req.body 

    const token =await  customersServices.loginService(number,password);

    if(token!=null)
        res.send({"token" : token})
    else
    res.status(401).send('The phone number or password is incorrect.');
} ,
customerRegister : async    (req, res)=>{

    const {fullName ,phoneNumber,email,password,birthDate,address,code} = req.body 

    const token= await customersServices.customerRegisterService(fullName ,phoneNumber,email,password,birthDate,address,code);

    if(token != null){

                res.send({"token" : token,
               massage : "Done"  })
    }

    else
    //TODO CODE 401
    res.status(401).send({"token" : null,
               massage : "not Register "  });
} ,
confirmation : async   (req, res)=>{
    const {phoneNumber} = req.body
    let isNotExist = await customersServices.addConfirmationCodeService(phoneNumber);
    if(isNotExist)
     res.send({success : true,
               massage : "Done"  })
    else
    //TODO CODE 400 ?? 
     res.status(400).send({success : false,
                           massage : "phone number is exist" 
     });
},
resetConfirmation : async   (req, res)=>{
    const {phoneNumber} = req.body
    let isExist = await customersServices.addRestConfirmationCodeService(phoneNumber);
    if(isExist)
     res.send({success : true,
               massage : "Done"  })
    else
    //TODO CODE 400 ?? 
     res.status(400).send({success : false,
                           massage : "phone number is exist" 
     });
},
checkCodeValidity:async   (req, res)=>{

    const {phoneNumber,code} = req.body
    const isValid = await customersServices.confirmedCodeIsValidService(phoneNumber,code)
        if(isValid)
     res.send({success : true,
               massage : `Valid Code for phone number : ${phoneNumber}`  })
    else
    //TODO CODE 400 ?? 
     res.status(400).send({success : false,
                           massage : "Not Valid Code for phone number" 
     });
},
resetPassword : async (req, res)=>{

    const {phoneNumber,newPassword,code} = req.body
    let isReset = await customersServices.customerResetPasswordService(phoneNumber,newPassword,code)
        if(isReset != null){

                res.send({success : true,
               massage : "Done"  })
    }

    else
    //TODO CODE 401
    res.status(401).send({success : false,
               massage : "code not valid or  phone number not exist "  });
}
}
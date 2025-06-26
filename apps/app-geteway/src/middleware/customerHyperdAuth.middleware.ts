import jwt from 'jsonwebtoken'
import {query} from '../../../../modules/database/commitCustomerSQL'
import {customersServices} from '../../index'
export const customerHyperdAuth= (req, res, next) => {

  if(req.headers.authorization != undefined){

  if(req.headers.authorization != undefined){
  const bearer =req.headers.authorization.split(' ')
  const authHeader = bearer[1];
    if (!authHeader) {
    return res.status(401).send({ message: 'Unauthorized' });
  } 
  try{
      console.log(authHeader)

      jwt.verify(authHeader, process.env.TOKEN_SECRET_CUSTOMER, async (error, decoded) => {
      const customer_id = decoded.customer_id; 
      let result = await customersServices.fetchTokenEffective(customer_id);
                   console.log("saved token is : ",result)

      if(result != null){

      if(authHeader ==result){
      req.customer_id = customer_id;
      console.log(customer_id)

      next(); 
}
}else 
    return res.status(401).send({ message: 'Unauthorized' });

    }); 
  
  
}catch {
    res.status(403).json({ message: 'Invalid token' });
  }
  

  
}
}
 }
export default customerHyperdAuth;


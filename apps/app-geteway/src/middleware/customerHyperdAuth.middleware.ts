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


      jwt.verify(authHeader, process.env.TOKEN_SECRET_USER, async (error, decoded) => {
      const customer_id = decoded.customer_id; 
      let result = await customersServices.fetchTokenEffective(customer_id);
      if(result != null)
      if(authHeader ==result){
      req.customer_id = customer_id;
      next(); 

}
    }); 
  }
  return res.status(401).send({ message: 'Unauthorized' });


  ;
}
}
 



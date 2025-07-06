import jwt from 'jsonwebtoken'
import {query} from '../../../../modules/database/commitCustomerSQL'
import {deliveryServices} from '../../index'
export const driverHyperdAuth= (req, res, next) => {

  if(req.headers.authorization != undefined){

  if(req.headers.authorization != undefined){
  const bearer =req.headers.authorization.split(' ')
  const authHeader = bearer[1];
    if (!authHeader) {
    return res.status(401).send({ message: 'Unauthorized' });
  } 
  try{
      console.log(authHeader)

      jwt.verify(authHeader, process.env.TOKEN_SECRET_DRIVER, async (error, decoded) => {
      const driver_id = decoded.driver_id; 
      let result = await deliveryServices.fetchTokenEffective(driver_id);
                   console.log("saved token is : ",result)

      if(result != null){

      if(authHeader ==result){
      req.driver_id = driver_id;
      console.log(driver_id)

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
export default driverHyperdAuth;


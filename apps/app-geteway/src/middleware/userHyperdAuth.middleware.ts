import jwt from 'jsonwebtoken'
import {query} from '../../../../modules/database/commitCustomerSQL'
//import {allService} from '../../allServices'
export const userHyperdAuth= (req, res, next) => {

  if(req.headers.authorization != undefined){
  const authHeader = req.headers.authorization;

  if(req.headers.authorization != undefined){
  const bearer =req.headers.authorization.split(' ')
  const authHeader = bearer[1];
    if (!authHeader) {
    return res.status(401).send({ message: 'Unauthorized' });
  } 

       var userId

      jwt.verify(authHeader, process.env.TOKEN_SECRET_USER, (error, decoded) => {
       userId = decoded.id; 
      // role = decoded.role; 
     // let result = allService.allUserService.userServiceGetCustomerTokenById()
      //console.log(result)
     /* if(result.token ===bearer[1] ){
        req.userId = userId;
        next(); 
      
      }*/

        

    }); 
  }
  return res.status(401).send({ message: 'Unauthorized' });


  ;
}
}
 



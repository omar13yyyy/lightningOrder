//import auth from '../middleware/auth.middleware';
import {Router} from 'express';
import {orderRouter} from '../../../orders-service/src/main'
// import {userHyperdAuth }from '../middleware/customerHyperdAuth.middleware'
export const ordersRouter = Router();


ordersRouter.use('/order',orderRouter); 




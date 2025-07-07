//import auth from '../middleware/auth.middleware';
import {Router} from 'express';
import {deliveryRouter} from '../../../delivery-service/src/main'

export const deliveryMainRouter = Router();


deliveryMainRouter.use('/delivery',deliveryRouter); 

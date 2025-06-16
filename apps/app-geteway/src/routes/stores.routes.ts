//import auth from '../middleware/auth.middleware';
import {Router} from 'express';
import {storeRouter} from '../../../partners-stores-managers-dashboards-service/src/main'

export const VisitorStoreVisitor = Router();

export const storesRouter = Router();

storesRouter.use('/store',storeRouter); 

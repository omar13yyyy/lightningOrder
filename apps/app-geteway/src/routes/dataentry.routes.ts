//import auth from '../middleware/auth.middleware';
import {Router} from 'express';
import {dataentryRouter} from '../../../partners-stores-managers-dashboards-service/src/main'

export const DataentryRouter = Router();


DataentryRouter.use('/dataentry',dataentryRouter); 

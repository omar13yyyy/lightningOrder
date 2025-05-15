import {visitorRouter} from './visitors.routes';
//import ordersRoutes from './orders.routes';
import express from 'express';
export const router= express.Router()
router.use('/api/v1/', visitorRouter);



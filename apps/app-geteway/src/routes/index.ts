import {visitorRouter} from './visitors.routes';

import {partnersRouter} from './partner.routes';
import {ordersRouter} from './order.routes';
import {storesRouter} from './stores.routes';

import express from 'express';


export const router= express.Router()


router.use('/api/v1/', visitorRouter);
router.use('/api/v1/', partnersRouter);
router.use('/api/v1/', ordersRouter);
router.use('/api/v1/', storesRouter);

//import ordersRoutes from './orders.routes';




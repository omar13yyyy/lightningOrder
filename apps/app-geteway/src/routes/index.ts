import {visitorRouter} from './visitors.routes';

import {partnersRouter} from './partner.routes';
import {ordersRouter} from './order.routes';
import {storesRouter} from './stores.routes';
<<<<<<< HEAD
import {imagesRouter} from './imageTest.routes';
=======
import {DataentryRouter} from './dataentry.routes.ts';
>>>>>>> laila

import express from 'express';


export const router= express.Router()


router.use('/api/v1/', visitorRouter);
router.use('/api/v1/', partnersRouter);
router.use('/api/v1/', ordersRouter);
router.use('/api/v1/', storesRouter);
<<<<<<< HEAD
router.use('/api/v1/', imagesRouter);
=======
router.use('/api/v1/', DataentryRouter);
>>>>>>> laila

//import ordersRoutes from './orders.routes';




/*
export const services = { fun1, fun2 };

*/
import  {driverHyperdAuth}  from '../../app-geteway/src/middleware/driverHyperdAuth.middleware';
import { deliveryController } from "./modules/delivery/delivery.controler";
import express from 'express';
export const deliveryRouter= express.Router()

deliveryRouter.route('/login').get(deliveryController.driverLogin)
deliveryRouter.route('/logout').get(deliveryController.logout)


/*
export const services = { fun1, fun2 };

*/
import  {driverHyperdAuth}  from '../../app-geteway/src/middleware/driverHyperdAuth.middleware';
import { OrderWithDriver } from '../../partners-stores-managers-dashboards-service/src/types/finderClient';
import { deliveryController } from "./modules/delivery/delivery.controler";
import express from 'express';
export const deliveryRouter= express.Router()
export const lastUpdate = Date.now();


export const inOrderDrivers = new Set<string>();
export const driverOrderMap: Map<string, OrderWithDriver> = new Map();

deliveryRouter.route('/login').get(deliveryController.driverLogin)
deliveryRouter.route('/logout').get(deliveryController.logout)


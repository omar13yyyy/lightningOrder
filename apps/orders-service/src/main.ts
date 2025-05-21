/*
export const services = { fun1, fun2 };

*/
//import { userHyperdAuth } from '../../app-geteway/src/middleware/userHyperdAuth.middleware';

import { ordersControler } from "./modules/orders/orders.controler";
import express from 'express';
import { get } from "http";
export const orderRouter= express.Router()

orderRouter.route('/getCurrentStatistics').get(ordersControler.getCurrentStatistics)
orderRouter.route('/getCurrentOrders').get(ordersControler.getCurrentOrders)
orderRouter.route('/previousOrder').get(ordersControler.previousOrder)
orderRouter.route('/getBillCurrentOrders').get(ordersControler.getBillCurrentOrders)
orderRouter.route('/getBillPastOrders').get(ordersControler.getBillPastOrders)






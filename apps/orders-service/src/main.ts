/*
export const services = { fun1, fun2 };

*/
import  auth  from '../../app-geteway/src/middleware/auth.middleware';
import  customerHyperdAuth  from '../../app-geteway/src/middleware/customerHyperdAuth.middleware';

import { ordersControler } from "./modules/orders/orders.controler";
import express from 'express';
import { get } from "http";
export const orderRouter= express.Router()


orderRouter.route('/getCurrentStatistics').get(auth,ordersControler.getCurrentStatistics)
orderRouter.route('/getCurrentOrders').get(auth,ordersControler.getCurrentOrders)
orderRouter.route('/previousOrder').get(auth,ordersControler.previousOrder)
orderRouter.route('/getBillCurrentOrders').get(auth,ordersControler.getBillCurrentOrders)
orderRouter.route('/getBillPastOrders').get(auth,ordersControler.getBillPastOrders)


orderRouter.route('/sendUserOrder').post(customerHyperdAuth,ordersControler.sendUserOrder)
orderRouter.route('/currentCustomerOrder').get(customerHyperdAuth,ordersControler.getCurrentCustomerOrders)
orderRouter.route('/previousCustomerOrder').get(customerHyperdAuth,ordersControler.previousCustomerOrder)






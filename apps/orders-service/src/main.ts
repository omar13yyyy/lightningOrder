/*
export const services = { fun1, fun2 };

*/
import  {auth}  from '../../app-geteway/src/middleware/auth.middleware';
import  customerHyperdAuth  from '../../app-geteway/src/middleware/customerHyperdAuth.middleware';
import  driverHyperdAuth  from '../../app-geteway/src/middleware/driverHyperdAuth.middleware';

import { ordersControler } from "./modules/orders/orders.controler";
import express from 'express';
import { get } from "http";
export const orderRouter= express.Router()

orderRouter.route('/sendUserOrder').post(customerHyperdAuth,ordersControler.sendUserOrder)
orderRouter.route('/currentCustomerOrder').get(customerHyperdAuth,ordersControler.getCurrentCustomerOrders)
orderRouter.route('/previousCustomerOrder').get(customerHyperdAuth,ordersControler.previousCustomerOrder)
orderRouter.route('/rate').get(customerHyperdAuth,ordersControler.rate)
orderRouter.route('/delivered').get(driverHyperdAuth,ordersControler.delivered)
orderRouter.route('/confirmReceipt').get(driverHyperdAuth,ordersControler.confirmReceipt)






orderRouter.route('/getCurrentStatistics').get(auth(['partner','manager','admin']),ordersControler.getCurrentStatistics)
orderRouter.route('/getCurrentOrders').get(auth(['partner','manager','admin']),ordersControler.getCurrentOrders)
orderRouter.route('/previousOrder').get(auth(['partner','manager','admin']),ordersControler.previousOrder)
orderRouter.route('/getBillCurrentOrders').get(auth(['partner','manager','admin']),ordersControler.getBillCurrentOrders)
orderRouter.route('/getBillPastOrders').get(auth(['partner','manager','admin']),ordersControler.getBillPastOrders)




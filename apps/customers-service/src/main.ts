
//import auth from '../middleware/auth.middleware';
import { customersController } from "./modules/custorers/customers.controler";
import express from 'express';
export const visitorCustomerRouter= express.Router()
import {userHyperdAuth} from '../../app-geteway/src/middleware/userHyperdAuth.middleware'



visitorCustomerRouter.route('/login').post(customersController.customerLogin)
visitorCustomerRouter.route('/register').post(customersController.customerRegister)
visitorCustomerRouter.route('/checkCodeValidity').post(customersController.checkCodeValidity)
visitorCustomerRouter.route('/confirmation').post(customersController.confirmation)
visitorCustomerRouter.route('/resetConfirmation').post(customersController.resetConfirmation)
visitorCustomerRouter.route('/resetPassword').post(customersController.resetPassword)



/*
// تأمين كل مسارات المستخدم

// إعادة توجيه إلى خدمة المستخدمين
router.use(
  '/',
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/users': '/' },
  })
);*/

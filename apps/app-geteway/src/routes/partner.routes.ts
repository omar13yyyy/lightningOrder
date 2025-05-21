//import auth from '../middleware/auth.middleware';
import {visitorCustomerRouter} from '../../../customers-service/src/main'
import {Router} from 'express';
import {partnerRouter} from '../../../partners-stores-managers-dashboards-service/src/main'
import {userHyperdAuth }from '../middleware/userHyperdAuth.middleware'
export const visitorRouter = Router();
export const partnersRouter = Router();


visitorRouter.use('/visitor', visitorCustomerRouter);      // /admin/user/...
partnersRouter.use('/partner',partnerRouter); 

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

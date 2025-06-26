//import auth from '../middleware/auth.middleware';
import {visitorCustomerRouter} from '../../../customers-service/src/main'
import {Router} from 'express';
import {visitorStoreRouter} from '../../../partners-stores-managers-dashboards-service/src/main'

export const visitorRouter = Router();


visitorRouter.use('/customer', visitorCustomerRouter);      // /admin/user/...
visitorRouter.use('/customer', visitorStoreRouter); 

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

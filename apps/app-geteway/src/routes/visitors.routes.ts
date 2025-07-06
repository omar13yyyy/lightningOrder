//import auth from '../middleware/auth.middleware';
import {visitorCustomerRouter} from '../../../customers-service/src/main'
import {Router} from 'express';
import {visitorStoreRouter} from '../../../partners-stores-managers-dashboards-service/src/main'

export const visitorRouter = Router();


visitorRouter.use('/store', visitorCustomerRouter);     
visitorRouter.use('/store', visitorStoreRouter); 

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

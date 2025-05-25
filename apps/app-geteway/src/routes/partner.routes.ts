//import auth from '../middleware/auth.middleware';
import {Router} from 'express';
import {partnerRouter} from '../../../partners-stores-managers-dashboards-service/src/main'
import {userHyperdAuth }from '../middleware/customerHyperdAuth.middleware'
export const visitorRouter = Router();
export const partnersRouter = Router();



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

api-gateway/
├── src/
│   ├── routes/                ← تعريف المسارات العامة (users, orders, إلخ)
│   │   ├── users.routes.js
│   │   ├── orders.routes.js
│   │   └── index.js          ← يربط جميع المسارات
│   │
│   ├── middleware/            ← وسطيات مثل المصادقة، تسجيل الدخول، CORS
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── rate-limit.js
│   │
│   ├── utils/                 ← أدوات مشتركة (JWT, proxy, إلخ)
│   │   ├── jwt.js
│   │   ├── proxy.js
│   │   └── logger.js
│   │
│   ├── config/                ← إعدادات البيئة والخدمات
│   │   ├── index.js
│   │   └── services.js        ← روابط الخدمات (user, order, إلخ)
│   │
│   ├── app.js                 ← تهيئة التطبيق (Express)
│   └── server.js              ← تشغيل التطبيق
│
├── package.json
└── README.md

------------------------------------------------------------------------------------
1. src/app.js – إعداد التطبيق
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

// جميع المسارات تحت /api
app.use('/api', routes);

// المعالجة الموحدة للأخطاء
app.use(errorHandler);

module.exports = app;

-----------------------------------------------------------------
2. src/server.js – تشغيل الخادم
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});

--------------------------------------------------------
3. src/routes/index.js – دمج المسارات

const express = require('express');
const router = express.Router();

const usersRoutes = require('./users.routes');
const ordersRoutes = require('./orders.routes');

router.use('/users', usersRoutes);
router.use('/orders', ordersRoutes);

module.exports = router;
---------------------------------------------------------
4. src/routes/users.routes.js – توجيه إلى خدمة المستخدمين

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { USER_SERVICE_URL } = require('../config/services');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// تأمين كل مسارات المستخدم
router.use(auth);

// إعادة توجيه إلى الخدمة الفعلية
router.use('/', createProxyMiddleware({
  target: USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/' }
}));

module.exports = router;
---------------------------------------------------------
5. src/middleware/auth.middleware.js – التحقق من JWT


const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  -------------------------------------------------------------
  6. src/config/services.js – روابط الخدمات


  module.exports = {
  USER_SERVICE_URL: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL || 'http://localhost:3002',
};

-----------------------------------------------------------------------

Hybrid (microservices + modular architecture)

project-root/
├── apps/                      ← خدمات رئيسية (Node.js apps)
│   ├── api-gateway/           ← نقطة الدخول (Express + GraphQL أو REST)
│   ├── user-service/          ← خدمة المستخدمين
│   ├── order-service/         ← خدمة الطلبات
│   ├── delivery-service/      ← خدمة التوصيل
│   └── ...                    ← خدمات أخرى (payment, notification, إلخ)
│
├── modules/                   ← وحدات قابلة لإعادة الاستخدام (Modular architecture)
│   ├── auth/                  ← مصادقة وتوثيق
│   ├── database/              ← اتصال موحد مع PostgreSQL
│   ├── logging/               ← سجل موحد
│   └── ...                    ← وحدات مثل validation، utils، إلخ
│
├── native/                    ← كود C++ مدمج مع Node.js
│   ├── addon.cc               ← ملف C++ الأساسي
│   ├── binding.gyp            ← إعداد البناء (node-gyp)
│   └── build/                 ← ملفات البناء (node-gyp output)
│
├── scripts/                   ← سكربتات إدارة المشروع (build, test, deploy)
│
├── docker/                    ← إعدادات الحاويات لكل خدمة
│
├── .env                       ← متغيرات البيئة
├── package.json               ← تعريف المشروع العام
└── README.md





user-service/
├── src/
│   ├── modules/
│   │   ├── user/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.repository.ts
│   │   └── ...
│   ├── main.ts
│   └── config.ts
├── test/
├── Dockerfile
└── package.json


-------------------------------------------------------------------------------------------

github : main (   )
         project3O1
         porject3L1

--------------------------------------------------------------------------------------------
main.js:



const express = require('express');
const { getUserHandler } = require('./modules/user/user.controller');

const app = express();
app.use(express.json());

app.get('/user/:id', getUserHandler);

app.listen(3000, () => console.log('User service running on port 3000'));

-------------------------------------------------------------------------------------------
modules/user/user.controller.js

const { getUserById } = require('./user.service');

function getUserHandler(req, res) {
    const user = getUserById(req.params.id);
    res.json(user);
}

module.exports = { getUserHandler };


-------------------------------------------------------------------------------------------
modules/user/user.service.js

const { findUser } = require('./user.repository');

function getUserById(id) {
    return findUser(id);
}

module.exports = { getUserById };

-------------------------------------------------------------------------------------------
modules/user/user.repository.js

function findUser(id) {
    // Mock data
    return { id, name: 'Omar', role: 'admin' };
}

module.exports = { findUser };


-------------------------------------------------------------------------------------------
config.js


module.exports = {
    port: process.env.PORT || 3000
};


-------------------------------------------------------------------------------------------
package.json (داخل user-service/)
{
  "name": "user-service",
  "main": "src/main.js",
  "dependencies": {
    "express": "^4.18.2"
  }
}

-------------------------------------------------------------------------------------------
native/

#include <napi.h>

Napi::String SayHello(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "Hello from C++!");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("sayHello", Napi::Function::New(env, SayHello));
  return exports;
}

NODE_API_MODULE(addon, Init)
-------------------------------------------------------------------------------------------
binding.gyp


{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "addon.cc" ]
    }
  ]
}

-------------------------------------------------------------------------------------------
index.js (داخل native/)

const addon = require('./build/Release/addon');
console.log(addon.sayHello()); // "Hello from C++!"

------------------------------------------------------------------------------------------
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware للتحقق من JWT
app.use((req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const user = jwt.verify(token, 'SECRET');
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid Token' });
  }
});

// توجيه الطلبات
app.use('/api/users', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
app.use('/api/orders', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));

app.listen(3000, () => console.log('App Gateway running on port 3000'));

-------------------------------------------------------------------------------------------
تثبيت المتطلبات:

sudo apt install build-essential
npm install -g node-gyp

بناء كود C++:

cd native
node-gyp configure
node-gyp build
node index.js

تشغيل Node.js service:

cd user-service
npm install
node src/main.js

كيف تتواصل الخدمات مع بعضها؟
طبقة وسيطة بدل الطريقة هي : 
في هذا النوع من البنية، لا يتم الاستدعاء المباشر بين الملفات بل عبر التواصل بين الخدمات:
1. REST APIs أو GraphQL

// order-service قد يتصل بـ user-service عبر HTTP
const user = await axios.get('http://user-service/api/users/123');

2. أو Event-based (RabbitMQ, Kafka)

// order-service يرسل "ORDER_CREATED" عبر pub/sub

هيكلية Hybrid = Microservices على مستوى النظام + Modular Architecture داخل كل خدمة.

    كل خدمة (مثل user-service) تعتبر Microservice.

    وكل خدمة من الداخل مُقسّمة إلى وحدات (Modules) مثل user.controller, user.service, user.repository.



    🧩 مكونات التواصل داخل هذا النوع:
    بين الخدمات (microservices)
    REST API / gRPC / Message Queue (Kafka, RabbitMQ)
    axios, fetch, amqplib, kafkajs

    داخل الخدمة (modular)
    استدعاء دوال ووحدات داخليًا
    import, require, DI container 

    | الاحتياج               | أداة مناسبة                                        |
| ---------------------- | -------------------------------------------------- |
| REST calls بين الخدمات | `axios`, `fetch`                                   |
| Event-driven system    | `RabbitMQ`, `Kafka`, `Redis pub/sub`               |
| تعريف مشترك للأنواع    | `protobuf`, أو `TypeScript types` في shared module |
| توحيد المصادقة         | `auth` module مشترك في `modules/`                  |
-----------------------------------------------------------------
sudo apt-get install rabbitmq-server
sudo systemctl enable rabbitmq-server
sudo systemctl start rabbitmq-server


ثم افتح الواجهة الرسومية:

    http://localhost:15672
    المستخدم الافتراضي: guest
    كلمة المرور: guest

    'amqp://admin:admin@rabbitmq:5672'



    💡 ملاحظة

إذا كنت تستخدم RabbitMQ محليًا بدون Docker، فتأكد من:

    تشغيل RabbitMQ يدويًا قبل تشغيل الخدمات.

    فتح المنفذ 5672 وعدم وجود تعارض مع جدار الحماية.

    استخدام localhost بدلًا من اسم container مثل rabbitmq.



العمل على اكثر من ثريد 
pm2

pm2 start app.js -i max

المناقلات : 
RabbitMQ (Asynchronous / SAGA pattern)


  استخدام REST لبداية المعاملة ثم RabbitMQ لإكمال باقي الخطوات.





  order :

  store -> locations -> store -> "send to user stores" 
  order -> notif -> manager  -> driver 
                  

import {PG_DELIVERY_HOST,PG_DELIVERY_PORT,PG_DELIVERY_USER,PG_DELIVERY_PASSWORD,PG_DELIVERY_DATABASE} from './config'

import { createDbPool } from './commitSQL';


  const deliveryDbPool = createDbPool({
    host:PG_DELIVERY_HOST,
    port:PG_DELIVERY_PORT,
    user:PG_DELIVERY_USER,
    password:PG_DELIVERY_PASSWORD,
    database:PG_DELIVERY_DATABASE,
    //ssl: true,
    max: 20,           // أقصى عدد للاتصالات في الـ pool
    idleTimeoutMillis: 30000, // وقت الخمول قبل إنهاء الاتصال
    connectionTimeoutMillis: 2000, // أقصى وقت للانتظار قبل إنشاء اتصال)
    //ssl: true,
  });
  export async function query (text , params)
  {

    return await deliveryDbPool.query(text,params)

    
  } 
  


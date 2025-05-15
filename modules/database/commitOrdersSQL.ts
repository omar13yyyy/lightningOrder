
import {PG_ORDERS_HOST,PG_ORDERS_PORT,PG_ORDERS_USER,PG_ORDERS_PASSWORD,PG_ORDERS_DATABASE} from './config'

import { createDbPool } from './commitSQL';


  const orderDbPool = createDbPool({
    host:PG_ORDERS_HOST,
    port:PG_ORDERS_PORT,
    user:PG_ORDERS_USER,
    password:PG_ORDERS_PASSWORD,
    database:PG_ORDERS_DATABASE,
    max: 20,           // أقصى عدد للاتصالات في الـ pool
    idleTimeoutMillis: 30000, // وقت الخمول قبل إنهاء الاتصال
    connectionTimeoutMillis: 2000, // أقصى وقت للانتظار قبل إنشاء اتصال)
    //ssl: true,
  });
  export async function query (text , params)
  {

    return await  orderDbPool.query(text,params)

    
  } 
  
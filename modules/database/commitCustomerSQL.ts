
import {PG_COSTOMERS_HOST,PG_COSTOMERS_PORT,PG_COSTOMERS_USER,PG_COSTOMERS_PASSWORD,PG_COSTOMERS_DATABASE} from './config'
import { createDbPool } from './commitSQL';


  const customerDbPool = createDbPool({
    host:PG_COSTOMERS_HOST,
    port:PG_COSTOMERS_PORT,
    user:PG_COSTOMERS_USER,
    password:PG_COSTOMERS_PASSWORD,
    database:PG_COSTOMERS_DATABASE,
    max: 20,           // أقصى عدد للاتصالات في الـ pool
    idleTimeoutMillis: 30000, // وقت الخمول قبل إنهاء الاتصال
    connectionTimeoutMillis: 2000, // أقصى وقت للانتظار قبل إنشاء اتصال)
    //ssl: true,
  });
  export async function query (text , params)
  {

   return await customerDbPool.query(text,params)

    
  } 
  

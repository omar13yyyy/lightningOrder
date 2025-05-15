
import {PG_DASHBOARD_HOST,PG_DASHBOARD_PORT,PG_DASHBOARD_USER,PG_DASHBOARD_PASSWORD,PG_DASHBOARD_DATABASE} from './config'




import { createDbPool } from './commitSQL';

  const customerDbPool = createDbPool({
    host:PG_DASHBOARD_HOST,
    port:PG_DASHBOARD_PORT,
    user:PG_DASHBOARD_USER,
    password:PG_DASHBOARD_PASSWORD,
    database:PG_DASHBOARD_DATABASE,
    max: 20,           // أقصى عدد للاتصالات في الـ pool
    idleTimeoutMillis: 30000, // وقت الخمول قبل إنهاء الاتصال
    connectionTimeoutMillis: 2000, // أقصى وقت للانتظار قبل إنشاء اتصال)
    //ssl: true,
  });
  export async function query (text: string , params: any[] | undefined)
  {

    return await customerDbPool.query(text,params)


  }


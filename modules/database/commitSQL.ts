
import { Pool, PoolConfig } from 'pg';

export function createDbPool(poolParams: PoolConfig) {
  const pool = new Pool(poolParams);

  return {
    async query(text: string, params?: any[]) {
      try {
        const  { rows,rowCount } = await pool.query(text, params);

        console.error('params :', { params });
        console.log('Executed query:', { text });
        
        return { rows,rowCount } ;
      } catch (err) {
        console.error('params :', { params });
        console.error('Error executing query:', { text });
        throw err;
      }
    },
    // يمكنك إضافة دوال إضافية مثل release، end، إلخ
    end() {
      return pool.end();
    }
  };
}
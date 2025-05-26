import { Client } from 'pg';

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'main_db', // القاعدة الرئيسية التي ستربط الآخرين بها
  password: 'omar',
  port: 5432,
});

const run = async () => {
  await client.connect();

  // 1. إنشاء امتداد fdw
  await client.query(`CREATE EXTENSION IF NOT EXISTS postgres_fdw;`);

  // 2. تعريف السيرفرات الأربعة
  const servers = [
    { name: 'server_customers', host: 'localhost', db: 'project3_customers', schema: 'customers_schema' },
    { name: 'server_order', host: 'localhost', db: 'project3_stores', schema: 'stores_schema' },
    { name: 'server_delivery', host: 'localhost', db: 'db_drivers', schema: 'drivers_schema' },
    { name: 'server_dashboard', host: 'localhost', db: 'db_system', schema: 'system_schema' },
  ];

  for (const server of servers) {
    const { name, host, db, schema } = server;

    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_foreign_server WHERE srvname = '${name}'
        ) THEN
          CREATE SERVER ${name}
          FOREIGN DATA WRAPPER postgres_fdw
          OPTIONS (host '${host}', dbname '${db}', port '5432');
        END IF;
      END $$;
    `);

    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_user_mappings
          WHERE srvname = '${name}'
          AND umuser = (SELECT usesysid FROM pg_user WHERE usename = CURRENT_USER)
        ) THEN
          CREATE USER MAPPING FOR CURRENT_USER
          SERVER ${name}
          OPTIONS (user 'postgres', password 'omar');
        END IF;
      END $$;
    `);

    await client.query(`CREATE SCHEMA IF NOT EXISTS ${schema};`);

    await client.query(`
      IMPORT FOREIGN SCHEMA public
      FROM SERVER ${name}
      INTO ${schema};
    `);
  }

  console.log('✅ All FDW connections configured.');
  await client.end();
};

run().catch(err => {
  console.error('❌ Error:', err);
});

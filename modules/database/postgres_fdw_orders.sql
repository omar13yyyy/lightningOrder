BEGIN;

SELECT unnest(enum_range(NULL::public.enum_store_transaction_type));
SELECT unnest(enum_range(NULL::public.enum_day_of_week));
SELECT unnest(enum_range(NULL::public.enum_store_status));
SELECT unnest(enum_range(NULL::public.enum_orders_type));
SELECT unnest(enum_range(NULL::public.enum_user_type));
SELECT unnest(enum_range(NULL::public.enum_coupon_type));
SELECT unnest(enum_range(NULL::public.enum_partner_status));
SELECT unnest(enum_range(NULL::public.enum_withdrawal_user));
SELECT unnest(enum_range(NULL::public.enum_withdrawal_status));
SELECT unnest(enum_range(NULL::public.enum_user_transaction_type));
SELECT unnest(enum_range(NULL::public.enum_vehicle_type));
SELECT unnest(enum_range(NULL::public.enum_driver_transaction_type));
SELECT unnest(enum_range(NULL::public.enum_trust_points_operation_type));
SELECT unnest(enum_range(NULL::public.enum_order_status));
SELECT unnest(enum_range(NULL::public.enum_payment_method));
SELECT unnest(enum_range(NULL::public.enum_on_expense));

CREATE SCHEMA IF NOT EXISTS remotely;

DROP FOREIGN TABLE IF EXISTS
remotely.confirmation,
remotely.customer_wallets_previous_day,
remotely.customers,
remotely.customer_transactions,
remotely.effective_tokens_delevery,
remotely.effective_tokens;

DROP FOREIGN TABLE IF EXISTS
remotely.coupons,
remotely.products_sold,
remotely.daily_statistics,
remotely.document_images,
remotely.products,
remotely.store_ratings_previous_day,
remotely.store_categories,
remotely.store_tags,
remotely.stores,
remotely.trends,
remotely.system_settings,
remotely.tags,
remotely.working_hours,
remotely.roles,
remotely.permisions,
remotely.store_transactions,
remotely.store_wallets,
remotely.customers_visited,
remotely.role_permission,
remotely.admins,
remotely.address,
remotely.partners,
remotely.statistics_previous_day,
remotely.category_tags,
remotely.withdrawal_document_images,
remotely.withdrawal_requests;

DROP FOREIGN TABLE IF EXISTS
remotely.driver_transactions,
remotely.driver_points,
remotely.driver_wallets_previous_day,
remotely.drivers,
remotely.trust_points_log,
remotely.delivery_document_images;



CREATE EXTENSION IF NOT EXISTS postgres_fdw;

CREATE SERVER IF NOT EXISTS dashboard_server
  FOREIGN DATA WRAPPER postgres_fdw
  OPTIONS (
    host 'localhost',
    dbname 'project3_dashboard',
    port '5432'
  );

 DO $$
      BEGIN
 IF NOT EXISTS (
    SELECT 1 FROM pg_user_mappings
   WHERE srvname = 'dashboard_server'
   AND umuser = (SELECT usesysid FROM pg_user WHERE usename = CURRENT_USER)
   ) THEN
    CREATE USER MAPPING FOR CURRENT_USER
    SERVER dashboard_server
    OPTIONS (user 'postgres', password '12345');
     END IF;
END $$;


IMPORT FOREIGN SCHEMA public
FROM SERVER dashboard_server
INTO remotely;
-------------------------------------------------------

CREATE SERVER IF NOT EXISTS customers_server
  FOREIGN DATA WRAPPER postgres_fdw
  OPTIONS (
    host 'localhost',
    dbname 'project3_customers',
    port '5432'
  );
 DO $$
      BEGIN
 IF NOT EXISTS (
    SELECT 1 FROM pg_user_mappings
   WHERE srvname = 'customers_server'
   AND umuser = (SELECT usesysid FROM pg_user WHERE usename = CURRENT_USER)
   ) THEN
    CREATE USER MAPPING FOR CURRENT_USER
    SERVER customers_server
    OPTIONS (user 'postgres', password '12345');
     END IF;
END $$;

IMPORT FOREIGN SCHEMA public
FROM SERVER customers_server
INTO remotely;

---------------------------------------------------
CREATE SERVER IF NOT EXISTS delivery_server
  FOREIGN DATA WRAPPER postgres_fdw
  OPTIONS (
    host 'localhost',
    dbname 'project3_delivery',
    port '5432'
  );

 DO $$
      BEGIN
 IF NOT EXISTS (
    SELECT 1 FROM pg_user_mappings
   WHERE srvname = 'delivery_server'
   AND umuser = (SELECT usesysid FROM pg_user WHERE usename = CURRENT_USER)
   ) THEN
    CREATE USER MAPPING FOR CURRENT_USER
    SERVER delivery_server
    OPTIONS (user 'postgres', password '12345');
     END IF;
END $$;

IMPORT FOREIGN SCHEMA public
FROM SERVER delivery_server
INTO remotely;



END;
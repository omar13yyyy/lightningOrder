BEGIN;
CREATE OR REPLACE FUNCTION get_customer_wallet_balance(p_customer_id BIGINT)
RETURNS DOUBLE PRECISION AS $$
DECLARE
    v_balance DOUBLE PRECISION := 0;
    v_previous_balance DOUBLE PRECISION := 0;
    v_transactions_sum_in DOUBLE PRECISION := 0;
    v_transactions_sum_out DOUBLE PRECISION := 0;
BEGIN
    -- جلب آخر رصيد محفوظ
    SELECT COALESCE(balance_previous_day, 0)
    INTO v_previous_balance
    FROM customer_wallets_previous_day
    WHERE customer_wallet_id = p_customer_id;

    -- جمع العمليات من نوع wallet
    SELECT COALESCE(SUM(amount), 0)
    INTO v_transactions_sum_in
    FROM customer_transactions
    WHERE driver_id = p_customer_id AND transaction_type = 'input';
    
        SELECT COALESCE(SUM(amount), 0)
    INTO v_transactions_sum_out
    FROM customer_transactions
    WHERE driver_id = p_customer_id AND transaction_type = 'output';

    -- الحساب النهائي (الرصيد - الخصومات)
    v_balance := v_previous_balance - v_transactions_sum_out + v_transactions_sum_in;

    RETURN v_balance;
END;
$$ LANGUAGE plpgsql;

------------------------------------------------------------------
-- FUNCTION: public.update_store_stats_prevday(text)

-- DROP FUNCTION IF EXISTS public.update_store_stats_prevday(text);

CREATE OR REPLACE FUNCTION public.update_store_stats_prevday(
  p_store_id text)
    RETURNS double precision
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  -- من جدول الإحصائيات السابق
  v_prev_balance        double precision;
  v_prev_comm_balance   double precision;
  v_prev_total_orders   bigint;
  v_prev_total_revenue  double precision;
  v_prev_customers      integer;
  v_last_update         timestamptz;

  -- فروقات من جدول معاملات المتجر منذ آخر تحديث
  v_tx_count_delta      bigint;
  v_credit              double precision;
  v_debit               double precision;
  v_credit_comm         double precision;
  v_debit_comm          double precision;
  v_rev_deposits        double precision;
  v_max_trx_ts          timestamptz;

  -- فروقات من جدول الزيارات منذ آخر تحديث
  v_visits_delta        bigint;
  v_max_visit_ts        timestamptz;

  -- internal_id للمتجر (لجدول الزيارات)
  v_internal_id         bigint;

  -- القيم النهائية الجديدة
  v_new_balance         double precision;
  v_new_comm_balance    double precision;
  v_new_total_orders    bigint;
  v_new_total_revenue   double precision;
  v_new_customers       integer;
  v_new_last_update     timestamptz;
BEGIN
  --------------------------------------------------------------------
  -- احصل على internal_id للمتجر النصّي (stores.store_id -> stores.internal_id)
  --------------------------------------------------------------------
  SELECT internal_id
  INTO v_internal_id
  FROM stores
  WHERE store_id = p_store_id
  LIMIT 1;

  IF v_internal_id IS NULL THEN
    RAISE EXCEPTION 'store_id % not found in stores', p_store_id;
  END IF;

  --------------------------------------------------------------------
  -- اقفل/أنشئ صف statistics_previous_day
  --------------------------------------------------------------------
  SELECT
    COALESCE(balance_previous_day, 0),
    COALESCE(platform_commission_balance_previous_day, 0),
    COALESCE(total_orders, 0),
    COALESCE(total_revenue, 0),
    COALESCE(customers_visited, 0),
    COALESCE(last_updated_at, TIMESTAMPTZ 'epoch')
  INTO
    v_prev_balance,
    v_prev_comm_balance,
    v_prev_total_orders,
    v_prev_total_revenue,
    v_prev_customers,
    v_last_update
  FROM statistics_previous_day
  WHERE store_id = p_store_id
  FOR UPDATE;

  IF NOT FOUND THEN
    v_prev_balance       := 0;
    v_prev_comm_balance  := 0;
    v_prev_total_orders  := 0;
    v_prev_total_revenue := 0;
    v_prev_customers     := 0;
    v_last_update        := TIMESTAMPTZ 'epoch';

    INSERT INTO statistics_previous_day (
      store_id, total_orders, total_revenue, average_delivery_time,
      customers_visited, balance_previous_day,
      platform_commission_balance_previous_day, last_updated_at
    ) VALUES (
      p_store_id, 0, 0, NULL, 0,
      v_prev_balance, v_prev_comm_balance, v_last_update
    );

    -- خُذ القفل بعد الإدراج
    SELECT
      COALESCE(balance_previous_day, 0),
      COALESCE(platform_commission_balance_previous_day, 0),
      COALESCE(total_orders, 0),
      COALESCE(total_revenue, 0),
      COALESCE(customers_visited, 0),
      COALESCE(last_updated_at, TIMESTAMPTZ 'epoch')
    INTO
      v_prev_balance,
      v_prev_comm_balance,
      v_prev_total_orders,
      v_prev_total_revenue,
      v_prev_customers,
      v_last_update
    FROM statistics_previous_day
    WHERE store_id = p_store_id
    FOR UPDATE;
  END IF;

--------------------------------------------------------------------
  -- فروقات المعاملات منذ آخر تحديث
  -- - total_orders = عدد جميع المعاملات الجديدة
  -- - total_revenue = مجموع amount للمعاملات من نوع deposit فقط
  -- - الرصيد الصافي والعمولة: (إيداعات - سحوبات/خصومات)
  --------------------------------------------------------------------
  SELECT
    COALESCE(COUNT(*), 0) AS tx_count_delta,
    COALESCE(SUM(amount) FILTER (WHERE transaction_type = 'deposit'), 0)                                  AS credit_amt,
    COALESCE(SUM(amount) FILTER (WHERE transaction_type IN ('withdraw','discount')), 0)                   AS debit_amt,
    COALESCE(SUM(amount_platform_commission) FILTER (WHERE transaction_type = 'deposit'), 0)              AS credit_comm,
    COALESCE(SUM(amount_platform_commission) FILTER (WHERE transaction_type IN ('withdraw','discount')), 0) AS debit_comm,
    COALESCE(SUM(amount) FILTER (WHERE transaction_type = 'deposit'), 0)                                  AS rev_deposits,
    MAX(transaction_at)
  INTO
    v_tx_count_delta,
    v_credit, v_debit,
    v_credit_comm, v_debit_comm,
    v_rev_deposits,
    v_max_trx_ts
  FROM store_transactions
  WHERE store_id = p_store_id
    AND transaction_at > v_last_update;

  --------------------------------------------------------------------
  -- فروقات الزيارات منذ آخر تحديث (customers_visited على internal_id)
  --------------------------------------------------------------------
  SELECT
    COALESCE(COUNT(*), 0) AS visits_delta,
    MAX(create_at)
  INTO
    v_visits_delta,
    v_max_visit_ts
  FROM customers_visited
  WHERE store_id = v_internal_id
    AND create_at > v_last_update;

  --------------------------------------------------------------------
  -- احسب القيم الجديدة
  --------------------------------------------------------------------
  v_new_balance       := v_prev_balance       + v_credit      - v_debit;
  v_new_comm_balance  := v_prev_comm_balance  + v_credit_comm - v_debit_comm;
  v_new_total_orders  := v_prev_total_orders  + v_tx_count_delta;
  v_new_total_revenue := v_prev_total_revenue + v_rev_deposits;
  v_new_customers     := v_prev_customers     + COALESCE(v_visits_delta, 0);

  -- آخر تحديث جديد = أكبر طابع زمني بين آخر معاملة وآخر زيارة، أو القديم إذا لا جديد
  v_new_last_update := GREATEST(
    COALESCE(v_max_trx_ts,  v_last_update),
    COALESCE(v_max_visit_ts, v_last_update)
  );

  --------------------------------------------------------------------
  -- حدّث السجل
  --------------------------------------------------------------------
  UPDATE statistics_previous_day
  SET
    balance_previous_day                         = v_new_balance,
    platform_commission_balance_previous_day     = v_new_comm_balance,
    total_orders                                 = v_new_total_orders,
    total_revenue                                = v_new_total_revenue,
    customers_visited                            = v_new_customers,
    last_updated_at                              = v_new_last_update
  WHERE store_id = p_store_id;

  --------------------------------------------------------------------
  -- أرجع الرصيد النهائي
  --------------------------------------------------------------------
  RETURN v_new_balance;
END;
$BODY$;

ALTER FUNCTION public.update_store_stats_prevday(text)
    OWNER TO postgres;
--------------------------------------------------------------------
-- FUNCTION: public.update_partner_wallet_and_stats(text)

-- DROP FUNCTION IF EXISTS public.update_partner_wallet_and_stats(text);

CREATE OR REPLACE FUNCTION public.update_partner_wallet_and_stats(
  p_partner_id text)
    RETURNS double precision
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  r           record;
  v_total     double precision := 0;
  v_one_store double precision;
BEGIN
  -- قفل صف الشريك لتجنّب السباقات عند التحديث المتزامن
  PERFORM 1
  FROM partners
  WHERE partner_id = p_partner_id
  FOR UPDATE;

  -- مرّ على متاجر الشريك
  FOR r IN
    SELECT s.store_id
    FROM stores s
    WHERE s.partner_id = p_partner_id
  LOOP
    -- حدّث إحصائيات ورصيد المتجر بطريقة تفاضليّة آمنة
    v_one_store := public.update_store_stats_prevday(r.store_id);

    -- راكم الرصيد
    v_total := v_total + COALESCE(v_one_store, 0);
  END LOOP;

  -- حدّث رصيد الشريك
  UPDATE partners
  SET wallet_balance         = v_total,
      last_updated_wallet_at = NOW()
  WHERE partner_id = p_partner_id;

  RETURN v_total;
END;
$BODY$;

ALTER FUNCTION public.update_partner_wallet_and_stats(text)
    OWNER TO postgres;


END;
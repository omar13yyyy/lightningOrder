BEGIN;
CREATE OR REPLACE FUNCTION get_past_deriver_orders(
    driver_id_param INT,
    offset_value INT DEFAULT 0,
    limit_params INT DEFAULT 10
)
RETURNS TABLE (
    order_id TEXT,
    order_details_text TEXT,
    store_name_ar TEXT,
    store_name_en TEXT,
    store_destination DOUBLE PRECISION,
    store_phone_number TEXT,
    customer_destination DOUBLE PRECISION,
    customer_name TEXT,
    customer_phone_number TEXT,
    delivery_duration INT
)
LANGUAGE sql
AS $$
    SELECT 
        po.order_id,
        po.order_details_text,
        s.store_name_ar,
        s.store_name_en,
        po.store_destination,
        s.phone_number AS store_phone_number,
        po.customer_destination,
        c.full_name AS customer_name,
        c.phone_number AS customer_phone_number,
        po.delivery_duration
    FROM remotely.past_orders po
    JOIN remotely.customers c ON po.customer_id = c.customer_id
    JOIN remotely.stores s ON po.store_id = s.store_id
    WHERE po.driver_id = driver_id_param
    ORDER BY po.created_at DESC
    LIMIT limit_params OFFSET offset_value;
$$;


-----------------------------------------
CREATE OR REPLACE FUNCTION get_driver_transactions(
    driver_id_param TEXT,
    offset_value INT DEFAULT 0,
    limit_params INT DEFAULT 10
)
RETURNS TABLE (
    transaction_id TEXT,
    transaction_type TEXT,
    amount NUMERIC,
    transaction_date TIMESTAMP,
    notes TEXT,
    platform_commission NUMERIC,
    driver_earnings NUMERIC
)
LANGUAGE sql
AS $$
    SELECT 
        transaction_id,
        transaction_type,
        amount,
        transaction_at AS transaction_date,
        notes,
        platform_commission,
        driver_earnings
    FROM driver_transactions
    WHERE user_id = driver_id_param
    ORDER BY transaction_at DESC
    LIMIT limit_params OFFSET offset_value;
$$;
----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_driver_points_by_id(p_driver_id TEXT)
RETURNS TABLE (
    driver_id TEXT,
    completed_orders_previous_day BIGINT,
    average_rating_previous_day DOUBLE PRECISION,
    trust_points_previous_day DOUBLE PRECISION,
    total_rating_previous_day INTEGER
) AS $$
BEGIN
    WITH 
    orders_and_ratings AS (
        SELECT
            po.driver_id::text AS driver_id,
            COUNT(*) FILTER (
                WHERE po.orders_type IN ('delivered', 'customer_not_received')
            ) AS completed_orders_previous_day,
            
            AVG(r.driver_rating)::double precision AS average_rating_previous_day,
            
            COUNT(r.driver_rating) AS total_rating_previous_day
        FROM past_orders po
        LEFT JOIN ratings r ON po.order_id = r.order_id
        WHERE po.driver_id::text = p_driver_id
          AND po.completed_at >= CURRENT_DATE - INTERVAL '1 day'
          AND po.completed_at < CURRENT_DATE + INTERVAL '1 day'
        GROUP BY po.driver_id
    ),
    
    trust_points_agg AS (
        SELECT
            driver_id,
            SUM(points)::double precision AS trust_points_previous_day
        FROM trust_points_log
        WHERE driver_id = p_driver_id
          AND log_date >= CURRENT_DATE - INTERVAL '1 day'
          AND log_date < CURRENT_DATE
        GROUP BY driver_id
    ),

    driver_agg AS (
        SELECT
            o.driver_id,
            o.completed_orders_previous_day,
            o.average_rating_previous_day,
            COALESCE(tp.trust_points_previous_day, 0) AS trust_points_previous_day,
            o.total_rating_previous_day
        FROM orders_and_ratings o
        LEFT JOIN trust_points_agg tp ON o.driver_id = tp.driver_id
    )

    UPDATE driver_points dp
    SET
        completed_orders_previous_day = da.completed_orders_previous_day,
        average_rating_previous_day = da.average_rating_previous_day,
        trust_points_previous_day = da.trust_points_previous_day,
        total_rating_previous_day = da.total_rating_previous_day,
        last_updated_at = now()
    FROM driver_agg da
    WHERE dp.driver_id = da.driver_id;

    RETURN QUERY
    SELECT
        driver_id,
        completed_orders_previous_day,
        average_rating_previous_day,
        trust_points_previous_day,
        total_rating_previous_day
    FROM driver_points
    WHERE driver_id = p_driver_id;
END;
$$ LANGUAGE plpgsql;

---------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_driver_wallet_previous_day(p_driver_id TEXT)
RETURNS DOUBLE PRECISION AS $$
DECLARE
    v_balance DOUBLE PRECISION;
BEGIN
    SELECT COALESCE(SUM(driver_earnings), 0)
    INTO v_balance
    FROM driver_transactions
    WHERE user_id = p_driver_id;

    INSERT INTO driver_wallets_previous_day (
        driver_wallet_orders_id,
        balance_previous_day,
        order_count,
        last_updated_at
    )
    VALUES (
        p_driver_id,
        v_balance,
        0,
        NOW()
    )
    ON CONFLICT (driver_wallet_orders_id)
    DO UPDATE SET
        balance_previous_day = EXCLUDED.balance_previous_day,
        order_count = 0,
        last_updated_at = NOW();

    RETURN v_balance;
END;
$$ LANGUAGE plpgsql;

END;



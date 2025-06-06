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
    driver_id_param INT,
    offset_value INT DEFAULT 0,
    limit_params INT DEFAULT 10
)
RETURNS TABLE (
    transaction_id INT,
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



END;



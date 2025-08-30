BEGIN;
CREATE OR REPLACE FUNCTION move_order_to_past(driver_id text)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    current_order_record current_orders%ROWTYPE;
    duration_minutes integer;
BEGIN
    -- Step 1: Fetch order
    SELECT * INTO current_order_record
    FROM current_orders
    WHERE driver_id = driver_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order % not found in current_orders', driver_id;
    END IF;

    -- Step 2: Calculate duration
    duration_minutes := EXTRACT(EPOCH FROM (NOW() - current_order_record.created_at)) / 60;

    -- Step 3: Insert into past_orders
    INSERT INTO past_orders (
        order_id,
        internal_id,
        customer_id,
        store_id,
        store_name_ar,
        store_name_en,
        internal_store_id,
        driver_id,
        order_details_text,
        amount,
        created_at,
        payment_method,
        orders_type,
        location_latitude,
        location_longitude,
        store_destination,
        customer_destination,
        delivery_fee,
        coupon_code,
        completed_at,
        delivery_duration,
        related_rating
    ) VALUES (
        current_order_record.order_id,
        current_order_record.internal_id,
        current_order_record.customer_id,
        current_order_record.store_id,
        current_order_record.store_name_ar,
        current_order_record.store_name_en,
        current_order_record.internal_store_id,
        current_order_record.driver_id,
        current_order_record.order_details_text,
        current_order_record.amount,
        current_order_record.created_at,
        current_order_record.payment_method,
        current_order_record.orders_type,
        current_order_record.location_latitude,
        current_order_record.location_longitude,
        current_order_record.store_destination,
        current_order_record.customer_destination,
        current_order_record.delivery_fee,
        current_order_record.coupon_code,
        NOW(),
        duration_minutes,
        NULL -- related_rating to be added later
    );

    -- Step 4: Delete from current_orders
    DELETE FROM current_orders WHERE driver_id = driver_id;

    -- Step 5: Update order_status
    INSERT INTO order_status (order_id, store_id, status, status_time)
    VALUES (p_order_id, current_order_record.internal_store_id, 'deliverd', NOW());
END;
$$;

----------------------------------------
CREATE OR REPLACE FUNCTION add_rating_if_delivered(
    p_order_id TEXT,
    p_customer_id BIGINT,
    p_driver_rating INTEGER,
    p_order_rating INTEGER,
    p_comment TEXT
) RETURNS VOID AS $$
DECLARE
    last_status TEXT;
    v_internal_order_id TEXT;
    v_internal_customer_id BIGINT;
    v_internal_store_id BIGINT;

BEGIN
    -- 1. جلب آخر حالة للطلب
    SELECT status
    INTO last_status
    FROM order_status
    WHERE order_id = p_order_id
    ORDER BY status_time DESC
    LIMIT 1;

    -- 2. التحقق أن الطلب تم توصيله
    IF last_status = 'delivered' THEN

        -- 3. جلب البيانات من past_orders
        SELECT internal_id, customer_id, internal_store_id
        INTO v_internal_order_id, v_internal_customer_id, v_internal_store_id
        FROM past_orders
        WHERE order_id = p_order_id;

        -- 4. إدراج التقييم
        INSERT INTO ratings (
            order_id,
            internal_order_id,
            customer_id,
            internal_store_id,
            driver_rating,
            order_rating,
            comment,
            rating_at
        ) VALUES (
            p_order_id,
            v_internal_order_id,
            v_internal_customer_id,
            v_internal_store_id,
            p_driver_rating,
            p_order_rating,
            p_comment,
            NOW()
        );

    END IF;

    RETURN;
END;
$$ LANGUAGE plpgsql;
END;
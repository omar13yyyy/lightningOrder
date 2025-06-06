BEGIN;

CREATE OR REPLACE FUNCTION haversine_distance_km(
  lat1 double precision, lon1 double precision,
  lat2 double precision, lon2 double precision
) RETURNS double precision AS $$
DECLARE
  dlat double precision := radians(lat2 - lat1);
  dlon double precision := radians(lon2 - lon1);
  a double precision;
  c double precision;
BEGIN
  a := sin(dlat / 2)^2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2)^2;
  c := 2 * atan2(sqrt(a), sqrt(1 - a));
  RETURN 6371 * c;  
END;
$$ LANGUAGE plpgsql IMMUTABLE;
--------------------------------------------------
    CREATE OR REPLACE FUNCTION get_stores_with_info(
        location_prefixes TEXT[],
        user_lat DOUBLE PRECISION,
        user_lng DOUBLE PRECISION,
        max_distance_km DOUBLE PRECISION,
        cost_multiplier DOUBLE PRECISION,
        duration_multiplier DOUBLE PRECISION,
        base_duration INTEGER,
        page_size INTEGER,
        page_number INTEGER,
        language TEXT
    )
    RETURNS TABLE (
        store_id TEXT,
        title TEXT,
        tags TEXT[],
        status enum_store_status,
        delivery_price INTEGER,
        min_order_price DOUBLE PRECISION,
        distance DOUBLE PRECISION,
        duration INTEGER,
        rating_previous_day DOUBLE PRECISION,
        number_of_raters INTEGER,
        logo_image_url TEXT,
        cover_image_url TEXT,
        total_count INTEGER,
        has_next BOOLEAN
    )
    AS $$
        WITH nearby_codes AS (
            SELECT unnest(location_prefixes) AS prefix
        ),
        filtered_stores AS (
            SELECT
                s.*,
                haversine_distance_km(user_lat, user_lng, s.latitude, s.longitude) AS distance
            FROM stores s
            JOIN nearby_codes nc ON s.location_code LIKE nc.prefix || '%'
            WHERE haversine_distance_km(user_lat, user_lng, s.latitude, s.longitude) <= max_distance_km
            AND s.status = 'open'
        ),
        enriched_data AS (
            SELECT
                fs.store_id,
                CASE
                    WHEN language = 'en' THEN fs.store_name_en
                    WHEN language = 'ar' THEN fs.store_name_ar
                    ELSE fs.store_name_en
                END AS title,
                fs.status,
                fs.min_order_price,
                fs.logo_image_url,
                fs.cover_image_url,
                fs.distance,
                ROUND(fs.distance * cost_multiplier)::INT AS delivery_price,
                base_duration + ROUND(fs.distance * duration_multiplier)::INT AS duration,
                sr.rating_previous_day,
                sr.number_of_raters,
                ARRAY(
                    SELECT t.tag_id::text
                    FROM store_tags t
                    WHERE t.store_id = fs.store_id
                ) AS tags
            FROM filtered_stores fs
            LEFT JOIN store_ratings_previous_day sr ON sr.store_internal_id = fs.internal_id
        ),
        paginated_data AS (
            SELECT *, COUNT(*) OVER() AS total_count
            FROM enriched_data
            ORDER BY rating_previous_day DESC NULLS LAST
            OFFSET page_size * (page_number - 1)
            LIMIT page_size
        )
        SELECT
            store_id,
            title,
            tags,
            status,
            delivery_price,
            min_order_price,
            distance,
            duration,
            rating_previous_day,
            number_of_raters,
            logo_image_url,
            cover_image_url,
            total_count,
            (total_count > page_size * page_number) AS has_next
        FROM paginated_data;
    $$ LANGUAGE sql;

-------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION apply_coupon_and_calculate_total(
    in_coupon_code TEXT,
    in_store_id TEXT,
    in_json_input JSONB
)
RETURNS TABLE (
    item_type TEXT, -- 'item' or 'modifier'
    parent_item_id TEXT,
    name_ar TEXT,
    name_en TEXT,
    unit_price DOUBLE PRECISION,
    quantity INT,
    total_price DOUBLE PRECISION,
    price_after_discount DOUBLE PRECISION
)
LANGUAGE plpgsql AS
$$
DECLARE
    item JSONB;
    mod JSONB;
    mod_item JSONB;
    product_ar JSONB;
    product_en JSONB;
    base_price DOUBLE PRECISION;
    mod_price DOUBLE PRECISION;
    discount_percentage DOUBLE PRECISION := 0;
BEGIN
    -- جلب نسبة الخصم من الكوبون إن وجد
    IF in_coupon_code IS NOT NULL AND in_coupon_code != 'NULL' THEN
        SELECT discount_value_percentage
        INTO discount_percentage
        FROM coupons
        WHERE code = in_coupon_code
          AND store_id = in_store_id
          AND expiration_date > NOW()
          AND (max_usage IS NULL OR real_usage < max_usage);
    END IF;

    -- المرور على كل صنف في الطلب
    FOR item IN SELECT * FROM jsonb_array_elements(in_json_input -> 'items')
    LOOP
        -- جلب بيانات المنتج
        SELECT product_data_ar_jsonb, product_data_en_jsonb
        INTO product_ar, product_en
        FROM products
        WHERE store_id = in_store_id
          AND (product_data_ar_jsonb @> jsonb_build_object('id', item->>'itemId'));

        -- استخراج السعر حسب الحجم
        base_price := (
            SELECT (size ->> 'price')::DOUBLE PRECISION
            FROM jsonb_array_elements(product_ar -> 'sizes') size
            WHERE size ->> 'id' = item ->> 'sizeId'
        );

        -- تعيين قيم الصنف
        item_type := 'item';
        parent_item_id := item ->> 'itemId';
        name_ar := product_ar ->> 'name';
        name_en := product_en ->> 'name';
        unit_price := base_price;
        quantity := 1;
        total_price := base_price;
        price_after_discount := base_price * (1 - discount_percentage);
        RETURN NEXT;

        -- المرور على الموديفايرات
        FOR mod IN SELECT * FROM jsonb_array_elements(item -> 'modifiers')
        LOOP
            FOR mod_item IN SELECT * FROM jsonb_array_elements(mod -> 'modifiers_item')
            LOOP
                -- جلب السعر من JSON
                mod_price := (
                    SELECT (m_item ->> 'price')::DOUBLE PRECISION
                    FROM jsonb_array_elements(
                        (
                            SELECT m -> 'items'
                            FROM jsonb_array_elements(product_ar -> 'modifiers') m
                            WHERE m ->> 'id' = mod ->> 'modifiers_id'
                        )
                    ) m_item
                    WHERE m_item ->> 'id' = mod_item ->> 'modifiers_item_id'
                );

                -- تعيين قيم الموديفاير
                item_type := 'modifier';
                parent_item_id := item ->> 'itemId';
                name_ar := (
                    SELECT m_item ->> 'name'
                    FROM jsonb_array_elements(
                        (
                            SELECT m -> 'items'
                            FROM jsonb_array_elements(product_ar -> 'modifiers') m
                            WHERE m ->> 'id' = mod ->> 'modifiers_id'
                        )
                    ) m_item
                    WHERE m_item ->> 'id' = mod_item ->> 'modifiers_item_id'
                );
                name_en := (
                    SELECT m_item ->> 'name'
                    FROM jsonb_array_elements(
                        (
                            SELECT m -> 'items'
                            FROM jsonb_array_elements(product_en -> 'modifiers') m
                            WHERE m ->> 'id' = mod ->> 'modifiers_id'
                        )
                    ) m_item
                    WHERE m_item ->> 'id' = mod_item ->> 'modifiers_item_id'
                );
                unit_price := mod_price;
                quantity := (mod_item ->> 'number')::INT;
                total_price := unit_price * quantity;
                price_after_discount := total_price * (1 - discount_percentage);
                RETURN NEXT;
            END LOOP;
        END LOOP;
    END LOOP;
END;
$$;


--------------------------------------------------------------------------------------------------------


END;
    
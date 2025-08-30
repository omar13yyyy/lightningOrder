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

-- FUNCTION: public.add_item_from_jsonb(jsonb, jsonb)

-- DROP FUNCTION IF EXISTS public.add_item_from_jsonb(jsonb, jsonb);

CREATE OR REPLACE FUNCTION public.add_item_from_jsonb(
	json_data jsonb,
	new_item jsonb)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
  RETURN jsonb_set(
    json_data,
    '{items}',
    (
      SELECT jsonb_agg(ite)
      FROM (
        SELECT ite
        FROM jsonb_array_elements(json_data->'items') AS x(ite)
        UNION ALL
        SELECT ite
        FROM jsonb_array_elements(('[' || new_item::text || ']')::jsonb) AS y(ite)
      ) AS all_ites
    )
  );
END;
$BODY$;

ALTER FUNCTION public.add_item_from_jsonb(jsonb, jsonb)
    OWNER TO postgres;




-- FUNCTION: public.add_category(jsonb, jsonb)

-- DROP FUNCTION IF EXISTS public.add_category(jsonb, jsonb);

CREATE OR REPLACE FUNCTION public.add_category(
	json_data jsonb,
	new_category jsonb)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
  RETURN jsonb_set(
    json_data,
    '{category}',
    (
      SELECT jsonb_agg(cat)
      FROM (
        SELECT cat
        FROM jsonb_array_elements(json_data->'category') AS x(cat)
        UNION ALL
        SELECT cat
        FROM jsonb_array_elements(('[' || new_category::text || ']')::jsonb) AS y(cat)
      ) AS all_cats
    )
  );
END;
$BODY$;

ALTER FUNCTION public.add_category(jsonb, jsonb)
    OWNER TO postgres;


-- FUNCTION: public.add_modifier_from_jsonb(jsonb, jsonb)

-- DROP FUNCTION IF EXISTS public.add_modifier_from_jsonb(jsonb, jsonb);

CREATE OR REPLACE FUNCTION public.add_modifier_from_jsonb(
	json_data jsonb,
	new_modifier jsonb)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
  RETURN jsonb_set(
    json_data,
    '{modifiers}',
    (
      SELECT jsonb_agg(modi)
      FROM (
        SELECT modi
        FROM jsonb_array_elements(json_data->'modifiers') AS x(modi)
        UNION ALL
        SELECT modi
        FROM jsonb_array_elements(('[' || new_modifier::text || ']')::jsonb) AS y(modi)
      ) AS all_modi
    )
  );
END;
$BODY$;

ALTER FUNCTION public.add_modifier_from_jsonb(jsonb, jsonb)
    OWNER TO postgres;



-- FUNCTION: public.addmodifieritem_from_jsonb(jsonb, jsonb)

-- DROP FUNCTION IF EXISTS public.addmodifieritem_from_jsonb(jsonb, jsonb);

CREATE OR REPLACE FUNCTION public.addmodifieritem_from_jsonb(
	jsonb_data jsonb,
	modifier_item jsonb)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  target_modifier_id TEXT := modifier_item->>'ModifierId';
  new_item JSONB := jsonb_build_object(
    'modifiers_item_id', modifier_item->>'modifiers_item_id',
	      'name', modifier_item->>'name',

    'price', (modifier_item->>'price')::INT,
    'is_default', (modifier_item->>'is_default')::BOOLEAN,
    'is_enable', (modifier_item->>'is_enable')::BOOLEAN,
    'order', (modifier_item->>'order')::INT
  );
BEGIN
  RETURN jsonb_set(
    jsonb_data,
    '{modifiers}',
    (
      SELECT jsonb_agg(
        CASE
          WHEN m->>'modifiers_id' = target_modifier_id THEN
            jsonb_set(
              m,
              '{items}',
              COALESCE(m->'items', '[]'::JSONB) || new_item
            )
          ELSE
            m
        END
      )
      FROM jsonb_array_elements(jsonb_data->'modifiers') AS m
    )
  );
END;
$BODY$;

ALTER FUNCTION public.addmodifieritem_from_jsonb(jsonb, jsonb)
    OWNER TO postgres;


-- FUNCTION: public.addsize_from_jsonb(jsonb, jsonb)

-- DROP FUNCTION IF EXISTS public.addsize_from_jsonb(jsonb, jsonb);

CREATE OR REPLACE FUNCTION public.addsize_from_jsonb(
	jsonb_data jsonb,
	size_data jsonb)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  item_id TEXT := size_data->>'itemId';
  new_size JSONB := jsonb_build_object(
    'size_id', size_data->>'size_id',
    'name', size_data->>'name',
    'price', (size_data->>'price')::INT,
    'calories', (size_data->>'calories')::INT,
    'order', size_data->>'order',
    'modifiers_id', size_data->'modifierid'
  );
BEGIN
  RETURN jsonb_set(
    jsonb_data,
    '{items}',
    (
      SELECT jsonb_agg(
        CASE
          WHEN item->>'item_id' = item_id THEN
            jsonb_set(
              item,
              '{sizes}',
              COALESCE(item->'sizes', '[]'::JSONB) || new_size
            )
          ELSE
            item
        END
      )
      FROM jsonb_array_elements(jsonb_data->'items') AS item
    )
  );
END;
$BODY$;

ALTER FUNCTION public.addsize_from_jsonb(jsonb, jsonb)
    OWNER TO postgres;





-- FUNCTION: public.delete_category_and_items(jsonb, text)

-- DROP FUNCTION IF EXISTS public.delete_category_and_items(jsonb, text);

CREATE OR REPLACE FUNCTION public.delete_category_and_items(
	original_data jsonb,
	category_id_to_delete text)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  new_data jsonb;
  item jsonb;
BEGIN
  new_data := jsonb_set(
    original_data,
    '{category}',
    (
      SELECT jsonb_agg(cat)
      FROM jsonb_array_elements(original_data->'category') AS cat
      WHERE cat->>'category_id' != category_id_to_delete
    )
  );

  new_data := jsonb_set(
    new_data,
    '{items}',
    (
      SELECT jsonb_agg(it)
      FROM jsonb_array_elements(new_data->'items') AS it
      WHERE it->>'category_id' != category_id_to_delete
    )
  );

  RETURN new_data;
END;
$BODY$;

ALTER FUNCTION public.delete_category_and_items(jsonb, text)
    OWNER TO postgres;



-- FUNCTION: public.delete_item_from_jsonb(jsonb, text)

-- DROP FUNCTION IF EXISTS public.delete_item_from_jsonb(jsonb, text);

CREATE OR REPLACE FUNCTION public.delete_item_from_jsonb(
	json_data jsonb,
	target_item_id text)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
  RETURN jsonb_set(
    json_data,
    '{items}',
    (
      SELECT jsonb_agg(it)
      FROM jsonb_array_elements(json_data->'items') AS it
      WHERE it->>'item_id' != target_item_id
    )
  );
END;
$BODY$;

ALTER FUNCTION public.delete_item_from_jsonb(jsonb, text)
    OWNER TO postgres;




-- FUNCTION: public.deletemodifier_from_jsonb(jsonb, text)

-- DROP FUNCTION IF EXISTS public.deletemodifier_from_jsonb(jsonb, text);

CREATE OR REPLACE FUNCTION public.deletemodifier_from_jsonb(
	jsonb_data jsonb,
	modifier_id text)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  updated_modifiers JSONB;
BEGIN
  updated_modifiers := (
    SELECT jsonb_agg(modifier)
    FROM jsonb_array_elements(jsonb_data->'modifiers') AS modifier
    WHERE modifier->>'modifiers_id' <> modifier_id
  );

  RETURN jsonb_set(jsonb_data, '{modifiers}', COALESCE(updated_modifiers, '[]'::jsonb));
END;
$BODY$;

ALTER FUNCTION public.deletemodifier_from_jsonb(jsonb, text)
    OWNER TO postgres;




-- FUNCTION: public.deletemodifieritem_from_jsonb(jsonb, text, text)

-- DROP FUNCTION IF EXISTS public.deletemodifieritem_from_jsonb(jsonb, text, text);

CREATE OR REPLACE FUNCTION public.deletemodifieritem_from_jsonb(
	jsonb_data jsonb,
	modifier_id text,
	modifier_item_id text)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
  RETURN jsonb_set(
    jsonb_data,
    '{modifiers}',
    (
      SELECT jsonb_agg(
        CASE
          WHEN m->>'modifiers_id' = modifier_id THEN
            jsonb_set(
              m,
              '{items}',
              (
                SELECT jsonb_agg(mi)
                FROM jsonb_array_elements(m->'items') AS mi
                WHERE mi->>'modifiers_item_id' <> modifier_item_id
              )
            )
          ELSE
            m
        END
      )
      FROM jsonb_array_elements(jsonb_data->'modifiers') AS m
    )
  );
END;
$BODY$;

ALTER FUNCTION public.deletemodifieritem_from_jsonb(jsonb, text, text)
    OWNER TO postgres;




-- FUNCTION: public.deletesize_from_jsonb(jsonb, text)

-- DROP FUNCTION IF EXISTS public.deletesize_from_jsonb(jsonb, text);

CREATE OR REPLACE FUNCTION public.deletesize_from_jsonb(
	jsonb_data jsonb,
	size_id text)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  updated_items JSONB;
BEGIN
  updated_items := (
    SELECT jsonb_agg(
      jsonb_set(
        item,
        '{sizes}',
        COALESCE((
          SELECT jsonb_agg(size)
          FROM jsonb_array_elements(item->'sizes') AS size
          WHERE size->>'size_id' <> size_id
        ), '[]'::jsonb)  
      )
    )
    FROM jsonb_array_elements(jsonb_data->'items') AS item
  );

  RETURN jsonb_set(jsonb_data, '{items}', updated_items);
END;
$BODY$;

ALTER FUNCTION public.deletesize_from_jsonb(jsonb, text)
    OWNER TO postgres;



-- FUNCTION: public.edit_item_from_jsonb(jsonb, jsonb)

-- DROP FUNCTION IF EXISTS public.edit_item_from_jsonb(jsonb, jsonb);

CREATE OR REPLACE FUNCTION public.edit_item_from_jsonb(
	json_data jsonb,
	new_item jsonb)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  ite_id TEXT := new_item->>'item_id';
BEGIN
  RETURN jsonb_set(
    json_data,
    '{items}',
    COALESCE((
      SELECT jsonb_agg(
        CASE
          WHEN ite->>'item_id' = ite_id THEN
            ite || new_item
          ELSE ite
        END
      )
      FROM jsonb_array_elements(COALESCE(json_data->'items', '[]'::jsonb)) AS ite
    ), '[]'::jsonb)
  );
END;
$BODY$;

ALTER FUNCTION public.edit_item_from_jsonb(jsonb, jsonb)
    OWNER TO postgres;




-- FUNCTION: public.edit_modifier_from_jsonb(jsonb, jsonb)

-- DROP FUNCTION IF EXISTS public.edit_modifier_from_jsonb(jsonb, jsonb);

CREATE OR REPLACE FUNCTION public.edit_modifier_from_jsonb(
	json_data jsonb,
	new_modifier jsonb)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  modi_id TEXT := new_modifier->>'modifiers_id';
BEGIN
  RETURN jsonb_set(
    json_data,
    '{modifiers}',
    COALESCE((
      SELECT jsonb_agg(
        CASE
          WHEN modi->>'modifiers_id' = modi_id THEN
            modi || new_modifier
          ELSE modi
        END
      )
      FROM jsonb_array_elements(COALESCE(json_data->'modifiers', '[]'::jsonb)) AS modi
    ), '[]'::jsonb)
  );
END;
$BODY$;

ALTER FUNCTION public.edit_modifier_from_jsonb(jsonb, jsonb)
    OWNER TO postgres;




-- FUNCTION: public.editmodifiersitem_from_jsonb(jsonb, jsonb)

-- DROP FUNCTION IF EXISTS public.editmodifiersitem_from_jsonb(jsonb, jsonb);

CREATE OR REPLACE FUNCTION public.editmodifiersitem_from_jsonb(
	jsonb_data jsonb,
	modifier_item jsonb)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  modifier_id TEXT := modifier_item->>'ModifierId';
  item_id TEXT := modifier_item->>'modifiers_item_id';
  updated_item JSONB := jsonb_build_object(
    'modifiers_item_id', item_id,
    'name', modifier_item->>'name',
    'price', (modifier_item->>'price')::INT,
    'is_default', (modifier_item->>'is_default')::BOOLEAN,
    'is_enable', (modifier_item->>'is_enable')::BOOLEAN,
    'order', (modifier_item->>'order')::INT
  );
BEGIN
  RETURN jsonb_set(
    jsonb_data,
    '{modifiers}',
    (
      SELECT jsonb_agg(
        CASE
          WHEN m->>'modifiers_id' = modifier_id THEN
            jsonb_set(
              m,
              '{items}',
              (
                SELECT jsonb_agg(
                  CASE
                    WHEN i->>'modifiers_item_id' = item_id THEN
                      updated_item
                    ELSE
                      i
                  END
                )
                FROM jsonb_array_elements(m->'items') AS i
              )
            )
          ELSE
            m
        END
      )
      FROM jsonb_array_elements(jsonb_data->'modifiers') AS m
    )
  );
END;
$BODY$;

ALTER FUNCTION public.editmodifiersitem_from_jsonb(jsonb, jsonb)
    OWNER TO postgres;




-- FUNCTION: public.editsize_from_jsonb(jsonb, jsonb)

-- DROP FUNCTION IF EXISTS public.editsize_from_jsonb(jsonb, jsonb);

CREATE OR REPLACE FUNCTION public.editsize_from_jsonb(
	jsonb_data jsonb,
	size_data jsonb)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  item_id TEXT := size_data->>'itemId';
  size_id TEXT := size_data->>'sizeId';
  updated_size JSONB := jsonb_build_object(
    'size_id', size_id,
    'name',(size_data->>'name')::text,
    'price', (size_data->>'price')::INT,
    'calories', (size_data->>'calories')::INT,
    'order', 0,
    'modifiers_id', size_data->'modifierid'
  );
BEGIN
  RETURN jsonb_set(
    jsonb_data,
    '{items}',
    (
      SELECT jsonb_agg(
        CASE
          WHEN item->>'item_id' = item_id THEN
            jsonb_set(
              item,
              '{sizes}',
              (
                SELECT jsonb_agg(
                  CASE
                    WHEN size->>'size_id' = size_id THEN
                      updated_size
                    ELSE
                      size
                  END
                )
                FROM jsonb_array_elements(item->'sizes') AS size
              )
            )
          ELSE
            item
        END
      )
      FROM jsonb_array_elements(jsonb_data->'items') AS item
    )
  );
END;
$BODY$;

ALTER FUNCTION public.editsize_from_jsonb(jsonb, jsonb)
    OWNER TO postgres;



-- FUNCTION: public.update_category(jsonb, text, text, text, integer)

-- DROP FUNCTION IF EXISTS public.update_category(jsonb, text, text, text, integer);

CREATE OR REPLACE FUNCTION public.update_category(
	json_data jsonb,
	cat_id text,
	new_name_ar text,
	new_name_en text,
	new_order integer)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  new_category JSONB;
BEGIN
  new_category := jsonb_build_object(
    'category_id', cat_id,
    'name_ar', new_name_ar,
    'name_en', new_name_en,
    'order', new_order
  );

  RETURN jsonb_set(
    json_data,
    '{category}',
    (
      SELECT jsonb_agg(
        CASE
          WHEN cat->>'category_id' = cat_id THEN new_category
          ELSE cat
        END
      )
      FROM jsonb_array_elements(json_data->'category') AS cat
    )
  );
END;
$BODY$;

ALTER FUNCTION public.update_category(jsonb, text, text, text, integer)
    OWNER TO postgres;




-- FUNCTION: public.update_category(jsonb, jsonb)

-- DROP FUNCTION IF EXISTS public.update_category(jsonb, jsonb);

CREATE OR REPLACE FUNCTION public.update_category(
	json_data jsonb,
	new_category jsonb)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  cat_id TEXT := new_category->>'category_id';
BEGIN
  RETURN jsonb_set(
    json_data,
    '{category}',
    COALESCE((
      SELECT jsonb_agg(
        CASE
          WHEN cat->>'category_id' = cat_id THEN
            cat || new_category
          ELSE cat
        END
      )
      FROM jsonb_array_elements(COALESCE(json_data->'category', '[]'::jsonb)) AS cat
    ), '[]'::jsonb)
  );
END;
$BODY$;

ALTER FUNCTION public.update_category(jsonb, jsonb)
    OWNER TO postgres;



-- FUNCTION: public.update_store_stats_and_wallet(text)

-- DROP FUNCTION IF EXISTS public.update_store_stats_and_wallet(text);

CREATE OR REPLACE FUNCTION public.update_store_stats_and_wallet(
	p_store_id text)
    RETURNS double precision
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  -- مفاتيح المتجر
  v_internal_id           bigint;

  -- من الإحصائيات السابقة
  v_stat_balance_prev     double precision;
  v_stat_comm_prev        double precision;
  v_stat_total_orders_prev bigint;
  v_stat_total_revenue_prev double precision;
  v_stat_customers_prev   bigint;
  v_stat_last_update      timestamptz;

  -- من المحفظة السابقة
  v_wallet_prev           double precision;
  v_wallet_last_update    timestamptz;

  -- دلتا الترانزاكشنات بعد آخر تحديث
  v_credit_delta          double precision;
  v_debit_delta           double precision;
  v_commission_delta      double precision;
  v_orders_delta          bigint;
  v_revenue_delta         double precision;
  v_max_tx_time           timestamptz;

  -- دلتا الزيارات بعد آخر تحديث
  v_visits_delta          bigint;
  v_max_visit_time        timestamptz;

  -- الرصيد الجديد + أعظم وقت لمؤشر التحديث
  v_current_balance       double precision;
  v_new_last_update       timestamptz;
BEGIN
  -- 0) احصل على internal_id للمتجر
  SELECT internal_id
  INTO   v_internal_id
  FROM   stores
  WHERE  store_id = p_store_id
  LIMIT  1;

  IF v_internal_id IS NULL THEN
    RAISE EXCEPTION 'store_id % not found in stores', p_store_id;
  END IF;

  -- 1) تأمين سجل بالإحصائيات إن لم يوجد
  INSERT INTO statistics_previous_day (
    store_id, total_orders, total_revenue, average_delivery_time,
    customers_visited, balance_previous_day, platform_commission_balance_previous_day,
    last_updated_at
  )
  VALUES (
    p_store_id, 0, 0, NULL, 0, 0, 0, to_timestamp(0)  -- baseline
  )
  ON CONFLICT (store_id) DO NOTHING;

  -- خُذ الإحصائيات السابقة مع قفل
  SELECT
    COALESCE(balance_previous_day, 0),
    COALESCE(platform_commission_balance_previous_day, 0),
    COALESCE(total_orders, 0),
    COALESCE(total_revenue, 0),
    COALESCE(customers_visited, 0),
    COALESCE(last_updated_at, to_timestamp(0))
  INTO
    v_stat_balance_prev,
    v_stat_comm_prev,
    v_stat_total_orders_prev,
    v_stat_total_revenue_prev,
    v_stat_customers_prev,
    v_stat_last_update
  FROM statistics_previous_day
  WHERE store_id = p_store_id
  FOR UPDATE;

  -- 2) جهّز المحفظة إن لم تكن موجودة
  SELECT COALESCE(balance_previous_day, 0),
         COALESCE(last_updated_at, to_timestamp(0))
  INTO   v_wallet_prev, v_wallet_last_update
  FROM   store_wallets
  WHERE  store_id = p_store_id
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO store_wallets (store_id, internal_store_id, partner_id, balance_previous_day, last_updated_at)
    SELECT s.store_id, s.internal_id, s.partner_id, 0, to_timestamp(0)
    FROM stores s
    WHERE s.store_id = p_store_id
    ON CONFLICT (store_id) DO NOTHING;

    SELECT COALESCE(balance_previous_day, 0),
           COALESCE(last_updated_at, to_timestamp(0))
    INTO   v_wallet_prev, v_wallet_last_update
    FROM   store_wallets
    WHERE  store_id = p_store_id
    FOR UPDATE;
  END IF;

  -- 3) دلتا الترانزاكشنات منذ آخر تحديث
  SELECT
    COALESCE(SUM(amount) FILTER (WHERE transaction_type = 'deposit'), 0)                                           AS sum_deposit,
    COALESCE(SUM(amount) FILTER (WHERE transaction_type IN ('withdraw','discount')), 0)                             AS sum_debit,
    COALESCE(SUM(amount_platform_commission), 0)                                                                    AS sum_commission,
    COALESCE(COUNT(*) FILTER (WHERE transaction_type = 'deposit'), 0)                                               AS cnt_orders,
    COALESCE(SUM(amount) FILTER (WHERE transaction_type = 'deposit'), 0)                                            AS sum_revenue,
    MAX(transaction_at)                                                                                             AS max_tx_time
  INTO
    v_credit_delta,
    v_debit_delta,
    v_commission_delta,
    v_orders_delta,
    v_revenue_delta,
    v_max_tx_time
  FROM store_transactions
  WHERE store_id = p_store_id
    AND transaction_at > v_stat_last_update;

  -- 4) دلتا الزيارات من customers_visited (يعتمد internal_id)
  SELECT
    COALESCE(COUNT(*), 0)            AS visits,
    MAX(create_at)                   AS max_visit_time
  INTO
    v_visits_delta,
    v_max_visit_time
  FROM customers_visited
  WHERE store_id = v_internal_id
    AND create_at > v_stat_last_update;

  -- 5) الرصيد الجديد
  v_current_balance := v_wallet_prev + v_credit_delta - v_debit_delta;

  -- 6) أحدث وقت شوهد (للـ watermark)
  v_new_last_update := GREATEST(
    v_stat_last_update,
    COALESCE(v_max_tx_time, v_stat_last_update),
    COALESCE(v_max_visit_time, v_stat_last_update)
  );

  -- 7) حدّث المحفظة
  UPDATE store_wallets
  SET balance_previous_day = v_current_balance,
      last_updated_at      = v_new_last_update
  WHERE store_id = p_store_id;

  -- 8) حدّث الإحصائيات (تراكميًا)
  UPDATE statistics_previous_day
  SET balance_previous_day                          = v_current_balance,
      platform_commission_balance_previous_day      = v_stat_comm_prev + v_commission_delta,
      total_orders                                  = v_stat_total_orders_prev + v_orders_delta,
      total_revenue                                 = v_stat_total_revenue_prev + v_revenue_delta,
      customers_visited                             = v_stat_customers_prev + v_visits_delta,
      last_updated_at                               = v_new_last_update
  WHERE store_id = p_store_id;

  RETURN v_current_balance;
END;
$BODY$;

ALTER FUNCTION public.update_store_stats_and_wallet(text)
    OWNER TO postgres;
END;
    
BEGIN;



DROP TABLE IF EXISTS coupons,
products_sold,daily_statistics,document_images,products,store_ratings_previous_day
,store_categories,store_tags,stores,trends,system_settings,tags,working_hours,
public.roles,public.permisions,store_transactions,store_wallets,customers_visited
,public.role_permission,public.admins,address,partners,statistics_previous_day,category_tags
,withdrawal_document_images,withdrawal_requests;



--For STORES and Partner

CREATE TABLE customers_visited (
    visit_id bigserial,
    customer_id bigint,
    store_id  bigint,
    create_at timestamp with time zone
);

CREATE TABLE partners (
    partner_id bigserial,
    partner_name text,
    phone_number text,
    company_name_ar text,
    company_name_en text,
    user_name text,
    encrypted_password text ,
    bank_name text,
    iban text,
    email text,
    status enum_partner_status NOT NULL DEFAULT 'NULL',
    --previous day without platform_commission
    -- بس يسحب مصاري نحسم منها
    -- نحدثها بس يطلبها 
    wallet_balance DOUBLE PRECISION,
    last_updated_wallet_at timestamp with time zone,
    PRIMARY KEY (partner_id),
    UNIQUE("user_name")
);


CREATE TABLE coupons (
    code text ,
    store_id text,
    internal_store_id bigint ,
    description text,
    discount_value_percentage DOUBLE PRECISION CHECK (discount_value_percentage >= 0 AND discount_value_percentage <= 1) ,
    on_expense enum_on_expense NOT NULL DEFAULT 'NULL',
    min_order_value integer,
    expiration_date timestamp with time zone,
    max_usage integer,
    real_usage integer,
    coupon_type enum_coupon_type NOT NULL DEFAULT 'NULL',--Personal or public
      PRIMARY KEY (code)

);



--TODO : make (roleId-permissionId) unique

CREATE TABLE address (
    country text,
    under_country text,
    under2_country text,
    under3_country text,
    create_at timestamp with time zone,
    full_address text,-- (full address = country+under_country+under2_country+under3_country)

    PRIMARY KEY (full_address)

);

CREATE TABLE IF NOT EXISTS public.admins
(
    id serial,
    email text,
    role_id integer,
    name text,
    password text,
    create_at timestamp with time zone,
    PRIMARY KEY (email)
);


CREATE TABLE IF NOT EXISTS public.role_permission
(
    id serial,
    role_id integer,
    permission_id integer,
    create_at timestamp with time zone,
    PRIMARY KEY (id)
);
CREATE TABLE statistics_previous_day (
    store_id  text,
    total_orders bigint,
    total_revenue DOUBLE PRECISION,
    average_delivery_time timestamp with time zone,
    customers_visited integer,
    --previous day without platform_commission
    balance_previous_day DOUBLE PRECISION,
    --previous day platform_commission
    platform_commission_balance_previous_day DOUBLE PRECISION,
    last_updated_at timestamp with time zone,
    UNIQUE("store_id")
);

CREATE TABLE store_wallets (
    store_id  text,--ا بتشيليو هاد و يلي تحتو ليصير لكل شريك و وقتا بدكن تتذكرو تحدثو كمان مع كل طلب 
    internal_store_id bigint,
    partner_id bigint,

    balance_previous_day DOUBLE PRECISION,
    last_updated_at timestamp with time zone,
        PRIMARY KEY(store_id)

);

CREATE TABLE store_transactions (
    transaction_id text,
    partner_id bigint,
    store_id text,
    internal_store_id bigint ,
    transaction_type enum_store_transaction_type NOT NULL DEFAULT 'NULL',
    --without platform_commission
    --بدون نسبة المنصة  يعني مع حسم نسبة المنصة
    amount DOUBLE PRECISION,
    --platform_commission
    amount_platform_commission DOUBLE PRECISION,
    transaction_at timestamp with time zone,
    notes text,
    PRIMARY KEY(transaction_id)

);
CREATE TABLE IF NOT EXISTS public.permisions
(
    id serial,
    title text,
    create_at timestamp with time zone,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.roles
(
    id serial,
    title text,
    create_at timestamp with time zone,
    PRIMARY KEY (id)
);

CREATE TABLE working_hours (
    shift_id bigserial,
    store_id text,
    internal_store_id bigint,
    day_of_week enum_day_of_week NOT NULL DEFAULT 'NULL',
    opening_time TIME,
    closing_time TIME,
        PRIMARY KEY(shift_id)

);
CREATE TABLE system_settings (
    setting_key text,
    setting_value text,
    description text,
    category text,
    last_updated_at timestamp with time zone,
    UNIQUE("setting_key")
);


CREATE TABLE trends (
    trend_id text,
    internal_store_id text ,
    details text,
    contract_image text,
    from_date timestamp with time zone,
    to_date timestamp with time zone,
    create_at timestamp with time zone,
     PRIMARY KEY(trend_id),
     UNIQUE("internal_store_id")


);



CREATE TABLE tags (
    tag_id bigserial,
    tag_name_ar text,
    tag_name_en text,
    category_id text,

    PRIMARY KEY(tag_id)

);

CREATE TABLE stores (
    store_id text,
    internal_id bigserial,
    partner_id bigserial,
    store_name_ar text,
    store_name_en text,
    phone_number text,
    email text,
    full_address text,
    status enum_store_status NOT NULL DEFAULT 'NULL',
    internal_category_id bigint,
    category_id text,

    min_order_price DOUBLE PRECISION,
    Latitude text,
    longitude text,
    logo_image_url text,
    cover_image_url text,
    store_description text,
    location_code text,
    platform_commission DOUBLE PRECISION,
    orders_type enum_orders_type NOT NULL DEFAULT 'NULL',
    user_name text ,
    encrypted_password text ,
    trend_id text DEFAULT 'NULL',
        PRIMARY KEY(internal_id),
            UNIQUE("store_id")


);
CREATE TABLE store_tags (
    tag_id bigint,
    store_id text,
    internal_store_id bigint,
    PRIMARY KEY(tag_id)

);
--Added

CREATE TABLE category_tags (
    tag_id bigint,
    category_id text,
    internal_category_id bigint ,
    PRIMARY KEY(tag_id)

);
CREATE TABLE store_categories (
    category_id text,
    internal_id bigserial,
    category_name_ar text,
    category_name_en text,

    category_image text,
    PRIMARY KEY(internal_id),
    UNIQUE("category_id")

);

CREATE TABLE store_ratings_previous_day (
    store_internal_id bigserial,
    --not get costumer daily
    rating_previous_day DOUBLE PRECISION,
    number_of_raters integer,
    last_updated_at timestamp with time zone,
   PRIMARY KEY(store_internal_id)

);

CREATE TABLE products_sold ( 
    create_at text, --todo data+;+id
    order_id text,
    customer_id bigint,
    store_internal_id bigint,
    product_name_en text,
    product_name_ar text,
    internal_store_id bigint,
    product_internal_id bigint,
     product_id text,

    size_name_en text,
    size_name_ar text,
    price DOUBLE PRECISION,


    full_price DOUBLE PRECISION, -- قيمة الفاتورة الاجمالية يلي داخلها العنصر 
    coupon_code text,
      PRIMARY KEY (create_at)
);

--For Admin 
CREATE TABLE daily_statistics (
    daily_statistics  BOOLEAN PRIMARY KEY DEFAULT TRUE,
    total_orders text,
    total_revenue text,
    average_delivery_time timestamp with time zone,
    new_customers_count integer,
    last_updated_at timestamp with time zone
);

CREATE TABLE document_images (
    document_id bigserial,
    document_description text,
    user_id bigint,
    user_type enum_user_type NOT NULL DEFAULT 'NULL',
    image_url text,
    uploaded_at timestamp with time zone,
    expired boolean 

);
CREATE TABLE withdrawal_document_images (
    document_id bigserial,
    userId bigint,
    document_description text,
   user_type enum_withdrawal_user NOT NULL DEFAULT 'NULL',
   image_url text,
    Withdrawal_id text,
    uploaded_at timestamp with time zone,
    expired boolean 

);

CREATE TABLE withdrawal_requests (
    withdrawal_id text,
    partner_id bigint,
    withdrawal_status enum_withdrawal_status NOT NULL DEFAULT 'NULL',
    withdrawal_user enum_withdrawal_user NOT NULL DEFAULT 'NULL',
    uploaded_at timestamp with time zone,
    done boolean 

);

CREATE TABLE products (
    store_id text ,
    internal_store_id bigint,
    product_data_ar_jsonb jsonb,
    product_data_en_jsonb jsonb,
    UNIQUE("internal_store_id"),
        PRIMARY KEY(store_id)

);



-- FUNCTION: public.get_store_wallet_balance(text)

-- DROP FUNCTION IF EXISTS public.get_store_wallet_balance(text);

CREATE OR REPLACE FUNCTION public.get_store_wallet_balance(
  p_store_id text)
    RETURNS double precision
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    previous_balance       DOUBLE PRECISION;
    last_update            TIMESTAMP WITH TIME ZONE;
    total_credit           DOUBLE PRECISION;
    total_debit            DOUBLE PRECISION;
    current_balance        DOUBLE PRECISION;
    max_transaction_date   TIMESTAMP WITH TIME ZONE;
BEGIN
    -- احصل على الرصيد السابق وآخر وقت تحديث مع قفل السطر لضمان التزامن
    SELECT balance_previous_day, last_updated_at
    INTO previous_balance, last_update
    FROM store_wallets
    WHERE store_id = p_store_id
    FOR UPDATE;

    -- اجمع القيم وحدد أعلى تاريخ ترانزكشن في نفس الاستعلام
    SELECT
        COALESCE(SUM(amount) FILTER (WHERE transaction_type = 'deposit'), 0),
        COALESCE(SUM(amount) FILTER (WHERE transaction_type IN ('withdraw', 'discount')), 0),
        MAX(transaction_date)
    INTO total_credit, total_debit, max_transaction_date
    FROM store_transactions
    WHERE store_id = p_store_id
      AND transaction_date > last_update;

    -- احسب الرصيد الجديد
    current_balance := previous_balance + total_credit - total_debit;

    -- إذا ما في معاملات جديدة، نخلي وقت التحديث كما هو
    IF max_transaction_date IS NULL THEN
        max_transaction_date := last_update;
    END IF;

    -- حدّث جدول store_wallets بالرّصيد والتاريخ الجديد
    UPDATE store_wallets
    SET balance_previous_day = current_balance,
        last_updated_at = max_transaction_date
    WHERE store_id = p_store_id;

    -- أرجع الرصيد الجديد
    RETURN current_balance;
END;
$BODY$;

ALTER FUNCTION public.get_store_wallet_balance(text)
    OWNER TO postgres;




END;

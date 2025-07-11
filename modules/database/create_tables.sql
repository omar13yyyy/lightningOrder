
BEGIN;

-- من داخل قاعدة بيانات db1:
CREATE EXTENSION IF NOT EXISTS postgres_fdw;

-- إنشاء الاتصال بقاعدة البيانات الأخرى
CREATE SERVER db2_server FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'localhost', dbname 'db2', port '5432');

-- ربط المستخدم
CREATE USER MAPPING FOR current_user SERVER db2_server
OPTIONS (user 'postgres', password 'password');
--نكرر العمليو السابقة لكل السيرفرات 
-- استيراد جدول من db2
IMPORT FOREIGN SCHEMA public
FROM SERVER db2_server
INTO public;

-- الآن يمكنك عمل JOIN:
SELECT a.*, b.*
FROM users a
JOIN orders b ON a.id = b.user_id;




DROP TABLE IF EXISTS public.confirmation
,coupons,current_orders,order_status,customer_wallets_previous_day,driver_transactions
,products_sold,customers,daily_statistics,document_images,driver_points
,driver_transactions,driver_wallets_previous_day,drivers
,address,order_financial_logs,partners,past_orders
,electronic_payment,products,ratings,store_ratings_previous_day
,statistics_previous_day,store_categories,store_tags
,store_transactions,store_wallets,stores,trends,system_settings,customer_transactions
,tags,trust_points_log,working_hours,public.roles,public.permisions
,public.role_permission,public.admins;


DROP TYPE IF EXISTS enum_store_transaction_type ,enum_day_of_week,enum_store_status,
enum_orders_type,enum_user_type,enum_on_expense,enum_coupon_type,
enum_partner_status,enum_withdrawal_user,enum_withdrawal_status ,enum_order_status
,enum_user_transaction_type
, enum_vehicle_type,enum_driver_transaction_type ,
enum_trust_points_operation_type,enum_order_status, 
enum_payment_method,enum_orders_type , CASCADE;



--CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE enum_store_transaction_type AS ENUM ( 'deposit', 'withdraw','discount','NULL');
CREATE TYPE enum_day_of_week AS ENUM ( 'sun', 'mon','tue','wed', 'thu','fri','sat','NULL');
CREATE TYPE enum_store_status AS ENUM ( 'open','close','busy','NULL');
CREATE TYPE enum_orders_type AS ENUM ( 'take_away','delivery','take_away_and_delivery','NULL');
CREATE TYPE enum_user_type AS ENUM ( 'customer', 'store','partner', 'store_Payments','partner_Payments','driver_Payments','NULL');
CREATE TYPE enum_on_expense AS ENUM ( 'partner', 'our_company','both','NULL');
CREATE TYPE enum_coupon_type AS ENUM ( 'personal', 'public','NULL');
CREATE TYPE enum_partner_status AS ENUM ( 'available','blocked','NULL');
CREATE TYPE enum_withdrawal_status AS ENUM ( 'new','wait','done','NULL');

CREATE TYPE enum_withdrawal_user AS ENUM ( 'driver','partner','NULL');

CREATE TYPE enum_order_status AS ENUM ( 'accepted', 'rejected','with_driver', 'delivered','NULL');
CREATE TYPE enum_user_transaction_type AS ENUM ( 'input','output','NULL');
CREATE TYPE enum_vehicle_type AS ENUM ( 'car', 'motorcycle','bicycle','electric_bike','NULL');
CREATE TYPE enum_driver_transaction_type AS ENUM ( 'order_cost', 'driver_profits_received_to_driver','driver_order_cost_received_from_driver','NULL');
CREATE TYPE enum_trust_points_operation_type AS ENUM ( 'auto','manual','NULL');
CREATE TYPE enum_payment_method AS ENUM ( 'cash','online','wallet','wallet_and_cash','wallet_and_online','NULL');
CREATE TYPE enum_order_status AS ENUM ( 'accepted', 'rejected','with_driver','delivered','customer_not_Received','driver_not_Received','NULL');

CREATE TABLE  public.confirmation
(
    phone_number text,
code text,
    create_at timestamp with time zone,
    PRIMARY KEY (phone_number)
); 

CREATE TABLE coupons (
    code text ,
    store_id bigint,
    internal_store_id text ,
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

CREATE TABLE current_orders ( 
    order_id text ,
    internal_id bigint,
    customer_id bigint,
    store_id text,
    internal_store_id bigint,
    driver_id bigint,
    amount DOUBLE PRECISION,
    order_details_text text,--with details of locations
    created_at timestamp with time zone,
    payment_method enum_payment_method NOT NULL DEFAULT 'NULL',
    location_latitude DOUBLE PRECISION,
    location_longitude DOUBLE PRECISION,
    delivery_fee DOUBLE PRECISION,
    coupon_code text,
  PRIMARY KEY (internal_id)

);
CREATE TABLE products_sold ( 
    create_at text, --todo data+;+id
    order_id text,
    customer_id bigint,
    store_internal_id bigint,
    product_name_en text,
    product_name_ar text,
    product_internal_id bigint,
    size_name_en text,
        size_name_ar text,

    price DOUBLE PRECISION,
    full_price DOUBLE PRECISION,
    coupon_code text,
      PRIMARY KEY (create_at)
      --TODO index in coupon_code 
);
CREATE TABLE order_status (
    order_id text,
    status enum_order_status NOT NULL DEFAULT 'NULL',
    status_time timestamp with time zone

);
CREATE TABLE customer_wallets_previous_day (
    customer_wallet_id bigint ,
    balance_previous_day DOUBLE PRECISION,
    last_updated_at timestamp with time zone,
    UNIQUE("customer_wallet_id")
);
CREATE TABLE driver_transactions (
    transaction_id bigserial,
    user_id bigint,
    transaction_type enum_driver_transaction_type NOT NULL DEFAULT 'NULL',
    amount DOUBLE PRECISION,
    transaction_at timestamp with time zone,
    notes text,
    platform_commission DOUBLE PRECISION NOT NULL DEFAULT 0,
    driver_earnings DOUBLE PRECISION,
          PRIMARY KEY (transaction_id)

);
CREATE TABLE customers (
    customer_id bigserial,
    full_name text,
    phone_number text,
    email text,
    encrypted_password text,
    is_confirmed boolean,
    birth_date timestamp with time zone,
    address text,
    -- walletId is same userId
        UNIQUE("phone_number"),

    PRIMARY KEY (customer_id)

);

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
CREATE TABLE delivery_document_images (
    document_id bigserial,
    document_description text,
    user_id bigint,
    image_url text,
    uploaded_at timestamp with time zone,
    expired boolean 

);

CREATE TABLE driver_points (
    driver_id bigint,
    completed_orders_yesterday bigint,
    average_rating_yesterday DOUBLE PRECISION,
    trust_points_yesterday DOUBLE PRECISION,
    last_updated_at timestamp with time zone,
    total_ratings_yesterday integer ,
    UNIQUE("driver_id")

);

CREATE TABLE customer_transactions (
    transaction_id text,
    order_id text,
    order_internal_id bigint,
    driver_id bigint,
    transaction_type enum_user_transaction_type NOT NULL DEFAULT 'NULL',
    amount DOUBLE PRECISION,
    transaction_at timestamp with time zone,
    notes text,
        PRIMARY KEY (transaction_id)

);

CREATE TABLE driver_wallets_previous_day (
    driver_wallet_orders_id  bigint,
    balance_previous_day DOUBLE PRECISION,
    order_count integer,
    last_updated_at timestamp with time zone
);



CREATE TABLE drivers (
    driver_id bigserial,
    full_name text,
    phone_number text,
    email text,
    is_activated boolean,
   -- driver_image text,
    vehicle_type enum_vehicle_type NOT NULL DEFAULT 'NULL',
  --  plate text,
    address text,
    bank_name text,
    iban text,
    user_name text,
    encrypted_password text,

 --   driving_license_image text,
    UNIQUE("user_name"),

        PRIMARY KEY (driver_id)


);

CREATE TABLE address (
    country text,
    under_country text,
    under2_country text,
    under3_country text,
    create_at timestamp with time zone,
    full_address text,-- (full address = country+under_country+under2_country+under3_country)

    PRIMARY KEY (full_address)

    --primery Key
);
--for driver ?
CREATE TABLE order_financial_logs (
    log_id text,
    driver_id bigint,
    order_id text,
    platform_commission DOUBLE PRECISION CHECK (platform_commission >= 0 AND platform_commission <= 1),
    driver_earnings DOUBLE PRECISION,
    log_date timestamp with time zone

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
    wallet_balance DOUBLE PRECISION,
    last_updated_at timestamp with time zone,
    PRIMARY KEY (partner_id),
    UNIQUE("user_name")


);

CREATE TABLE past_orders (
    order_id text,
    internal_id bigint ,
    customer_id bigint,
    store_id text,
    internal_store_id bigint,
    driver_id bigint,
    order_details_text text,
    amount DOUBLE PRECISION,
    created_at timestamp with time zone,
    payment_method enum_payment_method NOT NULL DEFAULT 'NULL',
    location_latitude DOUBLE PRECISION,
    location_longitude DOUBLE PRECISION,
    delivery_fee DOUBLE PRECISION,
    coupon_code text,
    completed_at timestamp with time zone,
    delivery_duration integer,
    related_rating integer CHECK (related_rating >= 0 AND related_rating <= 5),
    UNIQUE("order_id"),
    PRIMARY KEY(internal_id)
);

CREATE TABLE electronic_payment (
    payment_id text,
    order_id text,
    card_type text,
    customer_id bigint,
    paid_amount DOUBLE PRECISION,
    bank_transaction text,
    payment_at timestamp with time zone,
        PRIMARY KEY(payment_id),
    UNIQUE("payment_id")

);

CREATE TABLE products (
    store_id text ,
    internal_store_id bigint,
    product_data_ar_jsonb jsonb,
    product_data_en_jsonb jsonb,
    UNIQUE("internal_store_id"),
        PRIMARY KEY(store_id)

);

CREATE TABLE ratings (
    order_id text,
    enternal_order_id bigint,

    customer_id bigint,
    driver_rating integer CHECK (driver_rating >= 1 AND driver_rating <= 5),
    order_rating integer  CHECK (order_rating >= 1 AND order_rating <= 5),
    comment text,
    rating_at timestamp with time zone,
    PRIMARY KEY(order_id)

);

CREATE TABLE store_ratings_previous_day (
    store_internal_id bigserial,
    rating_previous_day DOUBLE PRECISION,
    number_of_raters integer,
    last_updated_at timestamp with time zone,
   PRIMARY KEY(store_internal_id)

);

CREATE TABLE statistics_previous_day (
    statistics_id  BOOLEAN PRIMARY KEY DEFAULT TRUE,
    total_orders text,
    total_revenue text,
    average_delivery_time timestamp with time zone,
    new_customers_count integer,
    last_updated_at timestamp with time zone
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

CREATE TABLE store_tags (
    tag_id bigserial,
    store_id bigint,
    internal_store_id text,
    category_id text
    PRIMARY KEY(tag_id)

);

CREATE TABLE store_transactions (
    transaction_id bigint,
    partner_id bigint,
    store_id text,
    internal_store_id bigint ,
    transaction_type enum_store_transaction_type NOT NULL DEFAULT 'NULL',
    amount DOUBLE PRECISION,
    transaction_date timestamp with time zone,
    notes text,
    PRIMARY KEY(transaction_id)

);

CREATE TABLE store_wallets (
    store_id bigint ,
    internal_store_id text,
    partner_id bigint,
    balance_previous_day DOUBLE PRECISION,
    last_updated_at timestamp with time zone,
        PRIMARY KEY(store_id)

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
    category_id bigint,
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



CREATE TABLE system_settings (
    setting_key text,
    setting_value text,
    description text,
    category text,
    last_updated_at timestamp with time zone,
    UNIQUE("setting_key")
);

CREATE TABLE tags (
    tag_id bigserial,
    tag_name_ar text,
    tag_name_en text,
    PRIMARY KEY(tag_id)

);

CREATE TABLE trust_points_log (
    log_id text,
    driver_id bigint,
    operation_type enum_trust_points_operation_type NOT NULL DEFAULT 'NULL',
    points integer,
    reason text,
    log_date timestamp with time zone,
    PRIMARY KEY(log_id)

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
CREATE TABLE IF NOT EXISTS public.roles
(
    id serial,
    title text,
    create_at timestamp with time zone,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.permisions
(
    id serial,
    title text,
    create_at timestamp with time zone,
    PRIMARY KEY (id)
);

--TODO : make (roleId-permissionId) unique

CREATE TABLE IF NOT EXISTS public.role_permission
(
    id serial,
    role_id integer,
    permission_id integer,
    create_at timestamp with time zone,
    PRIMARY KEY (id)
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




--product_data_ar_jsonb and product_data_en_jsonb jsonb
/*
{
  "category": {
    "category_id": uuid,
    "name": "المشروبات",
    "order": 1
  "items" :[
  "item": {
     "item_id" : uuid   
    "internal_item_id" : bigint  

     "image_url:"
    "name": "عصير برتقال طازج",
    "description": "عصير برتقال طبيعي 100%",
    "external_price": 12.5,
    "sizes": [
      {
        "size_id":uuid
        "name": "صغير",
        "calories": 120,
        "price": 10.0,
        "modifiers_id": [],
        "order":

      },
      {
        "size_id" : uuid
        "name": "كبير",
        "calories": 120,
        "price": 15.0,
         "modifiers_id": []
                 "order":


      }
    ],
    "allergens": ["الحمضيات"],
    "category_id": uuid,
    "is_best_seller": true,
    "order": 3,
    "is_activated": "متاح"
  },

}

]
  "modifiers": [
      { 

      "modifiers_id":uuid,
        "label" : name for modifiers for dataEntry 
        "title": "اختيار نوع السكر",
        "type": " - متعدد -اختياري",
        "min": 0,
        "max": 1,
        "items": [
          {
          
            "modifiers_item_id":uuid  
            "name": "بدون سكر",
            "price": 0.0, 
            "is_default": true,
            "order": 1
            "is_enable",
          },
          { 
            "modifiers_item_id":uuid  
            "name": "سكر خفيف",
            "price": 0.0,
            "is_default": false,
            "order": 2,
             "is_enable"

          }
        ]
      }
    ],


}
*/

--TODO : cites table and add-delete city
--TODO : best selles API + db
--TODO : send coupon for special store Customers (notification)
--TODO : add busy specific time
--TODO : store full_address as table 
--TODO : send enum_orders_type and others setting with setting API
--TODO : APIs for push notifications from dataentry to /user/driver/manager/partner




END;
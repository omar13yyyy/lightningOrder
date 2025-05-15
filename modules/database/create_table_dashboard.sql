BEGIN;



DROP TABLE IF EXISTS coupons,
products_sold,daily_statistics,document_images,products,store_ratings_previous_day
,store_categories,store_tags,stores,trends,system_settings,tags,working_hours,
public.roles,public.permisions,store_transactions,store_wallets,customers_visited
,public.role_permission,public.admins,address,partners,statistics_previous_day,category_tags;


DROP TYPE IF EXISTS enum_store_transaction_type ,enum_day_of_week,enum_store_status,
enum_orders_type,enum_user_type,enum_on_expense,enum_coupon_type,
enum_partner_status, CASCADE;




CREATE TYPE enum_store_transaction_type AS ENUM ( 'deposit', 'withdraw','discount','NULL');
CREATE TYPE enum_day_of_week AS ENUM ( 'sun', 'mon','tue','wed', 'thu','fri','sat','NULL');
CREATE TYPE enum_store_status AS ENUM ( 'open','close','busy','NULL');
CREATE TYPE enum_orders_type AS ENUM ( 'take_away','delivery','take_away_and_delivery','NULL');
CREATE TYPE enum_user_type AS ENUM ( 'customer', 'store','partner', 'store_Payments','partner_Payments','driver_Payments','NULL');
CREATE TYPE enum_on_expense AS ENUM ( 'partner', 'our_company','both','NULL');
CREATE TYPE enum_coupon_type AS ENUM ( 'personal', 'public','NULL');
CREATE TYPE enum_partner_status AS ENUM ( 'available','blocked','NULL');




--For STORES and Partner
CREATE TABLE statistics_previous_day (
    store_id  bigint,
    total_orders text,
    total_revenue text,
    average_delivery_time timestamp with time zone,
    customers_visited integer,
    last_updated_at timestamp with time zone,
    UNIQUE("store_id")
);
CREATE TABLE customers_visited (
    visit_id bigint,
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
    wallet_balance DOUBLE PRECISION,
    last_updated_at timestamp with time zone,
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

CREATE TABLE store_wallets (
    store_id  text,
    internal_store_id bigint,
    partner_id bigint,
        --previous day without platform_commission

    balance_previous_day DOUBLE PRECISION,
    last_updated_at timestamp with time zone,
        PRIMARY KEY(store_id)

);

CREATE TABLE store_transactions (
    transaction_id bigint,
    partner_id bigint,
    store_id text,
    internal_store_id bigint ,
    transaction_type enum_store_transaction_type NOT NULL DEFAULT 'NULL',
     --previous day without platform_commission
    amount DOUBLE PRECISION,
    transaction_date timestamp with time zone,
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
CREATE TABLE store_tags (
    tag_id bigserial,
    store_id text,
    internal_store_id bigint,
    PRIMARY KEY(tag_id)

);
--Added

CREATE TABLE category_tags (
    tag_id bigserial,
    category_id bigint,
    category_store_id text,
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
    full_price DOUBLE PRECISION,
    coupon_code text,
      PRIMARY KEY (create_at)
      --TODO index in coupon_code 
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


CREATE TABLE products (
    store_id text ,
    internal_store_id bigint,
    product_data_ar_jsonb jsonb,
    product_data_en_jsonb jsonb,
    UNIQUE("internal_store_id"),
        PRIMARY KEY(store_id)

);






END;

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

BEGIN;

DROP TABLE IF EXISTS current_orders ,order_status,order_financial_logs,
past_orders,ratings,electronic_payment;

DROP TYPE IF EXISTS  enum_order_status, 
enum_payment_method , CASCADE;



CREATE TYPE enum_payment_method AS ENUM ( 'cach','online','wallet','wallet_and_cach','wallet_and_online','NULL');
CREATE TYPE enum_order_status AS ENUM ( 'accepted', 'rejected','with_driver', 'delivered','returned','NULL');



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

--Rejected applications and those without drivers do not enter here.
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

CREATE TABLE order_status (
    order_id text,
    store_internal_id bigint,
    status enum_order_status NOT NULL DEFAULT 'NULL',
    status_time timestamp with time zone

);

CREATE TABLE order_financial_logs (

    log_id text,
    store_internal_id bigint,
    driver_id bigint,
    order_id text,
    platform_commission DOUBLE PRECISION CHECK (platform_commission >= 0 AND platform_commission <= 1),
    driver_earnings DOUBLE PRECISION,
    log_date timestamp with time zone

);
--Beware of repetition order_id and downt copy internal_id
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




END;
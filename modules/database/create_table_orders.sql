BEGIN;




DROP TABLE IF EXISTS orders,current_orders ,order_status,order_financial_logs,
past_orders,ratings,electronic_payment;
--CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE ratings (
        order_id text,
        internal_order_id bigint,
        internal_store_id bigint,
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
    store_name_ar text,
    store_name_en text,
    internal_store_id bigint,
    driver_id bigint,
    amount DOUBLE PRECISION,
    order_details_text text,--with details of locations
    created_at timestamp with time zone,
    payment_method enum_payment_method NOT NULL DEFAULT 'NULL',
    orders_type enum_orders_type NOT NULL DEFAULT 'NULL',
    location_latitude DOUBLE PRECISION,
    location_longitude DOUBLE PRECISION,
    store_destination DOUBLE PRECISION,
    customer_destination DOUBLE PRECISION,
    delivery_fee DOUBLE PRECISION,
    coupon_code text,
    UNIQUE("order_id"),

    PRIMARY KEY (internal_id)
);

CREATE TABLE order_status (
    order_id text,
    store_id bigint,
    status enum_order_status NOT NULL DEFAULT 'NULL',
    status_time timestamp with time zone,
    UNIQUE("order_id")

);
CREATE TABLE orders (
    order_id text,
    internal_id bigserial,
    unique("order_id"),
    UNIQUE("internal_id")

);
ALTER SEQUENCE orders_order_id_seq RESTART WITH 10000;

CREATE TABLE order_financial_logs (
    log_id text,
    driver_id bigint,
    order_id text,
    --todo  add order_internal_id
    order_internal_id bigint,
    store_id text,
    --wiht platform_commission
    order_amount DOUBLE PRECISION,
    platform_commission DOUBLE PRECISION CHECK (platform_commission >= 0 AND platform_commission <= 1),
    driver_earnings DOUBLE PRECISION,
    create_at timestamp with time zone,
    unique("order_internal_id")
);
--Beware of repetition order_id and downt copy internal_id
CREATE TABLE past_orders (
    order_id text,
    internal_id bigint ,
    customer_id bigint,
    store_id text,
    store_name_ar text,
    store_name_en text,
    internal_store_id bigint,
    driver_id bigint,
    order_details_text text,
    amount DOUBLE PRECISION,
    created_at timestamp with time zone,
    payment_method enum_payment_method NOT NULL DEFAULT 'NULL',
    orders_type enum_orders_type NOT NULL DEFAULT 'NULL',
    location_latitude DOUBLE PRECISION,
    location_longitude DOUBLE PRECISION,
    store_destination DOUBLE PRECISION,
    customer_destination DOUBLE PRECISION,
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
    UNIQUE("payment_id"),
        UNIQUE("order_id")


);
ALTER TABLE IF EXISTS public.electronic_payment
    ADD FOREIGN KEY (order_id)
    REFERENCES public.orders (order_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;



ALTER TABLE IF EXISTS public.order_financial_logs
    ADD FOREIGN KEY (order_internal_id)
    REFERENCES public.orders (internal_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.order_status
    ADD FOREIGN KEY (order_id)
    REFERENCES public.orders (order_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;




ALTER TABLE IF EXISTS public.ratings
    ADD FOREIGN KEY (internal_order_id)
    REFERENCES public.past_orders (internal_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;



END;
BEGIN;





DROP TABLE IF EXISTS driver_transactions,driver_points,driver_wallets_previous_day
,drivers,trust_points_log,delivery_document_images,effective_tokens_delivery,effective_tokens_delevery;


CREATE TABLE effective_tokens_delivery (
    user_id bigint ,
    token text,
    UNIQUE("user_id")
);

CREATE TABLE drivers (
    driver_id Text,
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
ALTER SEQUENCE drivers_driver_id_seq RESTART WITH 1000;

CREATE TABLE delivery_document_images (
    document_id text,
    document_description text,
    user_id bigint,
    image_url text,
    uploaded_at timestamp with time zone,
    expired boolean 

);
ALTER SEQUENCE delivery_document_images_document_id_seq RESTART WITH 1000;

CREATE TABLE driver_transactions (
    transaction_id Text,
    user_id bigint,
    transaction_type enum_driver_transaction_type NOT NULL DEFAULT 'NULL',
    amount DOUBLE PRECISION,
    transaction_at timestamp with time zone,
    notes text,
    platform_commission DOUBLE PRECISION NOT NULL DEFAULT 0,
    driver_earnings DOUBLE PRECISION,
          PRIMARY KEY (transaction_id)

);
ALTER SEQUENCE driver_transactions_transaction_id_seq RESTART WITH 1000;

CREATE TABLE driver_points (
    driver_id Text,
    completed_orders_previous_day bigint,
    average_rating_previous_day DOUBLE PRECISION,
    trust_points_previous_day DOUBLE PRECISION,
    last_updated_at timestamp with time zone,
    total_rating_previous_day integer ,
    UNIQUE("driver_id")

);


CREATE TABLE driver_wallets_previous_day (
    driver_wallet_orders_id  Text,
    balance_previous_day DOUBLE PRECISION,
    order_count integer,
    last_updated_at timestamp with time zone
);

CREATE TABLE trust_points_log (
    log_id text,
    driver_id text,
    operation_type enum_trust_points_operation_type NOT NULL DEFAULT 'NULL',
    points integer,
    reason text,
    log_date timestamp with time zone,
    PRIMARY KEY(log_id)

);

ALTER TABLE IF EXISTS public.delivery_document_images
    ADD FOREIGN KEY (user_id)
    REFERENCES public.drivers (driver_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.driver_points
    ADD FOREIGN KEY (driver_id)
    REFERENCES public.drivers (driver_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

--todo user_id ??
ALTER TABLE IF EXISTS public.driver_transactions
    ADD FOREIGN KEY (user_id)
    REFERENCES public.drivers (driver_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.driver_wallets_previous_day
    ADD FOREIGN KEY (driver_wallet_orders_id)
    REFERENCES public.drivers (driver_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;



ALTER TABLE IF EXISTS public.effective_tokens
    ADD FOREIGN KEY (user_id)
    REFERENCES public.drivers (driver_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.driver_points
    ADD FOREIGN KEY (driver_id)
    REFERENCES public.drivers (driver_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

END;

END;



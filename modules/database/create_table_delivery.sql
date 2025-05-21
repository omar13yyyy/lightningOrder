BEGIN;





DROP TABLE IF EXISTS driver_transactions,driver_points,driver_wallets_previous_day
,drivers,trust_points_log,delivery_document_images;

DROP TYPE IF EXISTS   enum_vehicle_type,enum_driver_transaction_type ,
enum_trust_points_operation_type, CASCADE;

CREATE TYPE enum_vehicle_type AS ENUM ( 'car', 'motorcycle','bicycle','electric_bike','NULL');
CREATE TYPE enum_driver_transaction_type AS ENUM ( 'order_cost', 'driver_profits_received_to_driver','driver_order_cost_received_from_driver','NULL');
CREATE TYPE enum_trust_points_operation_type AS ENUM ( 'auto','manual','NULL');

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
CREATE TABLE delivery_document_images (
    document_id bigserial,
    document_description text,
    user_id bigint,
    image_url text,
    uploaded_at timestamp with time zone,
    expired boolean 

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
CREATE TABLE driver_points (
    driver_id bigint,
    completed_orders_previous_day bigint,
    average_rating_previous_day DOUBLE PRECISION,
    trust_points_previous_day DOUBLE PRECISION,
    last_updated_at timestamp with time zone,
    total_rating_previous_day integer ,
    UNIQUE("driver_id")

);


CREATE TABLE driver_wallets_previous_day (
    driver_wallet_orders_id  bigint,
    balance_previous_day DOUBLE PRECISION,
    order_count integer,
    last_updated_at timestamp with time zone
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


END;



BEGIN;
DROP TABLE IF EXISTS public.confirmation,customer_wallets_previous_day
,customers ,customer_transactions,effective_tokens;


CREATE TABLE effective_tokens (
    user_id bigint ,
    token text,
    UNIQUE("user_id")
);


CREATE TABLE customer_wallets_previous_day (
    customer_wallet_id bigint ,
    balance_previous_day DOUBLE PRECISION,
    last_updated_at timestamp with time zone,
    UNIQUE("customer_wallet_id")
);


CREATE TABLE  public.confirmation
(
    phone_number text,
code text,
    create_at timestamp with time zone,
    PRIMARY KEY (phone_number)
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
    create_at timestamp with time zone,
    -- walletId is same userId
        UNIQUE("phone_number"),

    PRIMARY KEY (customer_id)

);
ALTER SEQUENCE customers_customer_id_seq RESTART WITH 1000;


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





ALTER TABLE IF EXISTS public.customer_transactions
    ADD FOREIGN KEY (driver_id)
    REFERENCES public.customers (customer_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.customer_wallets_previous_day
    ADD FOREIGN KEY (customer_wallet_id)
    REFERENCES public.customers (customer_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.customers
    ADD FOREIGN KEY (customer_id)
    REFERENCES public.customers (customer_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.effective_tokens
    ADD FOREIGN KEY (user_id)
    REFERENCES public.customers (customer_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;





    
CREATE OR REPLACE FUNCTION register_effective_token()
RETURNS TRIGGER AS $$
BEGIN

  INSERT INTO effective_tokens (user_id, token)
  VALUES (NEW.customer_id, 'NULL');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER after_customer_insert
AFTER INSERT ON customers
FOR EACH ROW
EXECUTE FUNCTION register_effective_token();


END;
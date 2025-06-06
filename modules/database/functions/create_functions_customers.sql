BEGIN;
CREATE OR REPLACE FUNCTION get_customer_wallet_balance(p_customer_id BIGINT)
RETURNS DOUBLE PRECISION AS $$
DECLARE
    v_balance DOUBLE PRECISION := 0;
    v_previous_balance DOUBLE PRECISION := 0;
    v_transactions_sum_in DOUBLE PRECISION := 0;
    v_transactions_sum_out DOUBLE PRECISION := 0;
BEGIN
    -- جلب آخر رصيد محفوظ
    SELECT COALESCE(balance_previous_day, 0)
    INTO v_previous_balance
    FROM customer_wallets_previous_day
    WHERE customer_wallet_id = p_customer_id;

    -- جمع العمليات من نوع wallet
    SELECT COALESCE(SUM(amount), 0)
    INTO v_transactions_sum_in
    FROM customer_transactions
    WHERE driver_id = p_customer_id AND transaction_type = 'input';
    
        SELECT COALESCE(SUM(amount), 0)
    INTO v_transactions_sum_out
    FROM customer_transactions
    WHERE driver_id = p_customer_id AND transaction_type = 'output';

    -- الحساب النهائي (الرصيد - الخصومات)
    v_balance := v_previous_balance - v_transactions_sum_out + v_transactions_sum_in;

    RETURN v_balance;
END;
$$ LANGUAGE plpgsql;

------------------------------------------------------------------


END;
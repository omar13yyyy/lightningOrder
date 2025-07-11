BEGIN;
DROP FUNCTION IF EXISTS apply_coupon_and_calculate_total(
    in_coupon_code TEXT,
    in_store_id TEXT,
    in_json_input JSONB
);

DROP TYPE IF EXISTS enum_store_transaction_type ,enum_day_of_week,enum_store_status,
enum_orders_type,enum_user_type,enum_on_expense,enum_coupon_type,
enum_partner_status,enum_withdrawal_user,enum_withdrawal_status 
,enum_user_transaction_type
, enum_vehicle_type,enum_driver_transaction_type ,
enum_trust_points_operation_type,enum_order_status, 
enum_payment_method   CASCADE;



CREATE TYPE enum_store_transaction_type AS ENUM ( 'deposit', 'withdraw','discount','NULL');
CREATE TYPE enum_day_of_week AS ENUM ( 'Sun', 'Mon','Tue','Wed', 'Thu','Fri','Sat','NULL');
CREATE TYPE enum_store_status AS ENUM ( 'open','close','busy','NULL');
CREATE TYPE enum_orders_type AS ENUM ( 'take_away','delivery','take_away_and_delivery','NULL');
CREATE TYPE enum_user_type AS ENUM ( 'customer', 'store','partner', 'store_Payments','partner_Payments','driver_Payments','NULL');
CREATE TYPE enum_on_expense AS ENUM ( 'partner', 'our_company','both','NULL');
CREATE TYPE enum_coupon_type AS ENUM ( 'personal', 'public','NULL');
CREATE TYPE enum_partner_status AS ENUM ( 'available','blocked','NULL');
CREATE TYPE enum_withdrawal_status AS ENUM ( 'new','wait','done','NULL');
CREATE TYPE enum_withdrawal_user AS ENUM ( 'driver','partner','NULL');
CREATE TYPE enum_user_transaction_type AS ENUM ( 'input','output','NULL');
CREATE TYPE enum_vehicle_type AS ENUM ( 'car', 'motorcycle','bicycle','electric_bike','NULL');
CREATE TYPE enum_driver_transaction_type AS ENUM ( 'order_cost', 'driver_profits_received_to_driver','driver_order_cost_received_from_driver','NULL');
CREATE TYPE enum_trust_points_operation_type AS ENUM ( 'auto','manual','NULL');
CREATE TYPE enum_payment_method AS ENUM ( 'cash','online','wallet','wallet_and_cash','wallet_and_online','NULL');
CREATE TYPE enum_order_status AS ENUM ( 'accepted', 'rejected','with_driver','delivered','customer_not_Received','driver_not_Received','NULL');


END;
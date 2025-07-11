export interface CurrentOrderRepo {
  order_id: string;
  internal_id: number;
  customer_id: number | null;
  store_id: string | null;
  store_name_ar: string | null;
  store_name_en: string | null;
  internal_store_id: number | null;
  driver_id: number | null;
  amount: number | null;
  order_details_text: string | null;
  created_at: string | null; // ISO date string
  payment_method: 'take_away'|'delivery'|'NULL'; // عدّل القيم حسب enum_payment_method
  orders_type:  'cash'|'online'|'wallet'|'wallet_and_cash'|'wallet_and_online'|'NULL';         // عدّل حسب enum_orders_type
  location_latitude: number | null;
  location_longitude: number | null;
  store_destination: number | null;
  customer_destination: number | null;
  delivery_fee: number | null;
  coupon_code: string | null;
}
export interface OrderFinancialLogRepo {
  log_id: string;
  driver_id: number | null;
  order_id: string | null;
  order_internal_id: number;
  store_id: string | null;
  order_amount: number | null;
  platform_commission: number | null; // نسبة بين 0 و 1
  driver_earnings: number | null;
}

export interface OrderFinancialLogService {
  driver_id: number | null;
  order_id: string | null;
  order_internal_id: number;
  store_id: string | null;
  order_amount: number | null;
  platform_commission: number | null; // نسبة بين 0 و 1
  driver_earnings: number | null;
}
export interface ElectronicPaymentRepo {
  payment_id: string; 
  order_id: string;
  card_type: string | null; 
  customer_id: number | null;
  paid_amount: number | null;
  bank_transaction: string | null; 
}
export interface ElectronicPaymentService {
  order_id: string;
  card_type: string | null; 
  customer_id: number | null;
  paid_amount: number | null;
  bank_transaction: string | null; 
}
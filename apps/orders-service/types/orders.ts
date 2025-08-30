import { TotalResolved } from "../../partners-stores-managers-dashboards-service/src/types/order";

export interface CurrentOrderRepo {
  order_id: string;
  customer_id: number | null;
  store_id: string | null;
  store_name_ar: string | null;
  store_name_en: string | null;
  internal_store_id: number | null;
  driver_id: number | null;
  amount: number | null;
  order_details_text: string|TotalResolved | null;
  payment_method:  'cash'|'online'|'wallet'|'wallet_and_cash'|'wallet_and_online'|'NULL';  
  orders_type:  'take_away'|'delivery'|'NULL'; 
  location_latitude: number | null;
  location_longitude: number | null;
  store_destination: number | null;
  customer_destination: number | null;
  delivery_fee: number ;
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


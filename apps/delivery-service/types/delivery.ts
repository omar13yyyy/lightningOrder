export interface DriverTransaction {
  transaction_id: string;
  user_id: string | null;
  transaction_type: 'order_cost'| 'driver_profits_received_to_driver'|'driver_order_cost_received_from_driver'|'NULL';
  amount: number | null;
  transaction_at: string | null; 
  notes: string | null;
  platform_commission: number; 
  driver_earnings: number | null;
}
export interface TrustPointsLogRepo {
  log_id: string;
  driver_id: string | null;
  operation_type: 'auto'|'manual'|'NULL'; 
  points: number | null;
  reason: string | null;
}
export interface TrustPointsLogService {
  log_id: string;
  driver_id: string | null;
  operation_type: 'auto'|'manual'|'NULL'; 
  points: number | null;
  reason: string | null;
}
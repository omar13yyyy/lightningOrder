import {
  DriverId, DriverOrderDecision, OrderId,
  StoreId,  StoreOrderDecision
} from "../types/types";

/* ---------- مفاتيح ---------- */
const keyD = (orderId: OrderId, driverId: DriverId) => `DR::${orderId}::${driverId}`;
const keyS = (orderId: OrderId, storeId: StoreId)   => `ST::${orderId}::${storeId}`;

/* ---------- تعريفات ---------- */
type Waiter<T> = { resolve: (d: T)=>void; reject:(e:any)=>void; timer: NodeJS.Timeout; };
const driverWaiters = new Map<string, Waiter<DriverOrderDecision>>();
const storeWaiters  = new Map<string, Waiter<StoreOrderDecision>>();

/* ---------- سائق ---------- */
export function waitForDriverDecision(orderId: OrderId, driverId: DriverId, timeoutMs=20000) {
  const k = keyD(orderId, driverId);
  const old = driverWaiters.get(k); if (old) { clearTimeout(old.timer); driverWaiters.delete(k); }
  return new Promise<DriverOrderDecision>((resolve, reject) => {
    const timer = setTimeout(()=>{ driverWaiters.delete(k); reject(new Error("driver_decision_timeout")); }, timeoutMs);
    driverWaiters.set(k, { resolve, reject, timer });
  });
}
export function resolveDriverDecision(d: DriverOrderDecision) {
  const k = keyD(d.orderId, d.driverId);
  const w = driverWaiters.get(k); if (!w) return;
  clearTimeout(w.timer); driverWaiters.delete(k); w.resolve(d);
}

/* ---------- متجر ---------- */
export function waitForStoreDecision(orderId: OrderId, storeId: StoreId, timeoutMs=20000) {
  const k = keyS(orderId, storeId);
  const old = storeWaiters.get(k); if (old) { clearTimeout(old.timer); storeWaiters.delete(k); }
  return new Promise<StoreOrderDecision>((resolve, reject) => {
    const timer = setTimeout(()=>{ storeWaiters.delete(k); reject(new Error("store_decision_timeout")); }, timeoutMs);
    storeWaiters.set(k, { resolve, reject, timer });
  });
}
export function resolveStoreDecision(d: StoreOrderDecision) {
  const k = keyS(d.orderId, d.storeId);
  const w = storeWaiters.get(k); if (!w) return;
  clearTimeout(w.timer); storeWaiters.delete(k); w.resolve(d);
}
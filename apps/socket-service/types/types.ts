import { TotalResolved } from "../../partners-stores-managers-dashboards-service/src/types/order";

// معرفات
export type DriverId = string ;
export type StoreId = string 
export type OrderId = string ;

// طلب مرسل إلى السائق
export interface DriverOrderRequest {
  orderId: OrderId;
  storeId: StoreId;
  driverId: DriverId;
  items: TotalResolved
  pickupLocation: { lat: number; lng: number; address?: string };
  dropoffLocation: { lat: number; lng: number; address?: string };
  notes?: string;
}

// طلب مرسل إلى المتجر
export interface StoreOrderRequest {
  orderId: OrderId;
  storeId: StoreId;
  // معلومات أخرى للعرض
  total?: number;
  items: TotalResolved;
  customer?: { name?: string; phone?: string };
}

// قرار السائق بخصوص الطلب
export interface DriverOrderDecision {
  orderId: OrderId;
  driverId: DriverId;
  storeId: StoreId;
  dis:number;
  accepted: boolean;
  reason?: string;
  at?: number;
}

// قرار المتجر بخصوص الطلب
export interface StoreOrderDecision {
  orderId: OrderId;
  storeId: StoreId;
  driverId: DriverId;
  accepted: boolean;
  reason?: string;
  at?: number;
}

// موقع السائق
export interface DriverLocationPayload {
  driverId: DriverId;
  lat: number;
  lng: number;
  speedKmh?: number;
  headingDeg?: number;
  accuracyM?: number;
  at?: number; // timestamp من جهة العميل
}

export interface DriverOrderRequest {
  orderId: OrderId;
  storeId: StoreId;
  driverId: DriverId; // سيُملأ قبل الإرسال للسائق
  items: TotalResolved;
  pickupLocation: { lat: number; lng: number; address?: string };
  dropoffLocation: { lat: number; lng: number; address?: string };
  notes?: string;
}

export interface DriverOrderDecision {
  orderId: OrderId;
  driverId: DriverId;
  storeId: StoreId;
  accepted: boolean;
  reason?: string;
  at?: number;
}

export interface DriverLocationPayload {
  driverId: DriverId;
  lat: number;
  lng: number;
  speedKmh?: number;
  headingDeg?: number;
  accuracyM?: number;
  at?: number;
}

export interface StoreOrderRequest {
  orderId: OrderId;
  storeId: StoreId; // يأتي جاهزًا من الطلب
  items: TotalResolved;
  total?: number;
  customer?: { name?: string; phone?: string };
}


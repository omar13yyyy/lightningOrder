import "socket.io";

declare module "socket.io" {
  interface Socket {
    role :'NULL' | 'driver'| 'customer'|'store'
    driver_id?: string;
    customer_id?: string;
    store_id?: string;
    vehicle?:string;
  }
}
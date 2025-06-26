

export interface Driver {
  id: string;
  role: "driver";
}

export interface OrderPayload {
  orderId: string;
  pickup: string;
  destination: string;
}


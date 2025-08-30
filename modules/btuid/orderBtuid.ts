import { BtuidGenerator } from "btuid";
import path from "path";

const rootLocation: string =
  process.env.ROOT_LOCATION || "E:/lightningOrder/";
const order: string = "orders";

const orderFilePath = path.join(
  rootLocation,
  "btuidFiles",
  order,
  "order.json"
);
export const orderGenerator = new BtuidGenerator({ path: orderFilePath });

const orderFinancialLogsFilePath = path.join(
  rootLocation,
  "btuidFiles",
  order,
  "order_financial_logs.json"
);
export const orderFinancialLogsGenerator = new BtuidGenerator({
  path: orderFinancialLogsFilePath,
});

const electronicPaymentFilePath = path.join(
  rootLocation,
  "btuidFiles",
  order,
  "electronic_payment.json"
);
export const electronicPaymentGenerator = new BtuidGenerator({
  path: electronicPaymentFilePath,
});

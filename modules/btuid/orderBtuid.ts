import { BtuidGenerator } from 'btuid';
import path from 'path';


const rootLocation: string = process.env.ROOT_LOCATION || "/home/omar/project3/coding/backend/"



const orderFilePath = path.join(rootLocation,"order"
, "btuidFiles", 'order.json');
export const orderGenerator = new BtuidGenerator({ path: orderFilePath });

const orderFinancialLogsFilePath = path.join(rootLocation,"order"
, "btuidFiles", 'order_financial_logs.json');
export const orderFinancialLogsGenerator = new BtuidGenerator({ path: orderFinancialLogsFilePath });

const electronicPaymentFilePath = path.join(rootLocation,"order"
, "btuidFiles", 'electronic_payment.json');
export const electronicPaymentGenerator = new BtuidGenerator({ path: electronicPaymentFilePath });


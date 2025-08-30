import { BtuidGenerator } from 'btuid';
import path from 'path';


const rootLocation: string = process.env.ROOT_LOCATION || "E:/lightningOrder/"
const customer :string = "customers"
const customerTransactionsFilePath = path.join(rootLocation,"btuidFiles",customer, 'customer_transactions.json');
export const customerTransactionsGenerator = new BtuidGenerator({ path: customerTransactionsFilePath });

const customersVisitedFilePath = path.join(rootLocation,"btuidFiles",customer,  'customers_visited.json');
export const customersVisitedGenerator = new BtuidGenerator({ path: customersVisitedFilePath });







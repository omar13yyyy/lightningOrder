import { BtuidGenerator } from 'btuid';
import path from 'path';


const rootLocation: string = process.env.ROOT_LOCATION || "/home/omar/project3/coding/backend/"

const customerTransactionsFilePath = path.join(rootLocation,"customer","btuidFiles", 'customer_transactions.json');
export const customerTransactionsGenerator = new BtuidGenerator({ path: customerTransactionsFilePath });

const customersVisitedFilePath = path.join(rootLocation,"customer", "btuidFiles", 'customers_visited.json');
export const customersVisitedGenerator = new BtuidGenerator({ path: customersVisitedFilePath });







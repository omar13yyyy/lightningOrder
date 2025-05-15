import {query as customersQuery } from './commitCustomerSQL' 
import {query as ordersQuery } from './commitOrdersSQL' 
import {query as deliveryQuery } from './commitDeliverySQL' 
import {query as dashboardQuery } from './commitDashboardSQL' 
import {ROOT_LOCATION} from './config'

import fs from 'fs' 

const customersSQL = fs.readFileSync(`${ROOT_LOCATION}modules/database/create_table_customers.sql`, "utf8");
const dashboardSQL = fs.readFileSync(`${ROOT_LOCATION}modules/database/create_table_dashboard.sql`, "utf8");
const deliverySQL = fs.readFileSync(`${ROOT_LOCATION}modules/database/create_table_delivery.sql`, "utf8");
const ordersSQL = fs.readFileSync(`${ROOT_LOCATION}modules/database/create_table_orders.sql`, "utf8");

export async function createDatabases(){

    
   await customersQuery(customersSQL,[]);
   await  ordersQuery(ordersSQL,[]);
   await deliveryQuery(deliverySQL,[]);
   await dashboardQuery(dashboardSQL,[]);

}

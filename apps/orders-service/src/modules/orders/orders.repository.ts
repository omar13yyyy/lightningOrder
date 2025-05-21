import { query  as dashboardQuery } from '../../../../../modules/database/commitDashboardSQL';
import { query   as ordersQuery } from '../../../../../modules/database/commitOrdersSQL';
//------------------------------------------------------------------------------------------

export const ordersRepository = {
  //------------------------------------------------------------------------------------------

 getCurrentStatistics: async (
    storeId: string[] | number,
  ): Promise<{
 accepted : number, 
 rejected : number,
 with_driver :number,
 delivered : number,
  returned : number
  }> => { 
    console.log(storeId,'storeid')
    const idsArray = Array.isArray(storeId) ? storeId : [storeId];

    const placeholders = idsArray.map((_, i) => `$${i + 1}`).join(', ');

console.log(placeholders+"placeholders",idsArray)
const sql = `
  SELECT
    count(*) FILTER (WHERE os.status = 'accepted') AS accepted_orders,
    count(*) FILTER (WHERE os.status = 'rejected') AS rejected_orders,
    count(*) FILTER (WHERE os.status = 'with_driver') AS with_driver_orders,
    count(*) FILTER (WHERE os.status = 'delivered') AS delivered_orders,
    count(*) FILTER (WHERE os.status = 'returned') AS returned_orders
  FROM order_status os
  WHERE
    os.store_internal_id IN (${placeholders})
`;



    const { rows } = await ordersQuery(sql, idsArray);
    const row = rows[0];

    return {
       accepted : Number(row.accepted_orders || 0),
 rejected :Number(row.rejected_orders || 0),
 with_driver :Number(row.with_driver_order || 0),
 delivered : Number(row.delivered_orders || 0),
  returned : Number(row.returned || 0),
 
    };
  }
  ,
  //------------------------------------------------------------------------------------------

getCurrentOrders: async (
  storeId: string[] | number,
  limit: number,
  offset: number
): Promise<{
  order_id: string;
  created_at: string;
  store_name: string;
  type: string;
  payment_method: string;
  order_details_text: number;
}[]> => {
  const sql = `
    SELECT
      order_id,
      created_at,
      store_name,  هي بدك تجيبيها لسا 
      type, و هي كمان 
      payment_method,
      order_details_text
    FROM past_orders
    WHERE store_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const { rows } = await ordersQuery(sql, [storeId, limit, offset]);

  return rows.map((row) => ({
    order_id: row.order_id,
    created_at: row.created_at,
    store_name: row.store_name,
    type: row.type,
    payment_method: row.payment_method,
    order_details_text: row.order_details_text
  }));
},
//------------------------------------------------------------------------------------------
getBillPastOrders: async (
  orderId: string
): Promise<{
  order_details_text: string;
}> => {
  const sql = `
    SELECT order_details_text
    FROM past_orders
    WHERE order_id = $1
    LIMIT 1
  `;

  const { rows } = await ordersQuery(sql, [orderId]);

  if (rows.length === 0) {
    throw new Error("Order not found");
  }

  return {
    order_details_text: rows[0].order_details_text
  };
},

//-----------------------------------------------------------------------------------------------------------
getBillCurrentOrders: async (
  orderId: string
): Promise<{
  order_details_text: string;
}> => {
  const sql = `
    SELECT order_details_text
    FROM current_orders
    WHERE order_id = $1
    LIMIT 1
  `;

  const { rows } = await ordersQuery(sql, [orderId]);

  if (rows.length === 0) {
    throw new Error("Order not found");
  }

  return {
    order_details_text: rows[0].order_details_text
  };
},

}
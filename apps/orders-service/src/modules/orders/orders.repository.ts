import { query   as ordersQuery ,query} from '../../../../../modules/database/commitOrdersSQL';
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
  previousOrder: async (
  internal_id: number,
  state?: string,
  paymentMethod?: number,
  fromPrice?: number,
  toPrice?: number,
  fromDate?: number,
  toDate?: number,
  limit: number = 10,
  offset: number = 0
): Promise<{
  order_id: string;
  created_at: string;
  store_name: string;
  type: string;
  related_rating: number;
  payment_method: string;
  order_details_text: string;
  customer_name: string;
  customer_phone_number: string;
  driver_name: string;
  driver_phone_number: string;
}[]> => {
  const conditions: string[] = ['o.store_id = $1'];
  const values: any[] = [internal_id];
  let paramIndex = 2;

  if (state) {
    conditions.push(`o.orders_type = $${paramIndex++}`);
    values.push(state);
  }

  if (paymentMethod !== undefined) {
    conditions.push(`o.payment_method = $${paramIndex++}`);
    values.push(paymentMethod);
  }

  if (fromDate && toDate) {
    conditions.push(`o.created_at BETWEEN $${paramIndex} AND $${paramIndex + 1}`);
    values.push(new Date(fromDate));
    values.push(new Date(toDate));
    paramIndex += 2;
  }

  const sql = `
    SELECT
      o.order_id,
      o.created_at,
      o.store_name_ar AS store_name,
      o.orders_type AS type,
      o.related_rating,
      o.payment_method::text,
      o.order_details_text,
      c.full_name AS customer_name,
      c.phone_number AS customer_phone_number,
      d.full_name AS driver_name,
      d.phone_number AS driver_phone_number
    FROM past_orders o
    JOIN customers c ON c.customer_id = o.customer_id
    JOIN drivers d ON d.driver_id = o.driver_id
    WHERE ${conditions.join(' AND ')}
    ORDER BY o.created_at DESC
    LIMIT $${paramIndex++} OFFSET $${paramIndex}
  `;

  values.push(limit, offset);

  const { rows } = await ordersQuery(sql, values);
  return rows;
}
,
//---------------------------------------------------------------------------------------------
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
store_name_ar,      
orders_type,
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
//-----------------------------------------------------------------------------------------------------------















//--------------------------OMAR------------------------------------------
getCurrentOrder : async (customer_id) => {
    const { rows }= await query(` 
      
SELECT
    co.order_id,
    os.status,
    co.store_name_ar,
    co.store_name_en,
    co.order_details_text,
    co.location_latitude,
    co.location_longitude,
    co.orders_type,
    co.payment_method,
    co.created_at
FROM
    current_orders co
JOIN
    order_status os
    ON co.order_id = os.order_id  
    where customer_id =$1  
    ORDER BY created_at DESC

    `,[customer_id])

        return rows ;
},

//------------------------------------------------------
getPreviousOrder : async (customer_id,limit,offset) => {
    const { rows }= await query(` 
      
SELECT
    po.order_id,
    os.status,
    po.store_name_ar,
    po.store_name_en,
    po.order_details_text,
    po.location_latitude,
    po.location_longitude,
    po.orders_type,
    po.payment_method,
    po.created_at
FROM
    past_orders po
JOIN
    order_status os
    ON co.order_id = po.order_id  
    where customer_id =$1 
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3 
    `,[customer_id,limit,offset])

        return rows ;
},

//------------------------------------------------------------

//TODO : update past_orders
addRating : async (order_id,customer_id,
  driver_rating,  order_rating,comment) => {
 query(` 
      
SELECT add_rating_if_delivered($1,$2,$3,$4,$5)


    `,[order_id,customer_id,driver_rating,order_rating,comment])

},
//------------------------------------------------------------
getPreviousDriverOrder : async (driverId,limit,offset) => {
 query(` 
      
SELECT get_past_deriver_orders($1,$2,$3)


    `,[driverId,limit,offset])

},

//-----------------------------------------------------------------------------------------------------------
driverDeliveOrder : async (driverId,limit,offset) => {
 query(` 
      
SELECT get_past_deriver_orders($1,$2,$3)


    `,[driverId,limit,offset])

},

}
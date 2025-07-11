import {
  query as ordersQuery,
  query,
} from "../../../../../modules/database/commitOrdersSQL";
import { RateRepoParams } from "../../../../partners-stores-managers-dashboards-service/src/types/order";
import { orderGenerator } from "../../../../../modules/btuid/orderBtuid";
import { CurrentOrderRepo, ElectronicPaymentRepo, OrderFinancialLogRepo } from "../../../types/orders";

//------------------------------------------------------------------------------------------

export const ordersRepository = {
  //------------------------------------------------------------------------------------------

  getCurrentStatistics: async (
    storeId: number[] | number
  ): Promise<{
    accepted: number;
    rejected: number;
    with_driver: number;
    delivered: number;
    returned: number;
    driver_not_Received: number;
    customer_not_Received: number;
  }> => {
    console.log(storeId, "storeid");
    const idsArray = Array.isArray(storeId) ? storeId : [storeId];

    const placeholders = idsArray.map((_, i) => `$${i + 1}`).join(", ");

    console.log(placeholders + "placeholders", idsArray);
    const sql = `
  SELECT
    count(*) FILTER (WHERE os.status = 'accepted') AS accepted_orders,
    count(*) FILTER (WHERE os.status = 'rejected') AS rejected_orders,
    count(*) FILTER (WHERE os.status = 'with_driver') AS with_driver_orders,
    count(*) FILTER (WHERE os.status = 'delivered') AS delivered_orders,
    count(*) FILTER (WHERE os.status = 'customer_not_Received') AS customer_not_Received,
        count(*) FILTER (WHERE os.status = 'driver_not_Received') AS driver_not_Received

  FROM order_status os
  WHERE
    os.store_id IN (${placeholders})
`;

    const { rows } = await ordersQuery(sql, idsArray);
    const row = rows[0];

    return {
      accepted: Number(row.accepted_orders || 0),
      rejected: Number(row.rejected_orders || 0),
      with_driver: Number(row.with_driver_order || 0),
      delivered: Number(row.delivered_orders || 0),
      returned: Number(row.returned || 0),
      driver_not_Received: Number(row.driver_not_Received || 0),
      customer_not_Received: Number(row.customer_not_Received || 0),
    };
  },
  //------------------------------------------------------------------------------------------
  previousOrder: async (
    storeId: number[] | number,
    pageSize: number,
    offset: number,
    state?: string,
    paymentMethod?: string,
    fromPrice?: number,
    toPrice?: number,
    fromDate?: Date,
    toDate?: Date
  ): Promise<
    {
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
    }[]
  > => {
    const idsArray = Array.isArray(storeId) ? storeId : [storeId];
    const placeholdersstoreid = idsArray.map((_, i) => `$${i + 1}`).join(", ");
    const conditions: string[] = [
      `o.internal_store_id IN (${placeholdersstoreid})`,
    ];
    const values: any[] = [...idsArray];

    let paramIndex = idsArray.length + 1;

    if (state) {
      conditions.push(`o.orders_type = $${paramIndex++}`);
      values.push(state);
    }

    if (paymentMethod) {
      conditions.push(`o.payment_method = $${paramIndex++}`);
      values.push(paymentMethod);
    }

    if (fromPrice && toPrice) {
      conditions.push(`o.amount BETWEEN $${paramIndex} AND $${paramIndex + 1}`);
      values.push(fromPrice, toPrice);
      paramIndex += 2;
    }

    if (fromDate && toDate) {
      conditions.push(
        `o.created_at BETWEEN $${paramIndex} AND $${paramIndex + 1}`
      );
      values.push(fromDate, toDate);
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
    JOIN remotely.customers c ON c.customer_id = o.customer_id
    JOIN remotely.drivers d ON d.driver_id = o.driver_id
    WHERE ${conditions.join(" AND ")}
    ORDER BY o.created_at DESC
    LIMIT $${paramIndex++} OFFSET $${paramIndex}
  `;

    values.push(pageSize, offset);

    const { rows } = await ordersQuery(sql, values);
    return rows;
  },
  //---------------------------------------------------------------------------------------------
  getprevorderCountstore: async (storeIds) => {
    console.log(storeIds, "storeid");
    const idsArray = Array.isArray(storeIds) ? storeIds : [storeIds];

    const placeholders = idsArray.map((_, i) => `$${i + 1}`).join(", ");

    console.log(placeholders + "placeholders", idsArray);

    let query = `
    SELECT COUNT(*) AS total
    FROM past_orders
    WHERE internal_store_id IN (${placeholders})
  `;

    const { rows } = await ordersQuery(query, idsArray);

    console.log(rows);

    return parseInt(rows[0].total);
  },

  //---------------------------------------------------------------------------------------------
  getCurrentOrders: async (
    storeId: number[] | number,
    limit: number,
    lastCursor?: string
  ): Promise<{
    orders: {
      order_id: string;
      created_at: string;
      store_name: string;
      type: string;
      payment_method: string;
      order_details_text: string;
    }[];
    hasNextPage: boolean;
    nextCursor?: string;
  }> => {
    const idsArray = Array.isArray(storeId) ? storeId : [storeId];
    const placeholders = idsArray.map((_, i) => `$${i + 1}`).join(", ");

    const values: any[] = [...idsArray, limit];
    let whereClause = `internal_store_id IN (${placeholders})`;

    const isValid = (v: any): boolean =>
      typeof v === "string" && v.trim() !== "";

    if (isValid(lastCursor)) {
      values.push(lastCursor);
      whereClause += ` AND created_at < $${values.length}`;
    }

    const sql = `
    SELECT
      order_id,
      created_at,
      store_name_ar,
      orders_type,
      payment_method,
      order_details_text
    FROM past_orders
    WHERE ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${idsArray.length + 1}
  `;

    const { rows } = await ordersQuery(sql, values);

    const hasNextPage = rows.length === limit;
    const nextCursor = hasNextPage ? rows[rows.length - 1].created_at : null;

    return {
      orders: rows.map((row) => ({
        order_id: row.order_id,
        created_at: row.created_at,
        store_name: row.store_name_ar,
        type: row.orders_type,
        payment_method: row.payment_method,
        order_details_text: row.order_details_text,
      })),
      hasNextPage,
      nextCursor,
    };
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
      order_details_text: rows[0].order_details_text,
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
      order_details_text: rows[0].order_details_text,
    };
  },
  //-----------------------------------------------------------------------------------------------------------

  //--------------------------OMAR------------------------------------------

  //TODO : update past_orders
  addRating: async (
    order_id,
    customer_id,
    driver_rating,
    order_rating,
    comment
  ) => {
    query(
      ` 
      
SELECT add_rating_if_delivered($1,$2,$3,$4,$5)


    `,
      [order_id, customer_id, driver_rating, order_rating, comment]
    );
  },
  //------------------------------------------------------------
  getPreviousDriverOrder: async (driverId, limit, offset) => {
    query(
      ` 
      
      SELECT get_past_deriver_orders($1,$2,$3)


    `,
      [driverId, limit, offset]
    );
  },

  //-----------------------------------------------------------------------------------------------------------
  previousDriverDeliveOrder: async (driverId, limit, offset) => {
    const { rows } = await query(
      ` 
      
      SELECT get_past_deriver_orders($1,$2,$3)


    `,
      [driverId, limit + 1, offset]
    );
    return rows;
  },

  //----------------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------
  previousCustomerOrder: async (
    customerId: String,
    limit: number,
    dateOffset: string
  ) => {
    const sql = `
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
    po.amount,
    po.coupon_code,
    po.delivery_fee,
    po.created_at
FROM 
    past_orders po
JOIN 
    order_status os ON po.order_id = os.order_id
WHERE 
    po.customer_id = $1 AND po.created_at <=$2 
        ORDER BY po.created_at DESC

    Limit $3
    `;
    let limitPlus = Number(limit) + 1;

    let { rows } = await ordersQuery(sql, [customerId, dateOffset, limitPlus]);
    return rows;
  },

  getCurrentCustomerOrders: async (
    customerId: string,
    limit: number,
    dateOffset: string
  ) => {
    const sql = `
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
    co.amount,
    co.coupon_code,
    co.delivery_fee,
    co.created_at
FROM 
    current_orders co
JOIN 
    order_status os ON co.order_id = os.order_id
WHERE 
    co.customer_id = $1 AND co.created_at <=$2
        ORDER BY co.created_at DESC

     Limit $3
    `;
    let limitPlus = Number(limit) + 1;

    let { rows } = await ordersQuery(sql, [customerId, dateOffset, limitPlus]);
    return rows;
  },

  //--------------------------------------------------------------

  //--------------------------------------------------------------
  getInternalsPastOrder: async (orderId: string) => {
    let { rows } = await query(
      ` 
      
SELECT customer_id, store_name_ar, store_name_en
FROM past_orders where order_id = $!
LIMIT 1;


    `,
      [orderId]
    );

    return rows[0];
  },

  //------------------------------------------

  delivered: async (driverId) => {},
  //------------------------------------

  confirmReceipt: async (driverId) => {},
  //------------------------------------

  customerRefusedToReceive: async (driverId) => {},
  //------------------------------------
  driverRefusedToReceive: async (driverId) => {},

  //------------------------------------
  intiOrder: async (orderId: string) => {
    const { rows } = await query(
      "INSERT INTO orders (order_id) VALUES ($1) RETURNING internal_id;",
      [orderId]
    );
    return rows[0].internal_id;
  },
  //------------------------------------
  insertCurrentOrder: async (order: CurrentOrderRepo) => {
    await query(
      `INSERT INTO current_orders (
      order_id, internal_id, customer_id, store_id, store_name_ar, store_name_en,
      internal_store_id, driver_id, amount, order_details_text, created_at,
      payment_method, orders_type, location_latitude, location_longitude,
      store_destination, customer_destination, delivery_fee, coupon_code
    ) VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11,
      $12, $13, $14, $15,
      $16, $17, $18, $19
    )`,
      [
        order.order_id,
        order.internal_id,
        order.customer_id,
        order.store_id,
        order.store_name_ar,
        order.store_name_en,
        order.internal_store_id,
        order.driver_id,
        order.amount,
        order.order_details_text,
        order.created_at,
        order.payment_method,
        order.orders_type,
        order.location_latitude,
        order.location_longitude,
        order.store_destination,
        order.customer_destination,
        order.delivery_fee,
        order.coupon_code,
      ]
    );
  },
  insertOrderStatus: async (
    orderId: string,
    internal_id: number,
    status: string
  ) => {
    return await query(
      "INSERT INTO order_status (order_id,store_id,status,status_time) VALUES ($1,$2,$3,now())",
      [orderId, internal_id, status]
    );
  },
  insertOrderFinancialLog: async (log: OrderFinancialLogRepo) => {
    await query(
      `INSERT INTO order_financial_logs (
      log_id,
      driver_id,
      order_id,
      order_internal_id,
      store_id,
      order_amount,
      platform_commission,
      driver_earnings,
      create_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, now()
    )
    RETURNING order_internal_id`,
      [
        log.driver_id,
        log.order_id,
        log.order_internal_id,
        log.store_id,
        log.order_amount,
        log.platform_commission,
        log.driver_earnings,
      ]
    );
  },
   insertElectronicPayment : async (
  payment: ElectronicPaymentRepo
) => {
  const res = await query(
    `INSERT INTO electronic_payment (
      payment_id,
      order_id,
      card_type,
      customer_id,
      paid_amount,
      bank_transaction,
      payment_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6,now()
    )
    `,
    [
      payment.payment_id,
      payment.order_id,
      payment.card_type,
      payment.customer_id,
      payment.paid_amount,
      payment.bank_transaction,
    ]
  );

  return ;
},
};

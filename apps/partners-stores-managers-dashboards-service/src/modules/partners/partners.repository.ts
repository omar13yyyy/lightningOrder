import { query as dashboardQuery } from "../../../../../modules/database/commitDashboardSQL";
//---------------------------------------------------------------------------------------
export const partnersRepository = {
  //---------------------------------------------------------------------------------------
  fetchPartnerIdPasswordByUserName: async (
    userName: string
  ): Promise<{ partner_id: string; encrypted_password: string }[]> => {
    const { rows } = await dashboardQuery(
      "SELECT partner_id, encrypted_password,partner_name FROM partners WHERE user_name = $1",
      [userName]
    );
    return rows;
  },
  //---------------------------------------------------------------------------------------
  //بتجيب معرف المتاجر الخاصة بالشريك و اسمائن
  getStoreIdsByPartnerId: async (
    partner_id: number
  ): Promise<
    {
      internal_id: number;
      store_id: string;
      store_name_ar: string;
      store_name_en: string;
    }[]
  > => {
    const { rows } = await dashboardQuery(
      "SELECT  internal_id as internal_id,store_id  ,store_name_ar,store_name_en FROM stores WHERE partner_id = $1",
      [partner_id]
    );
    console.log({ rows });
    return rows;
  },
  //---------------------------------------------------------------------------------------
  // بتجيب معرف المتجر الرقمي بدل المعرف النصي
  getStoreId: async (store_id: string): Promise<{ internal_id: number }> => {
    const { rows } = await dashboardQuery(
      "SELECT internal_id FROM stores WHERE store_id = $1",
      [store_id]
    );

    if (rows.length === 0) {
      throw new Error("Store not found");
    }
    console.log(rows[0].internal_id);
    return { internal_id: rows[0].internal_id };
  },

  //---------------------------------------------------------------------------------------
  // بتجيب عدد العناصر و الكاتيغوري  للشريك او لمتجر معين
  geInfoByStoreIds: async (
    internal_id: number[] | number,
    includeStoreCount: boolean
  ): Promise<{
    categoris_in_stores: number;
    items_in_stores: number;
    stores_count?: number;
  }> => {
    console.log(internal_id, "storeid");
    const idsArray = Array.isArray(internal_id) ? internal_id : [internal_id];

    const placeholders = idsArray.map((_, i) => `$${i + 1}`).join(", ");

    console.log(placeholders + "placeholders", includeStoreCount, idsArray);
    const sql = `
      SELECT
        SUM(
          CASE
            WHEN jsonb_typeof(product_data_ar_jsonb->'category') = 'array'
            THEN jsonb_array_length(product_data_ar_jsonb->'category')
            ELSE 0
          END
        ) AS categoris_in_stores,
        SUM(
          CASE
            WHEN jsonb_typeof(product_data_ar_jsonb->'items') = 'array'
            THEN jsonb_array_length(product_data_ar_jsonb->'items')
            ELSE 0
          END
        ) AS items_in_stores
        ${!includeStoreCount ? ", COUNT(*) AS stores_count" : ""}
      FROM products
      WHERE internal_store_id IN (${placeholders})
    `;

    const { rows } = await dashboardQuery(sql, idsArray);
    const row = rows[0];

    return {
      categoris_in_stores: Number(row.categoris_in_stores || 0),
      items_in_stores: Number(row.items_in_stores || 0),
      ...(!includeStoreCount && {
        stores_count: Number(row.stores_count || 0),
      }),
    };
  },
  //---------------------------------------------------------------------------------------
  //بتجيب كل المتاجر تبع الشريك مع معلوماتهم الكاملة
  getAllStores: async (
    partner_id: number
  ): Promise<
    {
      store_id: string;
      store_name_ar: string;
      full_address: string;
      status: string;
      min_order_price: number;
      logo_image_url: string;
      rating_previous_day: number;
      balance_previous_day: number;
    }[]
  > => {
    const sql = `
    SELECT 
      s.store_id,
      s.store_name_ar,
      s.full_address,
      s.status,
      s.min_order_price,
      s.logo_image_url,
      sr.rating_previous_day,

     st.balance_previous_day AS wallet_balance
    FROM stores s
    LEFT JOIN statistics_previous_day st ON s.store_id = st.store_id
    LEFT JOIN store_ratings_previous_day sr ON s.internal_id = sr.store_internal_id
    WHERE s.partner_id = $1
  `;

    const { rows } = await dashboardQuery(sql, [partner_id]);

    return rows;
  },
  //---------------------------------------------------------------------------------------
  getStatistics: async (
    storeId: string[] | string
  ): Promise<{
    orders: number;
    sales_with_commission: number;
    sales_without_commission: number;
    platform_commission_sales: number;
    visit_count: number;
  }> => {
    const idsArray = Array.isArray(storeId) ? storeId : [storeId];
    const placeholders = idsArray.map((_, i) => `$${i + 1}`).join(", ");

    const sql = `
    SELECT 
      SUM(total_orders) AS total_orders, 
      SUM(balance_previous_day) AS total_revenue, 
      SUM(platform_commission_balance_previous_day) AS total_revenue_for_platform, 
  (AVG(EXTRACT(EPOCH FROM average_delivery_time)) || ' seconds')::interval AS avg_delivery_time,
      SUM(customers_visited) AS visit_count
    FROM statistics_previous_day
    WHERE store_id IN (${placeholders})
  `;

    const { rows } = await dashboardQuery(sql, idsArray);
    const row = rows[0] || {};

    return {
      orders: Number(row.total_orders) || 0,
      sales_with_commission: Number(row.total_revenue) || 0,
      sales_without_commission:
        Number(row.total_revenue) - Number(row.total_revenue_for_platform) || 0,
      platform_commission_sales: Number(row.total_revenue_for_platform) || 0,
      visit_count: Number(row.visit_count) || 0,
    };
  },

  //---------------------------------------------------------------------------------------
  getStatisticsindate: async (
    storeId: string[] | string,
    fromDate: Date,
    toDate: Date
  ): Promise<{
    orders: number;
    sales_with_commission: number;
    sales_without_commission: number;
    platform_commission_sales: number;
    visit_count: number;
  }> => {
    const idsArray = Array.isArray(storeId) ? storeId : [storeId];
    const placeholders = idsArray.map((_, i) => `$${i + 1}`).join(", ");

    const datePlaceholderStart = `$${idsArray.length + 1}`;
    const datePlaceholderEnd = `$${idsArray.length + 2}`;

    const sql = `
    SELECT 
      COUNT(st.transaction_id) AS total_orders, 
      SUM(st.amount) AS total_revenue, 
      SUM(st.amount_platform_commission) AS total_revenue_for_platform, 
      COUNT(cv.visit_id) AS visit_count
    FROM store_transactions st
    JOIN customers_visited cv ON cv.store_id = st.internal_store_id
    WHERE st.store_id IN (${placeholders})
      AND st.transaction_type = 'deposit'
      AND st.transaction_at BETWEEN ${datePlaceholderStart} AND ${datePlaceholderEnd}
  `;

    const { rows } = await dashboardQuery(sql, [...idsArray, fromDate, toDate]);
    const row = rows[0] || {};

    return {
      orders: Number(row.total_orders) || 0,
      sales_with_commission: Number(row.total_revenue) || 0,
      sales_without_commission:
        Number(row.total_revenue) - Number(row.total_revenue_for_platform) || 0,
      platform_commission_sales: Number(row.total_revenue_for_platform) || 0,
      visit_count: Number(row.visit_count) || 0,
    };
  },

  //---------------------------------------------------------------------------------------
  bestSeller: async (
    //من الفرونت اذا ما حدد شي بيبعت بس اخر 30 يوم
    storeIds: number[] | number,
    fromDate: Date,
    toDate: Date
  ): Promise<
    Array<{
      product_name: string;
      product_id: number;
      size_name: string;
      times_sold: number;
      total_revenue: number;
    }>
  > => {
    console.log(fromDate);
    const idsArray = Array.isArray(storeIds) ? storeIds : [storeIds];
    const placeholders = idsArray.map((_, i) => `$${i + 1}`).join(", ");

    // نحدد المواقع للداتا حسب عدد المتاجر
    const dateFromIndex = idsArray.length + 1;
    const dateToIndex = idsArray.length + 2;

    const sql = `
    SELECT  
      COUNT(*) AS times_sold,
      product_name_ar AS product_name,
      product_internal_id AS product_id,
      size_name_ar AS size_name,
      SUM(price) AS total_revenue
    FROM products_sold  
    WHERE store_internal_id IN (${placeholders})
      AND create_at BETWEEN $${dateFromIndex} AND $${dateToIndex}
    GROUP BY product_internal_id, product_name_ar, size_name_ar 
    ORDER BY times_sold DESC 
    LIMIT 10;
  `;

    const params = [...idsArray, fromDate, toDate];
    const { rows } = await dashboardQuery(sql, params);

    return rows;
  },
  //---------------------------------------------------------------------------------------
  profile: async (
    partner_id: number
  ): Promise<{
    partner_name: string;
    phone_number: number;
    company_name_ar: string;
    company_name_en: string;
    bank_name: string;
    iban: string;
    status: string;
    email: string;
  }> => {
    const { rows } = await dashboardQuery(
      "SELECT  partner_name,phone_number,company_name_ar,company_name_en,bank_name,iban,status,email FROM partners WHERE partner_id = $1",
      [partner_id]
    );
    return rows[0];
  },
  //---------------------------------------------------------------------------------------
  getStoreByIdAndPartner: async (storeId: string, partnerId: number) => {
    const { rows } = await dashboardQuery(
      "SELECT internal_id FROM stores WHERE store_id = $1 AND partner_id = $2",
      [storeId, partnerId]
    );
    return rows[0];
  },
  //---------------------------------------------------------------------------------------

  updateStoreState: async (internal_id: number, newState: string) => {
    return await dashboardQuery(
      "UPDATE stores SET status = $1 WHERE internal_id = $2",
      [newState, internal_id]
    );
  },

  //---------------------------------------------------------------------------------------
  getStoreProfile: async (
    storeId: string,
    partnerId: number
  ): Promise<{
    store_name: string;
    phone_number: string;
    email: string;
    full_address: string;
    min_order_price: number;
    latitude: number;
    longitude: number;
    logo_image_url: string;
    cover_image_url: string;
    store_description: string;
    platform_commission: number;
    status:string;
    category_name_ar: string;
    category_name_en: string;
    tag_name_ar: string;
    tag_name_en: string;
  }> => {
    const sql = `
    SELECT 
      s.store_name_ar,
      s.phone_number,
      s.email,
      s.full_address,
      s.min_order_price,
      s.latitude,
      s.longitude,
      s.logo_image_url,
      s.cover_image_url,
      s.store_description,
      s.platform_commission,
      s.status,
      sc.category_name_ar,
      sc.category_name_en,
      t.tag_name_ar,
      t.tag_name_en
    FROM stores s
    left JOIN store_categories  sc ON sc.category_id = s.category_id
     left JOIN category_tags ct ON sc.internal_id = ct.internal_category_id 
     left JOIN tags t ON t.tag_id = ct.tag_id
    WHERE s.store_id = $1 
  `;

    const { rows } = await dashboardQuery(sql, [storeId]);

    if (rows.length === 0) {
      throw new Error("المتجر غير موجود أو لا يتبع هذا الشريك");
    }

    return rows[0];
  },
  //-----------------------------------------------------------------------------------------------
  getSpecialCustomers: async (
    storeIds: number[] | number,
    fromDate: Date,
    toDate: Date
  ): Promise<
    {
      customer_id: number;
      full_name: string;
      phone_number: string;
      order_count: number;
    }[]
  > => {
    const idsArray = Array.isArray(storeIds) ? storeIds : [storeIds];
    const placeholders = idsArray.map((_, i) => `$${i + 1}`).join(", ");

    // نحدد المواقع للداتا حسب عدد المتاجر
    const dateFromIndex = idsArray.length + 1;
    const dateToIndex = idsArray.length + 2;

    const sql = `
    SELECT 
      ps.customer_id, 
      c.full_name, 
      c.phone_number,
      COUNT(*) AS order_count
    FROM products_sold ps
    JOIN remotely.customers c ON c.customer_id = ps.customer_id
    WHERE ps.store_internal_id IN (${placeholders})
      AND ps.create_at BETWEEN $${dateFromIndex} AND $${dateToIndex}
    GROUP BY ps.customer_id, c.full_name, c.phone_number
    ORDER BY order_count DESC
    LIMIT 10
  `;
    const params = [...idsArray, fromDate, toDate];

    const { rows } = await dashboardQuery(sql, params);

    return rows;
  },
  //-----------------------------------------------------------------------------------
  gePartnerBalancepartner: async (
    partner_id: number
  ): Promise<{
    wallet_balance;
  }> => {
    const { rows } = await dashboardQuery(
      "SELECT  wallet_balance FROM partners WHERE partner_id = $1",
      [partner_id]
    );
    return rows[0];
  },
  //----------------------------------------------------------------------------------------
  gePartnerBalancestore: async (
    store_id: string
  ): Promise<{
    wallet_balance: number;
  }> => {
    const { rows } = await dashboardQuery(
      "SELECT  balance_previous_day as wallet_balance FROM statistics_previous_day WHERE store_id = $1",
      [store_id]
    );
    return rows[0];
  },

  //-----------------------------------------------------------------------------------
  walletTransferHistorystore: async (
    store_id: string,
    pageSize:number,
    offset:number,
  ): Promise<
    Array<{
      transaction_id: string;
      transaction_type: string;
      sales_without_commission: number;
      amount_platform_commission: number;
      transaction_date: Date;
      notes: string;
      sales_with_commission: number;
      store_name: string;
    }>
  > => {
    const { rows } = await dashboardQuery(
      `SELECT 
      transaction_id,
      transaction_type,
      amount,
      amount_platform_commission,
      transaction_at AS transaction_date,
      notes,
      amount + amount_platform_commission AS sales_with_commission,
      s.store_name_ar AS store_name
    FROM store_transactions st 
      JOIN stores s ON s.store_id = st.store_id 
    WHERE st.store_id = $1     
      LIMIT $2 OFFSET $3
`,
      [store_id, pageSize, offset]
    );

    return rows;
  },
  //-----------------------------------------------------------------------------------

getWalletTransferHistoryRows: async (
  partnerId: number,
  limit: number,
  offset: number
) => {
  const query = `
    SELECT 
      transaction_id,
      transaction_type,
      amount,
      amount_platform_commission,
      transaction_at AS transaction_date,
      notes,
      amount + amount_platform_commission AS sales_with_commission,
      s.store_name_ar AS store_name
    FROM store_transactions st 
    JOIN stores s ON s.store_id = st.store_id 
    WHERE st.partner_id = $1
    ORDER BY transaction_date DESC
    LIMIT $2 OFFSET $3
  `;
  const { rows } = await dashboardQuery(query, [partnerId, limit, offset]);
  return rows;
},
//-------------------------------------------------------------------------------------------

getWalletTransferHistoryCountstore: async (
  storeId:string,
) => {
  const { rows } = await dashboardQuery(
    `SELECT COUNT(*) AS total FROM store_transactions WHERE store_id=$1`,
    [storeId]
  );
  return parseInt(rows[0].total);
},


  //-----------------------------------------------------------------------------------
getWalletTransferHistoryCount: async (
  partnerId: number
) => {
  const { rows } = await dashboardQuery(
    `SELECT COUNT(*) AS total FROM store_transactions WHERE partner_id = $1`,
    [partnerId]
  );
  return parseInt(rows[0].total);
},


  //-----------------------------------------------------------------------------------
  walletBalanceWithdrawalRequest: async (
    partnerId: number,
    uploadedAt: Date = new Date()
  ): Promise<{ withdrawal_id: string }> => {
    const { rows } = await dashboardQuery(
      `
    INSERT INTO withdrawal_requests (
      withdrawal_id,
      partner_id,
      withdrawal_status,
      withdrawal_user,
      uploaded_at,
      done
    ) VALUES (
      gen_random_uuid()::text,
      $1,
      'new',
      $2,
      $3,
      false
    )
    RETURNING withdrawal_id
    `,
      [partnerId, "partner", uploadedAt]
    );

    return { withdrawal_id: rows[0].withdrawal_id };
  },

  //-----------------------------------------------------------------------------------------------------

  getProductDataByStoreId: async (storeId: string) => {
    const { rows } = await dashboardQuery(
      ` SELECT product_data_ar_jsonb FROM products WHERE internal_store_id = $1`,
      [storeId]
    );
    return rows[0]?.product_data_ar_jsonb;
  },
  //--------------------------------------------------------------------------------------------------------

  updateProductDataByStoreId: async (storeId: string, newProductData: any) => {
    await dashboardQuery(
      `UPDATE products SET product_data_ar_jsonb = $1 WHERE internal_store_id = $2`,
      [newProductData, storeId]
    );
  },

  //---------------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------------------
  getStoreProfilemanger: async (
    storeId: number
  ): Promise<{
    store_name: string;
    phone_number: string;
    email: string;
    full_address: string;
    min_order_price: number;
    latitude: number;
    longitude: number;
    logo_image_url: string;
    cover_image_url: string;
    store_description: string;
    platform_commission: number;
    category_name_ar: string;
    category_name_en: string;
    tag_name_ar: string;
    tag_name_en: string;
  }> => {
    const sql = `
    SELECT 
      s.store_name,
      s.phone_number,
      s.email,
      s.full_address,
      s.min_order_price,
      s.latitude,
      s.longitude,
      s.logo_image_url,
      s.cover_image_url,
      s.store_description,
      s.platform_commission,
      st.category_name_ar,
      st.category_name_en,
      t.tag_name_ar,
      t.tag_name_en
    FROM remotely.stores s
    JOIN store_categories  sc ON sc.internal_id = s.category_id
    JOIN category_tags ct ON sc.internal_id = ct.internal_category_id 
    JOIN tags t ON t.tag_id = ct.tag_id
    WHERE s.store_id = $1 
  `;

    const { rows } = await dashboardQuery(sql, [storeId]);

    if (rows.length === 0) {
      throw new Error("المتجر غير موجود أو لا يتبع هذا الشريك");
    }

    return rows[0];
  },
  //-------------------------------------------------------------------------------------------
  getStoreBalance: async (
    store_id: string
  ): Promise<{
    wallet_balance;
  }> => {
    const { rows } = await dashboardQuery(
      "SELECT  balance_previous_day FROM statistics_previous_day WHERE store_id = $1",
      [store_id]
    );
    return rows[0];
  },
  //-------------------------------------------------------------------------------------------
  walletTransferHistoryStore: async (
    store_id: string
  ): Promise<
    Array<{
      transaction_id: string;
      transaction_type: string;
      sales_without_commission: number;
      amount_platform_commission: number;
      transaction_date: Date;
      notes: string;
      sales_with_commission: number;
      store_name: string;
    }>
  > => {
    const { rows } = await dashboardQuery(
      `SELECT 
      transaction_id,
      transaction_type,
      sales_without_commission,
      amount_platform_commission,
      transaction_at AS transaction_date,
      notes,
      sales_without_commission + amount_platform_commission AS sales_with_commission,
      s.store_name_ar AS store_name
    FROM store_transactions st 
    JOIN stores s ON s.store_id = st.store_id 
    WHERE st.store_id = $1`,
      [store_id]
    );

    return rows;
  },
  //-------------------------------------------------------------------------------------------
 
  //------------------------------------------------------------------------------------------------
};

import { query  as dashboardQuery } from '../../../../../modules/database/commitDashboardSQL';
import { query   as ordersQuery } from '../../../../../modules/database/commitOrdersSQL';
//---------------------------------------------------------------------------------------
export const partnersRepository = {
  //---------------------------------------------------------------------------------------
  fetchPartnerIdPasswordByUserName: async (
    userName: string
  ): Promise<{ customer_id: string; encrypted_password: string }[]> => {
    const {rows} = await dashboardQuery(
      'SELECT partner_id, encrypted_password FROM partners WHERE partner_name = $1',
      [userName]
    );
    return rows;
  },
  //---------------------------------------------------------------------------------------

  getStoreIdsByPartnerId: async (
    partner_id: string
  ): Promise<{
    internal_id: any; store_id: string 
}[]> => {
    const {rows}= await dashboardQuery(
      'SELECT  internal_id FROM stores WHERE partner_id = $1',
      [1]
    );
    console.log({rows})
    return rows;
},
//---------------------------------------------------------------------------------------
  geInfoByStoreIds: async (
    storeId: string[] | number,
    includeStoreCount: boolean
  ): Promise<{
    categoris_in_stores: number;
    items_in_stores: number;
    stores_count?: number;
  }> => { 
    console.log(storeId,'storeid')
    const idsArray = Array.isArray(storeId) ? storeId : [storeId];

    const placeholders = idsArray.map((_, i) => `$${i + 1}`).join(', ');

console.log(placeholders+"placeholders",includeStoreCount,idsArray)
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
        ${!includeStoreCount ? ', COUNT(*) AS stores_count' : ''}
      FROM products
      WHERE internal_store_id IN (${placeholders})
    `;

    const { rows } = await dashboardQuery(sql, idsArray);
    const row = rows[0];

    return {
      categoris_in_stores: Number(row.categoris_in_stores || 0),
      items_in_stores: Number(row.items_in_stores || 0),
      ...(!includeStoreCount && { stores_count: Number(row.stores_count || 0) })
    };
  },
  //---------------------------------------------------------------------------------------
  getAllStores: async (
  partner_id: string
): Promise<{
  store_id: string;
  store_name_ar: string;
  full_address: string;
  status: string;
  min_order_price: number;
  logo_image_url: string;
  rating_previous_day: number;
  balance_previous_day: number;
}[]> => {
  const sql = `
    SELECT 
      s.store_id,
      s.store_name_ar,
      s.full_address,
      s.status,
      s.min_order_price,
      s.logo_image_url,
      sr.rating_previous_day,
     get_store_wallet_balance(s.store_id) AS wallet_balance
    FROM stores s
    LEFT JOIN store_wallets sw ON s.internal_id = sw.internal_store_id
    LEFT JOIN store_ratings_previous_day sr ON s.internal_id = sr.store_internal_id
    WHERE s.partner_id = $1
  `;

  const { rows } = await dashboardQuery(sql, [1]);

  return rows;
}
,
//---------------------------------------------------------------------------------------
getStatistics: async (
  storeId: string[] | number,
  includeStoreCount: boolean,
    fromDate: Date,
  toDate: Date
): Promise<{
  orders: number;
  sales_with_commission: number;
  sales_without_commission: number;
  platform_commission_sales: number;
  visit_count: number;
}> => {
  console.log(storeId, 'storeid');

  const idsArray = Array.isArray(storeId) ? storeId : [storeId];
  const placeholders = idsArray.map((_, i) => `$${i + 1}`).join(', ');

  console.log(placeholders + " placeholders", includeStoreCount, idsArray);

  const sql = `
    SELECT 
      sum(total_orders) AS total_orders, 
      sum(total_revenue) AS total_revenue, 
      avg(average_delivery_time) AS avg_delivery_time,
      sum(visit_count) AS visit_count
    FROM statistics_previous_day
    WHERE store_id IN (${placeholders})
  `;

  const { rows } = await ordersQuery(sql, idsArray);
  const row = rows[0] || {};

  return {
    orders: Number(row.total_orders) || 0,
    sales_with_commission: Number(row.total_revenue) || 0,
    sales_without_commission: 0, // تحتاج تحسبها إذا كان عندك منطق لها
    platform_commission_sales: 0, // كذلك
    visit_count: Number(row.visit_count) || 0
  };
},
//---------------------------------------------------------------------------------------

bestSeller: async (
  storeIds: number[] | number,
  fromDate: Date,
  toDate: Date
): Promise<Array<{
  product_name: string;
  product_id: number;
  size_name: string;
  times_sold: number;
  total_revenue: number;
}>> => {
  console.log(fromDate)
  const idsArray = Array.isArray(storeIds) ? storeIds : [storeIds];
  const placeholders = idsArray.map((_, i) => `$${i + 1}`).join(', ');

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
   partner_name:string,
    phone_number:number,
    company_name_ar:string,
    company_name_en:string,
    bank_name:string,
    iban:string,
    status:string,
    email:string}> => {
    const {rows}= await dashboardQuery(
      'SELECT  partner_name,phone_number,company_name_ar,company_name_en,bank_name,iban,status,email FROM partners WHERE partner_id = $1',
      [partner_id]
    );
    return rows[0];
},
//---------------------------------------------------------------------------------------
getStoreByIdAndPartner: async (storeId: number, partnerId: number) => {
  const { rows } = await dashboardQuery(
    'SELECT store_id FROM stores WHERE store_id = $1 AND partner_id = $2',
    [storeId, partnerId]
  );
  return rows[0];
},
//---------------------------------------------------------------------------------------

updateStoreState: async (storeId: number, newState: string) => {
  return await dashboardQuery(
    'UPDATE stores SET status = $1 WHERE store_id = $2',
    [newState, storeId]
  );
},

//---------------------------------------------------------------------------------------
getStoreProfile: async (
  storeId: number,
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
    FROM stores s
    JOIN store_categories  sc ON sc.category_id = c.category_id
    JOIN store_tags st ON s.store_id = st.store_id and st.tag_id=st.tag_id
    JOIN tags t ON t.tag_id = st.tag_id
    WHERE s.store_id = $1 AND s.partner_id = $2
  `;

  const { rows } = await dashboardQuery(sql, [storeId,partnerId]);

  if (rows.length === 0) {
    throw new Error('المتجر غير موجود أو لا يتبع هذا الشريك');
  }

  return rows[0];
}
//-----------------------------------------------------------------------------------------------
}
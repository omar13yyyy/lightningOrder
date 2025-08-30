import dayjs from "dayjs";
import { query } from "../../../../../modules/database/commitDashboardSQL";
import { generateNeighbors } from "../../../../../modules/geo/geohash";
import {
  CategoryRepo,
  CouponDetailsRepo,
  LanguageRepo,
  NearStoresByCategoryRepo,
  NearStoresBytagRepo,
  NearStoresByTagReq,
  NearStoresRepo,
  NearStoresReq,
  ProductSoldRepo,
  SearchForStoreRepo,
  StoreDistance,
  StoreIdRepo,
  StoreRepo,
  StoreTransactionRepo,
  TagRepo,
} from "../../types/stores";import { off } from 'process';
export const storesRepository = {
  //---------------------------------------------------------------------------------------
  fetchStoreIdPasswordByUserName: async (
    userName: string
  ): Promise<{ store_id: string; encrypted_password: string }[]> => {
    const { rows } = await query(
      "SELECT store_id, encrypted_password,store_name_ar,store_name_en FROM stores WHERE user_name = $1",
      [userName]
    );
    return rows;
  },
//----------------------------------------------------------------------------------------
    updateProductDataByStoreId: async (ln,storeId: string, newProductData: any) => {
          if (ln == "ar") {
console.log({newProductData}+'new')
    await query(
      `UPDATE products SET product_data_ar_jsonb = $1 WHERE store_id = $2`,
      [newProductData, storeId]
    );}
    else if (ln == "en") {
         await query(
      `UPDATE products SET product_data_en_jsonb = $1 WHERE store_id = $2`,
      [newProductData, storeId]
    );}
  },





//----------------------------------------------------------------------------------------------
getCouponsCountstore: async (
  storeIds:number|number[],
) => {
    const idsArray = Array.isArray(storeIds) ? storeIds : [storeIds];

  const placeholders = idsArray.map((_, i) => `$${i + 1}`).join(", ");

  const { rows } = await query(
    `SELECT COUNT(*) AS total FROM  coupons where internal_store_id IN (${placeholders})`,
    [...idsArray]
  );
  return parseInt(rows[0].total);
},

  //-------------------------------------------------------------------------------------------
getCoupons: async (
  storeIds: number | number[],
  limit: number,
  offset: number
): Promise<
  Array<{
    code: string;
    description: string;
    discount_value_percentage: number;
    on_expense: string;
    min_order_value: number;
    expiration_date: Date;
    max_usage: number;
    real_usage: number;
    coupon_type: string;
    store_name: string;
  }>
> => {
  const idsArray = Array.isArray(storeIds) ? storeIds : [storeIds];

  const placeholders = idsArray.map((_, i) => `$${i + 1}`).join(", ");

  const limitIndex = idsArray.length + 1;
  const offsetIndex = idsArray.length + 2;

  const sql = `
    SELECT code, description, discount_value_percentage, on_expense,
           min_order_value, expiration_date, max_usage, real_usage,
           coupon_type
    FROM coupons
    WHERE internal_store_id IN (${placeholders})
    LIMIT $${limitIndex} OFFSET $${offsetIndex}
  `;

  const values = [...idsArray, limit, offset];

  const { rows } = await query(sql, values);
  return rows;
},

  //----------------------------------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------------------------------
    fetchStoreProductstore: async (param:StoreRepo) => {
      //TODO make server return url with ip
      const { rows, rowCount } = await query(
        `select product_data_${param.ln}_jsonb as products from products where store_id = $1 LIMIT 1 `,
        [param.storeId]
      );
      if (rowCount > 0) {
        return rows[0];
      }
       else return {};
   
  },
  //---------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------------
  fetchCategoryTags: async (tag: TagRepo) => {
    //TODO after login or first reques save token in redis
    const { rows } = await query(
      `select tag_id,tag_name_${tag.ln} as tag_name from tags where category_id=$1 `,
      [tag.categoryId]
    );
    return rows;
  },
  fetchStoreCategories: async (language: LanguageRepo) => {
    //TODO after login or first reques save token in redis

    const { rows } = await query(
      `select category_id,category_name_${language.ln} as category_name,category_image from store_categories `,
      []
    );
    return rows;
  },
  fetchStoreProduct: async (param: StoreRepo) => {
    //TODO make server return url with ip
    const { rows, rowCount } = await query(
      `select product_data_${param.ln}_jsonb as products from products where store_id = $1 LIMIT 1 `,
      [param.storeId]
    );
    if (rowCount > 0) {
      return rows[0];
    } else return {};
  },
  
  fetchCouponStore: async (coupon: CouponDetailsRepo) => {
    //TODO : check order coupon if end
    //TODO : get round from setting
    const { rows, rowCount } = await query(
      `select discount_value_percentage as discount_percentage,delivery_discount_percentage as delivery_discount,min_order_value from coupons where code =$1 AND store_id = $2 AND expiration_date > now() AND
         real_usage IS NULL OR max_usage IS NULL OR real_usage < max_usage `,
      [coupon.couponCode, coupon.storeId]
    );
    if (rowCount > 0) {
      return rows[0];
    }
  },
  fetchWorkingHours: async (param: StoreIdRepo) => {
    //TODO after login or first reques save token in redis

    const { rows } = await query(
      `SELECT 
  json_object_agg(day_of_week, shifts) AS working_time
FROM (
  SELECT 
    day_of_week,
    json_agg(
      json_build_object(
        'opening_time', opening_time,
        'closing_time', closing_time
      )
    ) AS shifts
  FROM working_hours where store_id =$1
  GROUP BY day_of_week
) AS grouped;`,
      [param.storeId]
    );

    return rows[0];
  },
  //-------------------------------------------------------
  getNearStores: async (param: NearStoresRepo) => {
    const precision = 20;
    const locationCodeLength = 7; //عدد الاسطر
    const neighbors = generateNeighbors(param.locationCode);
    let sql = getStoreSql(param.ln, "", "", "", "", "");

    const { rows } = await query(sql, [
      neighbors,
      param.latitudes,
      param.logitudes,
      param.distanceKm,
      param.limit,
      param.offset,
      locationCodeLength,
    ]);

    return rows;
  },
  // ------------------------------------------------------------------
  getNearStoresbyCategory: async (param: NearStoresByCategoryRepo) => {
    const locationCodeLength = 7; //عدد الاسطر

    const precision = 20;
    const neighbors = generateNeighbors(param.locationCode);
    let sql = getStoreSql(
      param.ln,
      " AND swd.category_id =$8",
      "",
      "",
      "",
      ""
    );
    const { rows } = await query(sql, [
      neighbors,
      param.latitudes,
      param.logitudes,
      param.distanceKm,
      param.limit,
      param.offset,
      locationCodeLength,
      param.categoryId,
    ]);
    return rows;
  },
  getNearStoresbyTag: async (param: NearStoresBytagRepo) => {
    const locationCodeLength = 7; //عدد الاسطر

    const precision = 20;
    const neighbors = generateNeighbors(param.locationCode);
    const sql = getStoreSql(
      param.ln,
      " AND st.tag_id =$8",
      "",
      "",
      "",
      ""
    );

    const { rows } = await query(sql, [
      neighbors,
      param.latitudes,
      param.logitudes,
      param.distanceKm,
      param.limit,
      param.offset,
      locationCodeLength,
      param.tagId,
    ]);
    return rows;
  },
  //-------------------------------------------------------------
  getNearTrendStores: async (param: NearStoresRepo) => {
    const precision = 20;
    const locationCodeLength = 7; //عدد الاسطر
    const neighbors = generateNeighbors(param.locationCode);
    let sql = getStoreSql(
      param.ln,
      "",
      "JOIN trends tr ON s.internal_id = tr.internal_store_id",
      "",
      "",
      ""
    );

    const { rows } = await query(sql, [
      neighbors,
      param.latitudes,
      param.logitudes,
      param.distanceKm,
      param.limit,
      param.offset,
      locationCodeLength,
    ]);

    return rows;
  },
  // ------------------------------------------------------------------
  getNearTrendStoresbyCategory: async (param: NearStoresByCategoryRepo) => {
    const locationCodeLength = 7; //عدد الاسطر

    const precision = 20;
    const neighbors = generateNeighbors(param.locationCode);
    let sql = getStoreSql(
      param.ln,
      " AND swd.category_id =$8",
      "JOIN trends tr ON s.internal_id = tr.internal_store_id",
      "",
      "",
      ""
    );
    const { rows } = await query(sql, [
      neighbors,
      param.latitudes,
      param.logitudes,
      param.distanceKm,
      param.limit,
      param.offset,
      locationCodeLength,
      param.categoryId,
    ]);
    return rows;
  },
  getNearTrendStoresbyTag: async (param: NearStoresBytagRepo) => {
    const locationCodeLength = 7; 

    const precision = 20;
    const neighbors = generateNeighbors(param.locationCode);
    const sql = getStoreSql(
      param.ln,
      " AND st.tag_id =$8",
      "JOIN trends tr ON s.internal_id = tr.internal_store_id",
      "",
      "",
      ""
    );

    const { rows } = await query(sql, [
      neighbors,
      param.latitudes,
      param.logitudes,
      param.distanceKm,
      param.limit,
      param.offset,
      locationCodeLength,
      param.tagId,
    ]);
    return rows;
  },
  SearchForStore: async (param: SearchForStoreRepo) => {
    const locationCodeLength = 7; //عدد الاسطر

    const precision = 20;
    const neighbors = generateNeighbors(param.locationCode);
    const sql = searchForStoreSql(param.ln, "", "", "", "", "");

    const { rows } = await query(sql, [
      neighbors,
      param.latitudes,
      param.logitudes,
      param.distanceKm,
      param.limit,
      param.offset,
      locationCodeLength,
      param.storeName,
    ]);
    return rows;
  },
  async getOrderItems(param: StoreIdRepo) {
    const { rows } = await query(
      "SELECT product_data_ar_jsonb as ar, product_data_en_jsonb as en  FROM public.products where store_id = $1 LIMIT 1",
      [param.storeId]
    );
    return rows[0];
  },
  async isOpenNow(param: StoreIdRepo) {
    const dayOfWeek = dayjs().format("ddd")
    const currentTime = dayjs().format("HH:mm:ss");

    const { rows ,rowCount} = await query(
      `SELECT 1 FROM working_hours where store_id =$1 AND day_of_week = $2 AND $3::time BETWEEN opening_time AND closing_time`,
      [param.storeId, dayOfWeek, currentTime]
    );
    return rowCount;
  },

  async storeDistance(param: StoreDistance) {


    const { rows } = await query(
      `SELECT haversine_distance_km(
      $1,              -- user_lat
      $2,              -- user_lng
      s.latitude::double precision,
      s.longitude::double precision
    ) AS distance_km FROM stores s where store_id = $3
     `,[param.latitudes, param.logitudes, param.storeId]
    );
    return rows[0];
  },

  async getstoreStatus(param: StoreIdRepo) {


    const { rows } = await query(
      `SELECT status FROM stores where store_id = $1 limit 1
     `,[param.storeId]
    );
    return rows[0].status;
  },
    async getstoreDetails(param: StoreIdRepo) {


    const { rows } = await query(
      `SELECT partner_id preparation_time,longitude,Latitude,full_address,phone_number,store_name_en,store_name_ar,platform_commission ,internal_id ,location_code FROM stores where store_id = $1 limit 1
     `,[param.storeId]
    );
    return rows[0];
  },
 insertProductSold : async (
  product: ProductSoldRepo
) => {
  const res = await query(
    `INSERT INTO products_sold (
      product_sold_id,
      order_id,
      customer_id,
      store_internal_id,
      product_name_en,
      product_name_ar,
      internal_store_id,
      product_internal_id,
      product_id,
      size_name_en,
      size_name_ar,
      price,
      full_price,
      coupon_code,
      create_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11,
      $12, $13, $14, now()
    )
    RETURNING product_sold_id`,
    [
      product.product_sold_id,
      product.order_id,
      product.customer_id,
      product.store_internal_id,
      product.product_name_en,
      product.product_name_ar,
      product.internal_store_id,
      product.product_internal_id,
      product.product_id,
      product.size_name_en,
      product.size_name_ar,
      product.price,
      product.full_price,
      product.coupon_code,
    ]
  )

},
insertStoreTransaction : async (tx: StoreTransactionRepo)=> {

  await query(`
    INSERT INTO store_transactions (
      transaction_id,
      partner_id,
      store_id,
      internal_store_id,
      transaction_type,
      amount,
      amount_platform_commission,
      transaction_at,
      notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, now(), $8)
  `,[
    tx.transaction_id,
    tx.partner_id,
    tx.store_id,
    tx.internal_store_id,
    tx.transaction_type,
    tx.amount,
    tx.amount_platform_commission,
    tx.notes ?? null
  ]);
},


};


function getStoreSql(ln, and, join, SWCAnd, searchParamScore, searchParamOrder) {
     const dayOfWeek = dayjs().format("ddd")
    const currentTime = dayjs().format("HH:mm:ss");
  let sql = `
  WITH nearby_codes AS (
  SELECT unnest($1::text[]) AS prefix
),
  stores_with_distance AS (
  SELECT 
    s.preparation_time,
    s.store_id,
    s.internal_id,
    s.store_name_en,
    s.store_name_ar,
    s.store_name_ar_clean,
    s.status,
    s.min_order_price,
    s.logo_image_url,
    s.cover_image_url,
    s.orders_type,
    s.category_id,
    haversine_distance_km(
      $2,              -- user_lat
      $3,              -- user_lng
      s.latitude::double precision,
      s.longitude::double precision
    ) AS distance_km
  FROM stores s 
  JOIN nearby_codes nc ON LEFT(s.location_code, $7) = LEFT(nc.prefix, $7)
  JOIN working_hours wh ON wh.internal_store_id = s.internal_id
  ${join}
  WHERE 
   s.status = 'open' 
    AND wh.day_of_week = '${dayOfWeek}'
    AND '${currentTime}' BETWEEN wh.opening_time AND wh.closing_time    ${SWCAnd}

) 
SELECT 
  sr.rating_previous_day,
  sr.number_of_raters,
  swd.store_id,
  swd.distance_km ,
 swd.store_name_${ln} as title,swd.status,swd.min_order_price,swd.logo_image_url,swd.cover_image_url,swd.orders_type,swd.preparation_time,
 cop.discount_value_percentage,cop.delivery_discount_percentage,cop.code,cop.min_order_value as coupon_min_order_value,
  COALESCE(
  ARRAY_AGG(DISTINCT t.tag_name_${ln}) FILTER (WHERE t.tag_name_${ln} IS NOT NULL),
  ARRAY[]::text[]
) AS tags
FROM stores_with_distance swd
LEFT JOIN store_ratings_previous_day sr ON sr.store_internal_id = swd.internal_id
LEFT JOIN store_tags st ON st.internal_store_id = swd.internal_id
LEFT JOIN tags t ON t.internal_id = st.internal_tag_id 
LEFT JOIN coupons cop ON cop.internal_store_id = swd.internal_id 
WHERE (
  ( swd.distance_km <= $4 AND expiration_date > now() AND real_usage IS NULL)
  OR max_usage IS NULL
  OR (real_usage < max_usage AND coupon_type = 'public')
) ${and}
GROUP BY ${searchParamOrder} swd.store_id,swd.distance_km,swd.internal_id,store_name_${ln},swd.status,swd.min_order_price,swd.logo_image_url,
cop.discount_value_percentage,cop.delivery_discount_percentage,cop.code, cop.min_order_value  ,
swd.cover_image_url,swd.orders_type,swd.preparation_time,sr.number_of_raters,sr.rating_previous_day 
ORDER BY  ${searchParamOrder} swd.store_id, swd.distance_km 
LIMIT $5
OFFSET $6
 `;
  if (ln == "ar" || ln == "en") return sql;
  else return "";
}
function searchForStoreSql(
  ln,
  and,
  join,
  where,
  searchParamScore,
  searchParamOrder
) {
  const sql = `
WITH nearby_codes AS (
  SELECT unnest($1::text[]) AS prefix
),
stores_with_distance AS (
  SELECT 
    s.preparation_time,
    s.store_id,
    s.internal_id,
    s.store_name_en,
    s.store_name_ar,
    s.store_name_ar_clean,
    s.status,
    s.min_order_price,
    s.logo_image_url,
    s.cover_image_url,
    s.orders_type,
    s.category_id,
    haversine_distance_km(
      $2,              -- user_lat
      $3,              -- user_lng
      s.latitude::double precision,
      s.longitude::double precision
    ) AS distance_km
  FROM stores s 
  JOIN nearby_codes nc ON LEFT(s.location_code, $7) = LEFT(nc.prefix, $7)
),
fuzzy_filtered AS (
  SELECT  
     swd.preparation_time,
    swd.store_id,
    swd.internal_id,
    swd.store_name_en,
    swd.store_name_ar,
    swd.store_name_ar_clean,
    swd.status,
    swd.min_order_price,
    swd.logo_image_url,
    swd.cover_image_url,
    swd.orders_type,
    swd.category_id,
    swd.distance_km

  FROM stores_with_distance swd
  WHERE 
    swd.store_name_ar_clean % normalize_arabic($8) OR
    swd.store_name_en % $8
)
SELECT 
  sr.rating_previous_day,
  sr.number_of_raters,
  swd.store_id,
  swd.distance_km,
  swd.store_name_${ln} AS title,
  swd.status,
  swd.min_order_price,
  swd.logo_image_url,
  swd.cover_image_url,
  swd.orders_type,
  swd.preparation_time,
  cop.discount_value_percentage,
  cop.delivery_discount_percentage,
  cop.code,
  cop.min_order_value AS coupon_min_order_value,
  COALESCE(
    ARRAY_AGG(DISTINCT t.tag_name_${ln}) FILTER (WHERE t.tag_name_${ln} IS NOT NULL),
    ARRAY[]::text[]
  ) AS tags
FROM fuzzy_filtered swd
LEFT JOIN store_ratings_previous_day sr ON sr.store_internal_id = swd.internal_id
LEFT JOIN store_tags st ON st.internal_store_id = swd.internal_id
LEFT JOIN tags t ON t.internal_id = st.internal_tag_id 
LEFT JOIN coupons cop ON cop.internal_store_id = swd.internal_id 
WHERE (
  (swd.distance_km <= $4 AND expiration_date > now() AND real_usage IS NULL)
  OR max_usage IS NULL
  OR (real_usage < max_usage AND coupon_type = 'public')
)
GROUP BY  swd.store_id,swd.distance_km,swd.internal_id,store_name_${ln},swd.status,
swd.min_order_price,swd.logo_image_url,cop.discount_value_percentage,
cop.delivery_discount_percentage,cop.code, cop.min_order_value,
swd.cover_image_url,swd.orders_type,swd.preparation_time,sr.number_of_raters,sr.rating_previous_day 
ORDER BY  swd.store_id, swd.distance_km 
LIMIT $5
OFFSET $6;
`;
  if (ln == "ar" || ln == "en") return sql;
  else return "";
}
//-------------------------------------------------

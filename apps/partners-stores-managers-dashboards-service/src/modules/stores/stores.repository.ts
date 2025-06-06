import { query } from "../../../../../modules/database/commitDashboardSQL";
import { generateNeighbors } from "../../../../../modules/geo/geohash";
import { CategoryRepo, CouponDetailsRepo, LanguageRepo, NearStoresByCategoryRepo, NearStoresBytagRepo, NearStoresByTagReq, NearStoresRepo, NearStoresReq, SearchForStoreRepo, StoreIdRepo, StoreRepo, TagRepo } from "../../types/stores";

export const storesRepository = {

  fetchCategoryTags: async (tag :TagRepo) => {
    //TODO after login or first reques save token in redis
      const { rows } = await query(
        "select tag_id,tag_name_${$1} as tag_name from tags where category_id=$2 ",
        [tag.ln,tag.categoryId]
      );
      return rows;

  },
  fetchStoreCategories: async (language :LanguageRepo) => {
    //TODO after login or first reques save token in redis

      const { rows } = await query(
        "select category_id,category_name_${$1} as category_name,category_image from store_categories ",
        [language.ln]
      );
      return rows;
    }
  ,
  fetchStoreProduct: async (param:StoreRepo) => {
      //TODO make server return url with ip
      const { rows, rowCount } = await query(
        "select product_data_${$1}_jsonb as products from products where store_id = $2 ",
        [param.ln,param.storeId]
      );
      if (rowCount > 0) {
        return rows[0];
      } else return {};
   
  },
  fetchCouponStore: async (coupon : CouponDetailsRepo) => {
    //TODO : check order coupon if end
    //TODO : get round from setting
    const { rows, rowCount } = await query(
      `select discount_value_percentage as discount_percentage,min_order_value from coupons where code =$1 AND store_id = $2 AND expiration_date > now() AND
         real_usage IS NULL OR max_usage IS NULL OR real_usage < max_usage `,
      [coupon.couponCode, coupon.storeId]
    );
    if (rowCount > 0) {
      return rows[0];
    }
  },
  fetchWorkingHours: async (param :StoreIdRepo) => {
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
  getNearStores: async (
   param: NearStoresRepo
  ) => {
    const precision = 20;
    const locationCodeLength = 14; //عدد الاسطر
    const neighbors = generateNeighbors(param.locationCode);
    let sql = getStoreSql(param.ln, "",'','','','');

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
  getNearStoresbyCategory: async (
   param: NearStoresByCategoryRepo
  ) => {
    const locationCodeLength = 14; //عدد الاسطر

    const precision = 20;
    const neighbors = generateNeighbors(param.locationCode);
    let sql = getStoreSql(param.ln, " AND swd.category_id =$8",'','','','');
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
  getNearStoresbyTag: async (
    param :NearStoresBytagRepo
  ) => {
    const locationCodeLength = 14; //عدد الاسطر

    const precision = 20;
    const neighbors = generateNeighbors(param.locationCode);
    const sql = getStoreSql(param.ln, " AND st.tag_id =$8",'','','','');

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
  getNearTrendStores: async (
    param:NearStoresRepo
  ) => {
    const precision = 20;
    const locationCodeLength = 14; //عدد الاسطر
    const neighbors = generateNeighbors(param.locationCode);
    let sql = getStoreSql(param.ln, "",
      'JOIN trends tr ON s.internal_id = tr.internal_store_id','','','');

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
  getNearTrendStoresbyCategory: async (
    param :NearStoresByCategoryRepo
  ) => {
    const locationCodeLength = 14; //عدد الاسطر

    const precision = 20;
    const neighbors = generateNeighbors(param.locationCode);
    let sql = getStoreSql(param.ln, " AND swd.category_id =$8",
      'JOIN trends tr ON s.internal_id = tr.internal_store_id','','','');
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
  getNearTrendStoresbyTag: async (
    param:NearStoresBytagRepo
  ) => {
    const locationCodeLength = 14; //عدد الاسطر

    const precision = 20;
    const neighbors = generateNeighbors(param.locationCode);
    const sql = getStoreSql(param.ln, " AND st.tag_id =$8",
      'JOIN trends tr ON s.internal_id = tr.internal_store_id','','','');

    const { rows } = await query(sql, [
      neighbors,
      param.latitudes,
      param.logitudes,
      param.distanceKm,
      param.limit,
     param. offset,
      locationCodeLength,
      param.tagId,
    ]);
    return rows;
  },
  SearchForStore: async (
    param :SearchForStoreRepo
  ) => {
    const locationCodeLength = 14; //عدد الاسطر

    const precision = 20;
    const neighbors = generateNeighbors(param.locationCode);
    const sql = getStoreSql(param.ln,'','',
       " WHERE  s.store_name_ar % $8 OR s.store_name_en % $8 ",
      "similarity(s.store_name_ar, $8) as score1,similarity(s.store_name_en, $8) as score2,",
      'swd.score1,swd.score2,');

    const { rows } = await query(sql, [
      neighbors,
      param.latitudes,
      param.locationCode,
      param.distanceKm,
      param.limit,
      param.offset,
      locationCodeLength,
      param.storeName,
    ]);
    return rows;
  },

};



function getStoreSql(ln, and,join,where,searchParamScore,searchParamOrder) {
  let sql = `
WITH nearby_codes AS (
  SELECT unnest($1::text[]) AS prefix
),
stores_with_distance AS (
  SELECT 
     s.preparation_time,s.store_id, s.internal_id,s.store_name_${ln},s.status,${searchParamScore}
    s.min_order_price,s.logo_image_url,s.cover_image_url,s.orders_type,s.category_id,
    haversine_distance_km(
      $2,              -- user_lat
      $3,              -- user_lng
      s.latitude::double precision,
      s.longitude::double precision
    ) AS distance_km
  FROM stores s 
  JOIN nearby_codes nc ON LEFT(s.location_code, $7) = LEFT(nc.prefix, $7)
  ${join} ${where}
)
SELECT 
  sr.rating_previous_day,
  sr.number_of_raters,
  swd.store_id,
  swd.distance_km ,
 swd.store_name_${ln} as title,swd.status,swd.min_order_price,swd.logo_image_url,swd.cover_image_url,swd.orders_type,swd.preparation_time,
  ARRAY_AGG(t.tag_name_${ln}) AS tags
FROM stores_with_distance swd
JOIN store_ratings_previous_day sr ON sr.store_internal_id = swd.internal_id
LEFT JOIN store_tags st ON st.internal_store_id = swd.internal_id
LEFT JOIN tags t ON t.internal_id = st.internal_tag_id 
WHERE swd.distance_km <= $4 ${and}
GROUP BY ${searchParamOrder} swd.store_id,swd.distance_km,swd.internal_id,store_name_${ln},swd.status,swd.min_order_price,swd.logo_image_url,
swd.cover_image_url,swd.orders_type,swd.preparation_time,sr.number_of_raters,sr.rating_previous_day 
ORDER BY ${searchParamOrder} swd.distance_km
LIMIT $5
OFFSET $6;
 `;
  return sql;
}

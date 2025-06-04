import { resolveSoa } from "dns";
import { query } from "../../../../../modules/database/commitCustomerSQL";
import { generateNeighbors, generateNeighborsByDistance } from "../../../../../modules/geo/geohash";

export const userRepository = {
  fetchCustomerTokenById: async (userId) => {
    //todo if not exist in redis search in database dont forget logout
    const { rows } = (
      await query(
        "select token from effective_tokens where user_id = $1 LIMIT 1",
        [userId]
      )
    )[0].token;

    return rows[0].token;
  },
  //------------------------------------------------------------

  fetchCustomerIdPasswordByNumber: async (phoneNumber) => {
    const { rows } = await query(
      "select customer_id,encrypted_password from customers where phone_number = $1 LIMIT 1",
      [phoneNumber]
    );
    return rows[0];
  },
  //------------------------------------------------------------

  updateEffectiveToken: async (token, userId) => {
    //TODO after login or first reques save token in redis

    await query("UPDATE effective_tokens SET token =$1 where user_id =$2 ", [
      token,
      userId,
    ]);
  },
  //------------------------------------------------------------

  isCustomerNumberUsed: async (phoneNumber) => {
    const { rowCount } = await query(
      "SELECT 1 from customers where phone_number = $1 LIMIT 1",
      [phoneNumber]
    );
    return rowCount > 0;
  },
  //------------------------------------------------------------

  insertCustomer: async (
    fullName,
    phoneNumber,
    email,
    encryptedPassword,
    birthDate,
    address
  ) => {
    //TODO trager To add effective_tokens record

    return await query(
      "INSERT INTO customers (full_name,phone_number,email,encrypted_password,is_confirmed,birth_date,address) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING customer_id",
      [
        fullName,
        phoneNumber,
        email,
        encryptedPassword,
        true,
        birthDate,
        address,
      ]
    );
  },
  //------------------------------------------------------------

  insertConfirmationCode: async (phoneNumber, code) => {
    //TODO trager To add effective_tokens record
    await query(
      `INSERT INTO confirmation (phone_number, code, create_at) VALUES ($1,$2,NOW())ON CONFLICT (phone_number) DO UPDATE SET   code =$2,create_at= NOW()`,
      [phoneNumber, code]
    );
  },
  //------------------------------------------------------------

  isValidCode: async (phoneNumber, code) => {
    //TODO trager To add effective_tokens record

    const { rowCount } = await query(
      "select code from confirmation where phone_number = $1 AND code =$2 ",
      [phoneNumber, code]
    );
    return rowCount > 0;
  },
  //------------------------------------------------------------

  deleteCode: async (phoneNumber) => {
    //TODO trager To add effective_tokens record

    await query("delete from confirmation where phone_number = $1  ", [
      phoneNumber,
    ]);
  },
  //------------------------------------------------------------

  updateCustomerPassword: async (phoneNumber, newPassword) => {
    //TODO after login or first reques save token in redis

    await query(
      "UPDATE customers SET encrypted_password =$1 where phone_number =$2 ",
      [newPassword, phoneNumber]
    );
  },

  //------------------------------------------------------------

  getCustomerProfile: async (customer_id) => {
    const { rows } = await query(
      ` 
      
SELECT full_name,phone_number,email,birth_date,address From customers where 
            customer_id = $1

    `,
      [customer_id]
    );

    return rows[0];
  },

  //------------------------------------------------------------
  logout: async (customer_id) => {
    const { rows } = await query(
      ` 
      
        DELETE from effective_tokens where user_id = $1

    `,
      [customer_id]
    );
  },
  //------------------------------------------------------------

  getCustomerWallet: async (customer_id) => {
    const { rows } = await query(
      ` 
      
        get_customer_wallet_balance($1); 

    `,
      [customer_id]
    );
    return rows[0];
  },
  getNearStores: async (customerLat, customerLng,limit,offset) => {
    const precision = 20;
    const distanceKm = 16;
    const neighbors = generateNeighborsByDistance(
      customerLat,
      customerLng,
      precision,
      distanceKm,
      24
    );
    const sql = `
    WITH nearby_codes AS (
  SELECT unnest($1::text[]) AS prefix
)
SELECT *
FROM stores s
JOIN nearby_codes nc ON LEFT(s.location_code, 16) = LEFT(nc.prefix, 16)
WHERE haversine_distance_km(
    $2,              -- lat of user
    $3,              -- lng of user
    s.latitude::double precision,
    s.longitude::double precision
  ) <= $4            -- max distance in km
ORDER BY s.internal_id
LIMIT $5             -- عدد النتائج المراد إرجاعها
OFFSET $6; `;

    const { rows } = await query(sql, [
      neighbors,
      customerLat,
      customerLng,
      distanceKm,
      limit,
      offset,
    ]);
    return rows[0];
  },
    getNearStoresbyCategory: async (customerLat, customerLng,categoryId,limit,offset) => {
    const precision = 20;
    const distanceKm = 16;
    const neighbors = generateNeighborsByDistance(
      customerLat,
      customerLng,
      precision,
      distanceKm,
      24
    );
    const sql = `
    WITH nearby_codes AS (
  SELECT unnest($1::text[]) AS prefix
)
SELECT *
FROM stores s
JOIN nearby_codes nc ON LEFT(s.location_code, 16) = LEFT(nc.prefix, 16)
WHERE haversine_distance_km(
    $2,              -- lat of user
    $3,              -- lng of user
    s.latitude::double precision,
    s.longitude::double precision
  ) <= $4 
   AND s.category_id =$7           -- max distance in km
ORDER BY s.internal_id
LIMIT $5             -- عدد النتائج المراد إرجاعها
OFFSET $6; `;

    const { rows } = await query(sql, [
      neighbors,
      customerLat,
      customerLng,
      distanceKm,
      limit,
      offset,
      categoryId,
    ]);
    return rows[0];
  },
      getNearStoresbyTag: async (location_code,customerLat, customerLng,tagId,limit,offset) => {
    const precision = 20;
    const distanceKm = 16;
    const neighbors = generateNeighbors(
      location_code
    );
    const sql = `
    WITH nearby_codes AS (
  SELECT unnest($1::text[]) AS prefix
)
SELECT *
FROM stores s
JOIN nearby_codes nc ON LEFT(s.location_code, 16) = LEFT(nc.prefix, 16)
JOIN store_tags t ON t.internal_store_id = s.internal_id
WHERE haversine_distance_km(
    $2,              -- lat of user
    $3,              -- lng of user
    s.latitude::double precision,
    s.longitude::double precision
  ) <= $4 
   AND  t.tag_id = $7          -- max distance in km
ORDER BY s.internal_id
LIMIT $5             -- عدد النتائج المراد إرجاعها
OFFSET $6; `;

    const { rows } = await query(sql, [
      neighbors,
      customerLat,
      customerLng,
      distanceKm,
      limit,
      offset,
      tagId,
    ]);
    return rows[0];
  },
};

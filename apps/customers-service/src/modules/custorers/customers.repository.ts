import { resolveSoa } from "dns";
import { query } from "../../../../../modules/database/commitCustomerSQL";
import {
  generateNeighbors,
  generateNeighborsByDistance,
} from "../../../../../modules/geo/geohash";
import {
  CustomerServeceParams,
  PhoneOnlyRepoParams,
  updateEffectiveTokenRepoParams,
  insertCustomerRepoParams,
  CodeValidationRepoParams,
  ResetPasswordRepoParams,
} from "../../../types/customers";

export const userRepository = {
  fetchCustomerTokenById: async (params: CustomerServeceParams) => {
    //todo if not exist in redis search in database dont forget logout
    const { rows } = await query(
      "select token from effective_tokens where user_id = $1 LIMIT 1",
      [params.customerId]
    );
    if (rows.length > 0) return rows[0].token;
    else return null;
  },
  //------------------------------------------------------------

  fetchCustomerIdPasswordByNumber: async (params: PhoneOnlyRepoParams) => {
    const { rows } = await query(
      "select customer_id,encrypted_password from customers where phone_number = $1 LIMIT 1",
      [params.phoneNumber]
    );
    return rows[0];
  },
  //------------------------------------------------------------

  updateEffectiveToken: async (params: updateEffectiveTokenRepoParams) => {
    //TODO after login or first reques save token in redis

    await query(`INSERT INTO effective_tokens (user_id, token)
VALUES ($2, $1)
ON CONFLICT (user_id) DO UPDATE SET token = EXCLUDED.token;`, [
      params.token,
      params.customerId,
    ]);
  },
  //------------------------------------------------------------

  isCustomerNumberUsed: async (params: PhoneOnlyRepoParams) => {
    const { rowCount } = await query(
      "SELECT 1 from customers where phone_number = $1 LIMIT 1",
      [params.phoneNumber]
    );
    return rowCount > 0;
  },
  //------------------------------------------------------------

  insertCustomer: async (params: insertCustomerRepoParams) => {
    //TODO trager To add effective_tokens record

    return await query(
      "INSERT INTO customers (full_name,phone_number,email,encrypted_password,is_confirmed,birth_date,address) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING customer_id",
      [
        params.fullName,
        params.phoneNumber,
        params.email,
        params.encryptedPassword,
        true,
        params.birthDate,
        params.address,
      ]
    );
  },
  //------------------------------------------------------------

  insertConfirmationCode: async (params: CodeValidationRepoParams) => {
    //TODO trager To add effective_tokens record
    await query(
      `INSERT INTO confirmation (phone_number, code, create_at) VALUES ($1,$2,NOW())ON CONFLICT (phone_number) DO UPDATE SET   code =$2,create_at= NOW()`,
      [params.phoneNumber, params.code]
    );
  },
  //------------------------------------------------------------

  isValidCode: async (params: CodeValidationRepoParams) => {
    //TODO trager To add effective_tokens record

    const { rowCount } = await query(
      "select code from confirmation where phone_number = $1 AND code =$2 ",
      [params.phoneNumber, params.code]
    );
    return rowCount > 0;
  },
  //------------------------------------------------------------

  deleteCode: async (params: PhoneOnlyRepoParams) => {
    //TODO trager To add effective_tokens record

    await query("delete from confirmation where phone_number = $1  ", [
      params.phoneNumber,
    ]);
  },
  //------------------------------------------------------------

  updateCustomerPassword: async (params: ResetPasswordRepoParams) => {
    //TODO after login or first reques save token in redis

    await query(
      "UPDATE customers SET encrypted_password =$1 where phone_number =$2 ",
      [params.newPassword, params.phoneNumber]
    );
  },

  //------------------------------------------------------------

  getCustomerProfile: async (params: CustomerServeceParams) => {
    const { rows } = await query(
      ` 
      
SELECT full_name,phone_number,email,birth_date,address From customers where 
            customer_id = $1

    `,
      [params.customerId]
    );

    return rows[0];
  },

  //------------------------------------------------------------
  logout: async (params: CustomerServeceParams) => {
    const { rows } = await query(
      ` 
      
        DELETE from effective_tokens where user_id = $1

    `,
      [params.customerId]
    );
  },
  //------------------------------------------------------------

  getCustomerWallet: async (params: CustomerServeceParams) => {
    const { rows } = await query(
      ` 
      
       select  get_customer_wallet_balance($1); 

    `,
      [params.customerId]
    );
    console.log(rows)
    return rows[0].get_customer_wallet_balance;
  },
  
};

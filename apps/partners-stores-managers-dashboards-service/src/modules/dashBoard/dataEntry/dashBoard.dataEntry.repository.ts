import { query as dashboardQuery } from "../../../../../../modules/database/commitDashboardSQL";

//---------------------------------------------------------------------------------------
export const dataEntryrepository = {
  //---------------------------------------------------------------------------------------
   fetchIdPasswordByUserName: async (
    userName: string
  ): Promise<{ id: string; password: string }[]> => {
    const { rows } = await dashboardQuery(
      "SELECT id, password,name FROM admins WHERE email = $1",
      [userName]
    );
    return rows;
  },
 
 //----------------------------------------------------------------------------
 
 
 
  getPartners: async (
    pagesize,
    offset
  ): Promise<
    {
      partner_id: number;
      partner_name: string;
      company_name_ar: string;
      company_name_en: string;
      phone_number: string;
      email: string;
      status: string;
    }[]
  > => {
    const { rows } = await dashboardQuery(
      "SELECT partner_id,partner_name, company_name_ar, company_name_en, phone_number,  email, status FROM partners LIMIT $1 OFFSET $2",
      [pagesize, offset]
    );
    return rows;
  },
  //--------------------------------------------------------------------------------------
  getPartnerscounts: async (
) => {
   
  const { rows } = await dashboardQuery(
    `SELECT COUNT(*) AS total FROM  partners`,[] );
  return parseInt(rows[0].total);
},
//----------------------------------------------------------------------------------------
  getPartnerscountsforsearch: async (partnerName
) => {
   
  const { rows } = await dashboardQuery(
    `SELECT COUNT(*) AS total FROM  partners WHERE partner_name ILIKE $1`,[`%${partnerName}%`] );
  return parseInt(rows[0].total);
},
  //---------------------------------------------------------------------------------------
  getPartnersForSearch: async (
    partnerName: string,
    pageSize: number,
    offset: number
  ): Promise<
    {
      partner_id: number;
      partner_name: string;
      company_name_ar: string;
      company_name_en: string;
      phone_number: string;
      email: string;
      status: string;
    }[]
  > => {
    const { rows } = await dashboardQuery(
      `SELECT partner_id, partner_name, company_name_ar, company_name_en,
            phone_number, email, status
     FROM partners
     WHERE partner_name ILIKE $1
     LIMIT $2 OFFSET $3`,
      [`%${partnerName}%`, pageSize, offset]
    );
    return rows;
  },
  //----------------------------------------------------------------------------------------------------------------

  changeParenterState: async (
  partnerId:string,state:string
  ) => {
    const { rows } = await dashboardQuery(
    "UPDATE partners SET status = $1 WHERE partner_id = $2",
      [state, partnerId]
    );
    return rows;
  },
  //----------------------------------------------------------------------------------------------------------------
getPartner: async (
  partnerId: string
): Promise<{
  partner_name: string;
  phone_number: string;
  company_name_ar: string;
  company_name_en: string;
  bank_name: string;
  iban: string;
  status: string;
  email: string;
  wallet_balance: number;
  last_updated_wallet_at: string | null;
  user_name: string;
}> => {
  const { rows } = await dashboardQuery(
    `SELECT partner_name, phone_number, company_name_ar, company_name_en,
            bank_name, iban, status, email, wallet_balance, 
            last_updated_wallet_at, user_name
     FROM partners
     WHERE partner_id = $1`,
    [partnerId]
  );

  if (rows.length === 0) {
    throw new Error("Partner not found");
  }

  return rows[0];
}
,
  //----------------------------------------------------------------------------------------------------------------

    findByUserName: async (userName: string) => {
    const { rows } = await dashboardQuery(
      `SELECT partner_id FROM partners WHERE user_name = $1`,
      [userName]
    );
    return rows[0]; 
  },
//--------------------------------------------------------------------------------------------------------------------
  insertPartner: async (
    partner_name: string,
    phone_number: string,
    company_name_ar: string,
    company_name_en: string,
    bank_name: string,
    iban: string,
    status: string,
    email: string,
    encryptedPassword: string,
    userName: string
  ): Promise<{ partner_id: number }> => {
    const { rows } = await dashboardQuery(
      `INSERT INTO partners (
        partner_name, phone_number, company_name_ar, company_name_en,
        bank_name, iban, status, email, encrypted_password, user_name
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING partner_id`,
      [
        partner_name,
        phone_number,
        company_name_ar,
        company_name_en,
        bank_name,
        iban,
        status,
        email,
        encryptedPassword,
        userName
      ]
    );
    return rows[0];
  }
,
//--------------------------------------------------------------------------------------------------------------------
updatePartnerById: async (
  partner_id: number,
  partner_name: string,
  phone_number: string,
  company_name_ar: string,
  company_name_en: string,
  bank_name: string,
  iban: string,  
  email: string,
  status: string,
  userName: string,
  encryptedPassword?: string 
): Promise<void> => {
  let query = `
    UPDATE partners SET
      partner_name = $1,
      phone_number = $2,
      company_name_ar = $3,
      company_name_en = $4,
      bank_name = $5,
      iban = $6,
      email = $7,
      status = $8,
      user_name = $9`;
  const params: any[] = [
    partner_name,
    phone_number,
    company_name_ar,
    company_name_en,
    bank_name,
    iban,
    email,
    status,
    userName
  ];

  if (encryptedPassword) {
    query += `, encrypted_password = $10 WHERE partner_id = $11`;
    params.push(encryptedPassword, partner_id);
  } else {
    query += ` WHERE partner_id = $10`;
    params.push(partner_id);
  }

  await dashboardQuery(query, params);
},
//----------------------------------------------------------------------------------------------------
deleteCategory: async (
store_id: string,
    category_id: string
  ): Promise<void> => {
    const query = `
      UPDATE products
      SET product_data_ar_jsonb = delete_category_and_items(product_data_ar_jsonb, $1),
          product_data_en_jsonb = delete_category_and_items(product_data_en_jsonb, $1)
      WHERE store_id = $2
    `;
    await dashboardQuery(query, [category_id, store_id]);
  },

//--------------------------------------------------------------------------------------------------------------------deleteCategory: async (
editCategory: async (
  store_id: string,

category_id:string
,name_ar:string,name_en:string,order:number
  ): Promise<void> => {
    const query = `
      UPDATE products
      SET product_data_ar_jsonb = update_category_and_items(product_data_ar_jsonb, $1,$2,$3,$4),
          product_data_en_jsonb = update_category_and_items(product_data_en_jsonb, $1,$2,$3,$4)
      WHERE store_id = $5
    `;
    await dashboardQuery(query, [category_id,name_ar,name_en,order,store_id]);
  },


//--------------------------------------------------------------------------------------------------------------------deleteCategory: async (
addCategory: async (
  store_id: string,

category_id:string
,name_ar:string,name_en:string,order:number
  ): Promise<void> => {
    const query = `
      insert products
      SET product_data_ar_jsonb = add_category_and_items(product_data_ar_jsonb, $1,$2,$3,$4),
          product_data_en_jsonb = add_category_and_items(product_data_en_jsonb,  $1,$2,$3,$4)
      WHERE store_id = $2
    `;
    await dashboardQuery(query, [1,name_ar,name_en,order,store_id]);
   // await dashboardQuery(query, [generator.getExtraBtuid(),name_ar,name_en,order,store_id]);
  },

//--------------------------------------------------------------------------------------------------------------------
addNewItem: async (req, res) => {
  try {
    const {
  category_id
    } = req.body;

    await dataEntryService.addNewItem(
category_id
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error :", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}
,

//---------------------------------------------------------------------------------------------------------
EditItem: async (req, res) => {
  try {
    const {
  category_id,
    } = req.body;

    await dataEntryService.EditItem(
category_id
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error :", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}
,
//------------------------------------------------------------------------------------------
deleteItem: async (req, res) => {
  try {
    const {
  category_id,
    } = req.body;

    await dataEntryService.deleteItem(
category_id
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error :", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}
,
//-----------------------------------------------------------------------------
EditItemWithImage: async (req, res) => {
  try {
    const {
  category_id,
    } = req.body;

    await dataEntryService.EditItemWithImage(
category_id
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error :", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}
,
}
};
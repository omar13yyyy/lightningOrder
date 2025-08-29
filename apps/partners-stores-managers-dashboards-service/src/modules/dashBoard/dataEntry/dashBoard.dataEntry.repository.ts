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
      SET product_data_ar_jsonb = update_category(product_data_ar_jsonb, $1,$2,$3,$4),
          product_data_en_jsonb = update_category(product_data_en_jsonb, $1,$2,$3,$4)
      WHERE store_id = $5
    `;
    await dashboardQuery(query, [category_id,name_ar,name_en,order,store_id]);
  },


//--------------------------------------------------------------------------------------------------------------------deleteCategory: async (
addCategory: async (
  store_id: string,
  category_id: string, 
  name_ar: string,
  name_en: string,
  order: number
): Promise<void> => {
  const baseJson = {
    category: [],
    items: [],
    modifiers: [],
  };

  const query = `
    INSERT INTO products (
      store_id,
      product_data_ar_jsonb,
      product_data_en_jsonb
    ) VALUES (
      $1,
      add_category($5::jsonb, $2, $3, $4),
      add_category($5::jsonb, $2, $3, $4)
    )
    ON CONFLICT (store_id)
    DO UPDATE SET
      product_data_ar_jsonb = add_category(products.product_data_ar_jsonb, $2, $3, $4),
      product_data_en_jsonb = add_category(products.product_data_en_jsonb, $2, $3, $4)
  `;

  await dashboardQuery(query, [store_id, name_ar, name_en, order, JSON.stringify(baseJson)]);
},


//--------------------------------------------------------------------------------------------------------------------

deleteItem: async (
store_id:string,
item_id:string
  ): Promise<void> => {
    const query = `
      UPDATE products
      SET product_data_ar_jsonb = delete_item_from_jsonb(product_data_ar_jsonb, $1),
          product_data_en_jsonb = delete_item_from_jsonb(product_data_en_jsonb, $1)
      WHERE store_id = $2
    `;
    await dashboardQuery(query, [item_id, store_id]);
  },

//------------------------------------------------------------------------------------
addNewItem: async (
  store_id: string,
  category_id: string,
  name_en: string,
  name_ar: string,
  description_en: string,
  description_ar: string,
  is_best_seller: boolean,
  is_activated: boolean,
  order: number,
  allergens: string[],
  sizes: {
    name: string;
    order: number;
    price: number;
    size_id: string;
    calories: number;
    modifiers_id: string[];
  }[], 
  image_path: string
): Promise<void> => {
  const query = `
    UPDATE products
    SET 
      product_data_ar_jsonb = add_item_from_jsonb(
        product_data_ar_jsonb, 
        $1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10::jsonb, $11
      ),
      product_data_en_jsonb = add_item_from_jsonb(
        product_data_en_jsonb, 
        $1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10::jsonb, $11
      )
    WHERE store_id = $12
  `;

  const values = [
    category_id,               
    name_en,                   
    name_ar,                   
    description_en,            
    description_ar,           
    is_best_seller,           
    is_activated,             
    order,                     
    JSON.stringify(allergens), 
    JSON.stringify(sizes),     
    image_path,                
    store_id                   
  ];

  const result = await dashboardQuery(query, values);

  if (result.rowCount === 0) {
    throw new Error(` No products found for store_id = ${store_id}`);
  }
},
//---------------------------------------------------------------------------------------------------------
EditItem: async (
store_id,
      category_id,
      item_id,
      internal_item_id,
      name_en,
      name_ar,
      description_en,
      description_ar,
      is_best_seller,
      is_activated,
      order,
      allergens: string[],
  sizes: {
    name: string;
    order: number;
    price: number;
    size_id: string;
    calories: number;
    modifiers_id: string[];
  }[], 
  ): Promise<void> => {
    const query = `
      UPDATE products
      SET product_data_ar_jsonb = edit_item_from_jsonb(product_data_ar_jsonb,  $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12::jsonb),
          product_data_en_jsonb = edit_item_from_jsonb(product_data_en_jsonb,  $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12::jsonb)
      WHERE store_id = $13
    `;
    await dashboardQuery(query, [
      category_id,
      item_id,
      internal_item_id,
      name_en,
      name_ar,
      description_en,
      description_ar,
      is_best_seller,
      is_activated,
      order,
        JSON.stringify(allergens), 
    JSON.stringify(sizes), store_id]);
  },
//-----------------------------------------------------------------------------
EditItemWithImage: async (
  store_id,
      category_id,
          item_id,
      internal_item_id,
      name_en,
      name_ar,
      description_en,
      description_ar,
      is_best_seller,
      is_activated,
      order,
       allergens: string[],
  sizes: {
    name: string;
    order: number;
    price: number;
    size_id: string;
    calories: number;
    modifiers_id: string[];
  }[], 
      image_path
  ): Promise<void> => {
    const query = `
      UPDATE products
      SET product_data_ar_jsonb = editwithimage_item_from_jsonb(product_data_ar_jsonb,  $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12::jsonb,$13),
          product_data_en_jsonb = editwithimage_item_from_jsonb(product_data_en_jsonb,  $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12::jsonb,$13)
      WHERE store_id = $14
    `;
    await dashboardQuery(query, [  
      category_id,
          item_id,
      internal_item_id,
      name_en,
      name_ar,
      description_en,
      description_ar,
      is_best_seller,
      is_activated,
      order,
         JSON.stringify(allergens), 
    JSON.stringify(sizes),
      image_path, store_id]);
  },
//----------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
addModifier: async (
    store_id,
        max,
        min,
        enTille,
        arTitle,
  items: {
     name: string;
     order:number;
    price: number;
    is_enable: boolean;
    is_default?: boolean;
  }[], 
): Promise<void> => {
  const query = `
    UPDATE products
    SET 
      product_data_ar_jsonb = add_Modifier_from_jsonb(
        product_data_ar_jsonb, 
         $2, $3, $4, $5, $6::jsonb,$7
      ),
      product_data_en_jsonb = add_Modifier_from_jsonb(
        product_data_en_jsonb, 
         $2, $3, $4, $5, $6::jsonb,$7
      )
    WHERE store_id = $1
  `;

  const values = [
    store_id,
        max,
        min,
        enTille,
        arTitle,         
                     
    JSON.stringify(items), 
    1  //  tooodooo :::it is the modifier id         
  ];

  const result = await dashboardQuery(query, values);

  if (result.rowCount === 0) {
    throw new Error(` No products found for store_id = ${store_id}`);
  }
},
//---------------------------------------------------------------------------------------------------------
editModifier: async (
    store_id,modifier_id,
        max,
        min,
        enTille,
        arTitle,
  items: {
     name: string;
     order:number;
    price: number;
    is_enable: boolean;
    is_default?: boolean;
  }[], 
  ): Promise<void> => {
    const query = `
      UPDATE products
      SET product_data_ar_jsonb = edit_Modifier_from_jsonb(product_data_ar_jsonb,  $2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12::jsonb),
          product_data_en_jsonb = edit_Modifier_from_jsonb(product_data_en_jsonb,  $2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12::jsonb)
      WHERE store_id = $13
    `;
    await dashboardQuery(query, [
     store_id,modifier_id,
        max,
        min,
        enTille,
        arTitle,
        JSON.stringify(items), 
   ]);
  },
//-----------------------------------------------------------------------------
deleteModifier: async (
 store_id, modifier_id
  ): Promise<void> => {
    const query = `
      UPDATE products
      SET product_data_ar_jsonb = deleteModifier_from_jsonb(product_data_ar_jsonb, $2),
          product_data_en_jsonb = deleteModifier_from_jsonb(product_data_en_jsonb, $2)
      WHERE store_id = $1
    `;
    await dashboardQuery(query, [ store_id, modifier_id]);
  },
//------------------------------------------------------------------------------------
addModifierItem: async (
 store_id,
        ModifierId,
        arTitle,
        enTitle,
        price,
        isDefault,
        isEnable,
): Promise<void> => {
  const query = `
    UPDATE products
    SET 
      product_data_ar_jsonb = addModifierItem_from_jsonb(
        product_data_ar_jsonb, 
         $2, $3, $4, $5, $6,$7
      ),
      product_data_en_jsonb = addModifierItem_from_jsonb(
        product_data_en_jsonb, 
         $2, $3, $4, $5, $6,$7
      )
    WHERE store_id = $1
  `;

  const values = [
  store_id,
        ModifierId,
        arTitle,
        enTitle,
        price,
        isDefault,
        isEnable,
    1    //  tooodooo :::it is the modifier item id         
  ];

  const result = await dashboardQuery(query, values);

  if (result.rowCount === 0) {
    throw new Error(` No products found for store_id = ${store_id}`);
  }
},
//---------------------------------------------------------------------------------------------------------
editModifiersItem: async (
      store_id,
        ModifierId,
        ModifieritemId,
        arTitle,
        enTitle,
        price,
        isDefault,
        isEnable 
  ): Promise<void> => {
    const query = `
      UPDATE products
      SET product_data_ar_jsonb = editModifiersItem_from_jsonb(product_data_ar_jsonb,  $2,$3,$4,$5,$6,$7,$8),
          product_data_en_jsonb = editModifiersItem_from_jsonb(product_data_en_jsonb,  $2,$3,$4,$5,$6,$7,$8)
      WHERE store_id = $1
    `;
    await dashboardQuery(query, [
    store_id,
        ModifierId,
        ModifieritemId,
        arTitle,
        enTitle,
        price,
        isDefault,
        isEnable 
   ]);
  },
//-----------------------------------------------------------------------------
deleteModifierItem: async (
 store_id, modifier_id, ModifierItemId
  ): Promise<void> => {
    const query = `
      UPDATE products
      SET product_data_ar_jsonb = deleteModifierItem_from_jsonb(product_data_ar_jsonb, $2,$3),
          product_data_en_jsonb = deleteModifierItem_from_jsonb(product_data_en_jsonb, $2,$3)
      WHERE store_id = $1
    `;
    await dashboardQuery(query, [ store_id, modifier_id, ModifierItemId]);
  },
  //-------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
addSize: async (
{
        store_id,
        itemId,
        arSize,
        enSize,
        price,
        calories,
        modifierid
  }: {
          store_id,
        itemId,
        arSize,
        enSize,
        price,
        calories,
        modifierid:any[]
  }
): Promise<void> => {
  const query = `
    UPDATE products
    SET 
      product_data_ar_jsonb = addSize_from_jsonb(
        product_data_ar_jsonb, 
         $2, $3, $4, $5, $6,$7::jsonb
      ),
      product_data_en_jsonb = addSize_from_jsonb(
        product_data_en_jsonb, 
         $2, $3, $4, $5, $6,$7::jsonb
      )
    WHERE store_id = $1
  `;

  const values = [
  store_id,
       store_id,
        itemId,
        arSize,
        enSize,
        price,
        calories,
              JSON.stringify(modifierid), 
,
    1    //  tooodooo :::it is the size       
  ];

  const result = await dashboardQuery(query, values);

  if (result.rowCount === 0) {
    throw new Error(` No products found for store_id = ${store_id}`);
  }
},
//---------------------------------------------------------------------------------------------------------
editSize: async (
store_id,sizeId, itemId, arSize, enSize, price, calories ,modifierid:any[]
  ): Promise<void> => {
    const query = `
      UPDATE products
      SET product_data_ar_jsonb =editSize_from_jsonb(product_data_ar_jsonb,  $2,$3,$4,$5,$6,$7,$8),
          product_data_en_jsonb = editSize_from_jsonb(product_data_en_jsonb,  $2,$3,$4,$5,$6,$7,$8)
      WHERE store_id = $1
    `;
    await dashboardQuery(query, [
   store_id,sizeId, itemId, arSize, enSize, price, calories ,modifierid
   ]);
  },
//-----------------------------------------------------------------------------
deleteSize: async (
 store_id, sizeId   ): Promise<void> => {
    const query = `
      UPDATE products
      SET product_data_ar_jsonb = deleteSize_from_jsonb(product_data_ar_jsonb, $2),
          product_data_en_jsonb = deleteSize_from_jsonb(product_data_en_jsonb, $2)
      WHERE store_id = $1
    `;
    await dashboardQuery(query, [  store_id, sizeId ]);
  },
  //-------------------------------------------------------------------------------------------

}


;
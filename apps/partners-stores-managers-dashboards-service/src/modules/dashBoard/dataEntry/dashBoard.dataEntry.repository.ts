import bcrypt from "bcryptjs";
import {
  categoriesGenerator,
  categoryTagsGenerator,
  modifierItemsGenerator,
  modifiersGenerator,
  partnersGenerator,
  productsGenerator,
  sizesGenerator,
  storesGenerator,
  storeTransactionsGenerator,
  tagsGenerator,
} from "../../../../../../modules/btuid/dashboardBtuid";
import { query as dashboardQuery } from "../../../../../../modules/database/commitDashboardSQL";

import { query  } from "../../../../../../modules/database/commitDeliverySQL";
export type WorkShiftRow = {
  shift_id: number;
  store_id: string;
  internal_store_id: number;
  day_of_week: 'Sun'|'Mon'|'Tue'|'Wed'|'Thu'|'Fri'|'Sat'|string;
  opening_time: string;  // HH:MM:SS
  closing_time: string;  // HH:MM:SS
};
type RepoInput = {
  page: number;
  pageSize: number;
  q?: string;
  vehicle_type?: string;
  is_activated?: boolean;
};
type AddDriverInput = {
  full_name: string;
  phone_number: string;
  email: string | null;
  is_activated: boolean;
  vehicle_type: string; // enum_vehicle_type
  address: string | null;
  bank_name: string | null;
  iban: string | null;
  user_name: string;
  encrypted_password: string;
  images: {
    profile: string | null;
    plate: string | null;
    driving_license: string | null;
  }
};


// النتائج المتوقعة
export type PartnerWithdrawalRow = {
  withdrawal_id: string;
  partner_name: string | null;
  amount: number | null;
  bank: string | null;
  iban: string | null;
  withdrawal_status: string; // enum_withdrawal_status
  uploaded_at: string | null; // ISO-like
};

export type DriverWithdrawalRow = {
  withdrawal_id: string;
  full_name: string | null;
  status: string; // enum_withdrawal_status
  amount: number | null;
  bank: string | null;
  iban: string | null;
  uploaded_at: string | null; // ISO-like
};
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
      partner_id: string;
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
  getPartnerscounts: async () => {
    const { rows } = await dashboardQuery(
      `SELECT COUNT(*) AS total FROM  partners`,
      []
    );
    return parseInt(rows[0].total);
  },
  //----------------------------------------------------------------------------------------
  getPartnerscountsforsearch: async (partnerName) => {
    const { rows } = await dashboardQuery(
      `SELECT COUNT(*) AS total FROM  partners WHERE partner_name ILIKE $1`,
      [`%${partnerName}%`]
    );
    return parseInt(rows[0].total);
  },
  //---------------------------------------------------------------------------------------
  getPartnersForSearch: async (
    partnerName: string,
    pageSize: number,
    offset: number
  ): Promise<
    {
      partner_id: string;
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

  changeParenterState: async (partnerId: string, state: string) => {
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
  },
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
  ): Promise<{ partner_id: string }> => {
    const partner_id = partnersGenerator.getExtraBtuid();

    const { rows } = await dashboardQuery(
      `INSERT INTO partners (
        partner_name, phone_number, company_name_ar, company_name_en,
        bank_name, iban, status, email, encrypted_password, user_name,partner_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
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
        userName,
        partner_id,
      ]
    );
    return rows[0];
  },
  //--------------------------------------------------------------------------------------------------------------------
  updatePartnerById: async (
    partner_id: string,
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
      userName,
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
    category_id: string,
    name_ar: string,
    name_en: string,
    order: number
  ): Promise<void> => {
    const newCategoryAr = {
      category_id,
      name: name_ar,
      order,
    };

    const newCategoryEn = {
      category_id,
      name: name_en,
      order,
    };

    const query = `
    UPDATE products
    SET 
      product_data_ar_jsonb = update_category(product_data_ar_jsonb, $2::jsonb),
      product_data_en_jsonb = update_category(product_data_en_jsonb, $3::jsonb)
    WHERE store_id = $1;
  `;

    await dashboardQuery(query, [
      store_id,
      JSON.stringify(newCategoryAr),
      JSON.stringify(newCategoryEn),
    ]);
  },
  //--------------------------------------------------------------------------------------------------------------------
  addCategory: async (
    store_id: string,
    name_ar: string,
    name_en: string,
    order: number
  ): Promise<void> => {
    const category_id = categoryTagsGenerator.getExtraBtuid();
    console.log("name_ar:", name_ar, "name_en:", name_en);
    const newCategoryar = {
      category_id,
      name: name_ar,
      order,
    };
    const newCategoryen = {
      category_id,
      name: name_en,
      order,
    };
    const baseJsonar = {
      category: [newCategoryar],
      items: [],
      modifiers: [],
    };
    const baseJsonen = {
      category: [newCategoryen],
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
      $2::jsonb,
      $3::jsonb
    )
    ON CONFLICT (store_id) DO UPDATE SET
      product_data_ar_jsonb = add_category(products.product_data_ar_jsonb, $4::jsonb),
      product_data_en_jsonb = add_category(products.product_data_en_jsonb, $5::jsonb);
  `;

    await dashboardQuery(query, [
      store_id,
      JSON.stringify(baseJsonar),
      JSON.stringify(baseJsonen),

      JSON.stringify(newCategoryar),
      JSON.stringify(newCategoryen),
    ]);
  },

  //--------------------------------------------------------------------------------------------------------------------

  deleteItem: async (store_id: string, item_id: string): Promise<void> => {
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
    sizesRaw: {
      arSize: string;
      enSize: string;
      order: number;
      price: number;
      calories: number;
      modifiers_id: string[];
    }[]
  ): Promise<void> => {
    const item_id = productsGenerator.getExtraBtuid();

    const baseSizes = sizesRaw.map((size) => ({
      size_id: sizesGenerator.getExtraBtuid(),
      order: size.order,
      price: size.price,
      calories: size.calories,
      modifiers_id: size.modifiers_id,
      arName: size.arSize,
      enName: size.enSize,
    }));

    const sizes_ar = baseSizes.map((s) => ({
      size_id: s.size_id,
      order: s.order,
      price: s.price,
      calories: s.calories,
      modifiers_id: s.modifiers_id,
      name: s.arName,
    }));

    const sizes_en = baseSizes.map((s) => ({
      size_id: s.size_id,
      order: s.order,
      price: s.price,
      calories: s.calories,
      modifiers_id: s.modifiers_id,
      name: s.enName,
    }));

    const newitemar = {
      item_id,
      store_id,
      category_id,
      name: name_ar,
      description: description_ar,
      is_best_seller,
      is_activated,
      order,
      allergens,
      sizes: sizes_ar,
    };

    const newitemen = {
      item_id,
      store_id,
      category_id,
      name: name_en,
      description: description_en,
      is_best_seller,
      is_activated,
      order,
      allergens,
      sizes: sizes_en,
    };

    const query = `
    UPDATE products
    SET 
      product_data_ar_jsonb = add_item_from_jsonb(product_data_ar_jsonb, $2),
      product_data_en_jsonb = add_item_from_jsonb(product_data_en_jsonb, $3)
    WHERE store_id = $1
  `;

    const values = [
      store_id,
      JSON.stringify(newitemar),
      JSON.stringify(newitemen),
    ];

    const result = await dashboardQuery(query, values);

    if (result.rowCount === 0) {
      throw new Error(`No products found for store_id = ${store_id}`);
    }
  },
  //-------و--------------------------------------------------------------------------------------------------
  EditItem: async (
    store_id,
    item_id,
    internal_item_id,
    name_en,
    name_ar,
    description_en,
    description_ar,
    is_best_seller,
    is_activated,
    order,
    allergens: string[]
  ): Promise<void> => {
    const edititemar = {
      item_id,
      internal_item_id,
      name: name_ar,
      description: description_ar,
      is_best_seller,
      is_activated,
      order,
      allergens: [],
    };

    const edititemen = {
      item_id,
      internal_item_id,
      name: name_en,
      description: description_en,
      is_best_seller,
      is_activated,
      order,
      allergens,
    };

    const query = `
      UPDATE products
      SET product_data_ar_jsonb = edit_item_from_jsonb(product_data_ar_jsonb,  $2),
          product_data_en_jsonb = edit_item_from_jsonb(product_data_en_jsonb,  $3)
      WHERE store_id = $1
    `;
    await dashboardQuery(query, [
      store_id,
      JSON.stringify(edititemar),
      JSON.stringify(edititemen),
    ]);
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
    allergens: string[]
    //  image_path
  ): Promise<void> => {
    const edititemwithimagear = {
      category_id,
      item_id,
      internal_item_id,
      name: name_ar,
      description: description_ar,
      is_best_seller,
      is_activated,
      order,
      allergens,
      // image_path
    };
    const edititemwithimageen = {
      category_id,
      item_id,
      internal_item_id,
      name: name_en,
      description: description_en,
      is_best_seller,
      is_activated,
      order,
      allergens,
      // image_path
    };
    const query = `
      UPDATE products
      SET product_data_ar_jsonb = edit_item_from_jsonb(product_data_ar_jsonb, $2),
          product_data_en_jsonb = edit_item_from_jsonb(product_data_en_jsonb, $3)
      WHERE store_id = $1
    `;
    await dashboardQuery(query, [
      store_id,
      JSON.stringify(edititemwithimagear),
      JSON.stringify(edititemwithimageen),
    ]);
  },
  //----------------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------
  addModifier: async (
    store_id,
    max,
    min,
    type,
    lable,

    enTitle,
    arTitle,
    items: {
      name: string;
      order: number;
      price: number;
      is_enable: boolean;
      is_default?: boolean;
    }[]
  ): Promise<void> => {
    const modifiers_id = modifiersGenerator.getExtraBtuid();

    const addmodifierar = {
      modifiers_id,
      max,
      min,
      type,
      lable,

      title: arTitle,
      items,
    };
    const addmodifieren = {
      modifiers_id,
      max,
      min,
      type,
      lable,

      title: enTitle,
      items,
    };
    const query = `
    UPDATE products
    SET 
      product_data_ar_jsonb = add_Modifier_from_jsonb(
        product_data_ar_jsonb, 
         $2
      ),
      product_data_en_jsonb = add_Modifier_from_jsonb(
        product_data_en_jsonb, 
         $3
      )
    WHERE store_id = $1
  `;

    const values = [
      store_id,
      JSON.stringify(addmodifierar),
      JSON.stringify(addmodifieren),
    ];

    const result = await dashboardQuery(query, values);

    if (result.rowCount === 0) {
      throw new Error(` No products found for store_id = ${store_id}`);
    }
  },
  //---------------------------------------------------------------------------------------------------------
  editModifier: async (
    store_id,
    modifiers_id,
    max,
    min,
    type,
    lable,
    enTille,
    arTitle
    // items: {
    //   name: string;
    //   order: number;
    //   price: number;
    //   is_enable: boolean;
    //   is_default?: boolean;
    // }[]
  ): Promise<void> => {
    const editModifierar = {
      modifiers_id,
      max,
      min,
      type,
      lable,
      title: arTitle
      // items,
    };
    const editModifieren = {
      modifiers_id,
      max,
      min,
      type,
      lable,
      title: enTille
    };
    const query = `
      UPDATE products
      SET product_data_ar_jsonb = edit_Modifier_from_jsonb(product_data_ar_jsonb,  $2),
          product_data_en_jsonb = edit_Modifier_from_jsonb(product_data_en_jsonb,  $3)
      WHERE store_id = $1
    `;
    await dashboardQuery(query, [
      store_id,
      JSON.stringify(editModifierar),
      JSON.stringify(editModifieren),
    ]);
  },
  //-----------------------------------------------------------------------------
  deleteModifier: async (store_id, modifier_id): Promise<void> => {
    const query = `
      UPDATE products
      SET product_data_ar_jsonb = deleteModifier_from_jsonb(product_data_ar_jsonb, $2),
          product_data_en_jsonb = deleteModifier_from_jsonb(product_data_en_jsonb, $2)
      WHERE store_id = $1
    `;
    await dashboardQuery(query, [store_id, modifier_id]);
  },
  //------------------------------------------------------------------------------------
  addModifierItem: async (
   store_id,
    ModifierId,
    arTitle,
    enTitle,
    price,
    is_default,
    is_enable,
    order
  ): Promise<void> => {
    const modifiersitem_id = modifierItemsGenerator.getExtraBtuid();

    const addModifieritemar = {
      modifiersitem_id,
      ModifierId,
      name:arTitle,
      price,
      is_default,
      is_enable,
      order,
    };
    const addModifieritemen = {
      modifiersitem_id,
      ModifierId,
      name:enTitle,
      price,
      is_default,
      is_enable,
      order,
    };
    const query = `
    UPDATE products
    SET 
      product_data_ar_jsonb = addModifierItem_from_jsonb(
        product_data_ar_jsonb, 
         $2
      ),
      product_data_en_jsonb = addModifierItem_from_jsonb(
        product_data_en_jsonb, 
          $3
      )
    WHERE store_id = $1
  `;

    const values = [
      store_id,
      JSON.stringify(addModifieritemar),

      JSON.stringify(addModifieritemen),
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
    modifiers_item_id,
    arTitle,
    enTitle,
    price,
    is_default,
    is_enable,
    order
  ): Promise<void> => {
    const editModifieritemar = {
      ModifierId,
      modifiers_item_id,
      name: arTitle,
      price,
      is_default,
      is_enable,
      order
    };
    const editModifieritemen = {
      ModifierId,
      modifiers_item_id,
      name: enTitle,
      price,
      is_default,
      is_enable,
      order
    };
    const query = `
      UPDATE products
      SET product_data_ar_jsonb = editModifiersItem_from_jsonb(product_data_ar_jsonb,  $2),
          product_data_en_jsonb = editModifiersItem_from_jsonb(product_data_en_jsonb,  $3)
      WHERE store_id = $1
    `;
    await dashboardQuery(query, [
      store_id,
      JSON.stringify(editModifieritemar),
      JSON.stringify(editModifieritemen),
    ]);
  },
  //-----------------------------------------------------------------------------
  deleteModifierItem: async (
    store_id,
    modifier_id,
    ModifierItemId
  ): Promise<void> => {
    const query = `
      UPDATE products
      SET product_data_ar_jsonb = deleteModifierItem_from_jsonb(product_data_ar_jsonb, $2,$3),
          product_data_en_jsonb = deleteModifierItem_from_jsonb(product_data_en_jsonb, $2,$3)
      WHERE store_id = $1
    `;
    await dashboardQuery(query, [store_id, modifier_id, ModifierItemId]);
  },
  //-------------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------
  addSize: async ({
    store_id,
    itemId,
    arSize,
    enSize,
    order,
    price,
    calories,
    modifierid,
  }: {
    store_id;
    itemId;
    arSize;
    enSize;
    order;
    price;
    calories;
    modifierid: any[];
  }): Promise<void> => {
    const size_id = sizesGenerator.getExtraBtuid();
    console.log(order, "siiiiiiiiiiiiiiiiiv");
    const addSizear = {
      size_id,
      itemId,
      name: arSize,
      order,
      price,
      calories,
      modifierid,
    };
    const addSizeen = {
      size_id,
      itemId,
      name: enSize,
      order,
      price,
      calories,
      modifierid,
    };
    const query = `
    UPDATE products
    SET 
      product_data_ar_jsonb = addSize_from_jsonb(
        product_data_ar_jsonb, 
         $2
      ),
      product_data_en_jsonb = addSize_from_jsonb(
        product_data_en_jsonb, 
       $3
      )
    WHERE store_id = $1
  `;

    const values = [
      store_id,
      JSON.stringify(addSizear),
      JSON.stringify(addSizeen),
    ];

    const result = await dashboardQuery(query, values);

    if (result.rowCount === 0) {
      throw new Error(` No products found for store_id = ${store_id}`);
    }
  },
  //---------------------------------------------------------------------------------------------------------
  editSize: async (
    store_id,
    sizeId,
    itemId,
    arSize,
    enSize,
    price,
    calories,
    modifierid: any[]
  ): Promise<void> => {
    console.log(enSize, "oikujyhgtfrdesawsertyuiop");
    const editSizear = {
      sizeId,
      itemId,
      name: arSize,
      price,
      calories,
      modifierid,
    };
    const editSizeen = {
      sizeId,
      itemId,
      name: enSize,
      price,
      calories,
      modifierid,
    };
    const query = `
      UPDATE products
      SET product_data_ar_jsonb =editSize_from_jsonb(product_data_ar_jsonb,  $2),
          product_data_en_jsonb = editSize_from_jsonb(product_data_en_jsonb,  $3)
      WHERE store_id = $1
    `;
    await dashboardQuery(query, [
      store_id,
      JSON.stringify(editSizear),
      JSON.stringify(editSizeen),
    ]);
  },
  //-----------------------------------------------------------------------------
  deleteSize: async (store_id, sizeId): Promise<void> => {
    const query = `
      UPDATE products
      SET product_data_ar_jsonb = deleteSize_from_jsonb(product_data_ar_jsonb, $2),
          product_data_en_jsonb = deleteSize_from_jsonb(product_data_en_jsonb, $2)
      WHERE store_id = $1
    `;
    await dashboardQuery(query, [store_id, sizeId]);
  },
  //-------------------------------------------------------------------------------------------
addStoreBranch: async ({
  store_namear, store_nameen, orders_type, preparation_time, user_name,
  phone_number, email, full_address, min_order_price, Latitude, longitude,
  logo_image_url, cover_image_url, store_description, platform_commission,
  category_name_id, managerUserName, password, images, tag_name_id, partnerId
}: {
  store_namear: string,
  store_nameen: string,
  orders_type: 'delivery' | 'take_away' | 'take_away_and_delivery' | string,
  preparation_time: number,
  user_name: string,
  phone_number: string,
  email: string,
  full_address: string,
  min_order_price: number,
  Latitude: number,
  longitude: number,
  logo_image_url: string,
  cover_image_url: string,
  store_description: string,
  platform_commission: number,
  category_name_id: string,
  managerUserName: string,
  password: string,
  images: string[],
  tag_name_id: string[],
  partnerId: string | null
}): Promise<{ internal_id: number; store_id: string }> => {

  const storeId = storesGenerator.getExtraBtuid();
  const hashed = await bcrypt.hash(password, 10);

  const query = `
    WITH up_addr AS (
      INSERT INTO address (full_address, create_at)
      VALUES ($1, NOW())
      ON CONFLICT (full_address) DO NOTHING
      RETURNING full_address
    ),
    cat AS (
      SELECT internal_id
      FROM store_categories
      WHERE category_id = $8
      LIMIT 1
    ),
    ins_store AS (
      INSERT INTO stores (
        store_id, partner_id,
        store_name_ar, store_name_en, phone_number, email, full_address,
        status, internal_category_id, category_id,
        min_order_price, latitude, longitude,
        logo_image_url, cover_image_url,
        store_description, platform_commission,
        orders_type, preparation_time,
        user_name, encrypted_password
      )
      VALUES (
        $2, $3,
        $4, $5, $6, $7, $1,
        'open', (SELECT internal_id FROM cat), $8,
        $9, $10, $11,
        $12, $13,
        $14, $15,
        $16, $17,
        $18, $19
      )
      RETURNING internal_id, store_id
    ),
    ins_wallet AS (
      INSERT INTO store_wallets (store_id, internal_store_id, partner_id, balance_previous_day, last_updated_at)
      SELECT s.store_id, s.internal_id, $3, 0, NOW()
      FROM ins_store s
      ON CONFLICT (store_id) DO NOTHING
      RETURNING store_id
    ),
    ins_stats AS (
      INSERT INTO statistics_previous_day (
        store_id, total_orders, total_revenue, average_delivery_time, customers_visited,
        balance_previous_day, platform_commission_balance_previous_day, last_updated_at
      )
      SELECT s.store_id, 0, 0, NULL, 0, 0, 0, NOW()
      FROM ins_store s
      ON CONFLICT (store_id) DO NOTHING
      RETURNING store_id
    ),
    ins_tags AS (
      INSERT INTO store_tags (tag_id, internal_tag_id, store_id, internal_store_id)
      SELECT t.tag_id, t.internal_id, s.store_id, s.internal_id
      FROM ins_store s
      JOIN tags t ON t.tag_id = ANY($20::text[])
      RETURNING id
    )
    SELECT (SELECT internal_id FROM ins_store) AS internal_id,
           (SELECT store_id     FROM ins_store) AS store_id;
  `;

  const values = [
    /* $1  */ full_address,
    /* $2  */ storeId,
    /* $3  */ partnerId,
    /* $4  */ store_namear,
    /* $5  */ store_nameen,
    /* $6  */ phone_number,
    /* $7  */ email,
    /* $8  */ category_name_id,
    /* $9  */ min_order_price,
    /* $10 */ Latitude,
    /* $11 */ longitude,
    /* $12 */ logo_image_url,
    /* $13 */ cover_image_url,
    /* $14 */ store_description,
    /* $15 */ platform_commission,
    /* $16 */ orders_type,
    /* $17 */ preparation_time,
    /* $18 */ user_name,
    /* $19 */ hashed,
    /* $20 */ tag_name_id ?? []
  ];

  const res = await dashboardQuery(query, values);
  const row = res?.rows?.[0];
  return { internal_id: row.internal_id, store_id: row.store_id };
},

getCategories: async (): Promise<
    { category_id: string; category_name_ar: string | null; category_name_en: string | null }[]
  > => {
    const q = `
      SELECT category_id, category_name_ar, category_name_en
      FROM store_categories
      ORDER BY category_name_ar NULLS LAST, category_name_en NULLS LAST, category_id
    `;
    const r = await dashboardQuery(q, []);
    return r.rows || [];
  },

  createCategory: async ({
    category_name_ar,
    category_name_en,
  }: {
    category_name_ar?: string;
    category_name_en?: string;
  }): Promise<void> => {
      const category_id = categoriesGenerator.getExtraBtuid();

    const q = `
      INSERT INTO store_categories (category_id, category_name_ar, category_name_en)
      VALUES ($1, $2, $3)
      ON CONFLICT (category_id) DO NOTHING
    `;
    await dashboardQuery(q, [category_id, category_name_ar ?? null, category_name_en ?? null]);
  },

  // =========================== TAGS ==========================

  getTags: async (): Promise<
    { tag_id: string; tag_name_ar: string | null; tag_name_en: string | null; category_id: string | null; internal_id: number | null }[]
  > => {
    const q = `
      SELECT tag_id, tag_name_ar, tag_name_en, category_id, internal_id
      FROM tags
      ORDER BY tag_name_ar NULLS LAST, tag_name_en NULLS LAST, tag_id
    `;
    const r = await dashboardQuery(q, []);
    return r.rows || [];
  },

  createTag: async ({
    tag_name_ar,
    tag_name_en,
    category_id,
  }: {
    tag_name_ar?: string;
    tag_name_en?: string;
    category_id?: string;
  }): Promise<void> => {
      const tag_id = tagsGenerator.getExtraBtuid();

    const q = `
      WITH next_internal AS (
        SELECT COALESCE(MAX(internal_id), 1000) + 1 AS next_id
        FROM tags
      )
      INSERT INTO tags (tag_id, internal_id, tag_name_ar, tag_name_en, category_id)
      SELECT $1, next_id, $2, $3, $4
      FROM next_internal
      ON CONFLICT (tag_id) DO NOTHING
    `;
    await dashboardQuery(q, [tag_id, tag_name_ar ?? null, tag_name_en ?? null, category_id ?? null]);
  },
insertDriver: async (p: {
    driver_id: string;
    full_name: string;
    phone_number: string;
    email: string | null;
    is_activated: boolean;
    vehicle_type: string;
    address: string | null;
    bank_name: string | null;
    iban: string | null;
    user_name: string;
    encrypted_password: string;
  }) => {
    const q = `
      INSERT INTO drivers (
        driver_id, full_name, phone_number, email, is_activated,
        vehicle_type, address, bank_name, iban, user_name, encrypted_password
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    `;
    const v = [
      p.driver_id, p.full_name, p.phone_number, p.email, p.is_activated,
      p.vehicle_type, p.address, p.bank_name, p.iban, p.user_name, p.encrypted_password,
    ];
    await query(q, v);
  },

  insertDriverDocuments: async (
    driver_id: string,
    docs: { document_id: string; document_description: string; image_url: string; expired: boolean }[]
  ) => {
    if (!docs.length) return;

    const rowsSql = docs
      .map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, NOW(), $${i * 5 + 5})`)
      .join(',');

    const q = `
      INSERT INTO delivery_document_images (
        document_id, document_description, user_id, image_url, uploaded_at, expired
      )
      VALUES ${rowsSql}
    `;
    const v = docs.flatMap(d => [d.document_id, d.document_description, driver_id, d.image_url, d.expired]);
    await query(q, v);
  },

  getDriverById: async (driver_id: string) => {
    const q = `
      SELECT driver_id, full_name, phone_number, email, is_activated,
             vehicle_type, address, bank_name, iban, user_name
      FROM drivers
      WHERE driver_id = $1
      LIMIT 1
    `;
    const r = await query(q, [driver_id]);
    return r.rows?.[0] || null;
  },

  getDriverDocuments: async (driver_id: string) => {
    const q = `
      SELECT document_id, document_description, image_url, uploaded_at, expired
      FROM delivery_document_images
      WHERE user_id = $1
      ORDER BY uploaded_at DESC NULLS LAST
    `;
    const r = await query(q, [driver_id]);
    return r.rows || [];
  },
  getDrivers: async ({ page, pageSize, q, vehicle_type, is_activated }: RepoInput) => {
    const conds: string[] = [];
    const vals: any[] = [];

    // فلترة بالكلمة المفتاحية (full_name/phone_number/user_name)
    if (q) {
      vals.push(`%${q}%`);
      conds.push(`(d.full_name ILIKE $${vals.length} OR d.phone_number ILIKE $${vals.length} OR d.user_name ILIKE $${vals.length})`);
    }

    if (typeof is_activated === 'boolean') {
      vals.push(is_activated);
      conds.push(`d.is_activated = $${vals.length}`);
    }

    if (vehicle_type) {
      vals.push(vehicle_type);
      conds.push(`d.vehicle_type = $${vals.length}`);
    }

    const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';

    // إجمالي النتائج
    const countSql = `SELECT COUNT(*)::bigint AS cnt FROM drivers d ${where};`;
    const countRes = await query(countSql, vals);
    const total: number = Number(countRes?.rows?.[0]?.cnt || 0);

    // بيانات الصفحة
    const offset = (page - 1) * pageSize;
    const listVals = [...vals, pageSize, offset];

    const listSql = `
      SELECT
        d.driver_id,
        d.full_name,
        d.phone_number,
        d.email,
        d.is_activated,
        d.vehicle_type,
        d.user_name
      FROM drivers d
      ${where}
      ORDER BY d.full_name ASC NULLS LAST
      LIMIT $${listVals.length - 1} OFFSET $${listVals.length};
    `;

    const listRes = await query(listSql, listVals);
    const rows = (listRes?.rows || []).map((r: any) => ({
      driver_id: r.driver_id,
      full_name: r.full_name,
      phone_number: r.phone_number,
      email: r.email,
      is_activated: r.is_activated,
      vehicle_type: r.vehicle_type,
      user_name: r.user_name,
    }));

    return { rows, total };
  },
  addTrend: async ({
    store_id, details, contract_image, from_date, to_date, create_at
  }: {
    store_id: string;
    details: string | null;
    contract_image: string | null;
    from_date: Date | null;
    to_date: Date | null;
    create_at: Date | null;
  }): Promise<void> => {
    // trends.unique(internal_store_id). بدنا نجيب internal_id من stores
    const query = `
      WITH s AS (
        SELECT internal_id
        FROM stores
        WHERE store_id = $1
        LIMIT 1
      ),
      upsert AS (
        INSERT INTO trends (internal_store_id, details, contract_image, from_date, to_date, create_at)
        SELECT s.internal_id, $2, $3, $4, $5, COALESCE($6, NOW())
        FROM s
        ON CONFLICT (internal_store_id)
        DO UPDATE SET
          details = EXCLUDED.details,
          contract_image = COALESCE(EXCLUDED.contract_image, trends.contract_image),
          from_date = EXCLUDED.from_date,
          to_date = EXCLUDED.to_date,
          create_at = EXCLUDED.create_at
        RETURNING internal_store_id
      )
      SELECT * FROM upsert;
    `;
    const values = [
      store_id,
      details,
      contract_image,
      from_date,
      to_date,
      create_at,
    ];
    const r = await dashboardQuery(query, values);
    if (!r.rowCount) {
      throw new Error(`store_id غير موجود: ${store_id}`);
    }
  },

  // ------- STOP TREND -------
  stopTrend: async ({
  store_id, details // details صارت غير مستخدمة هنا
}: {
  store_id: string;
  details: string | null;
}): Promise<void> => {
  const query = `
    WITH s AS (
      SELECT internal_id
      FROM stores
      WHERE store_id = $1
      LIMIT 1
    )
    DELETE FROM trends t
    USING s
    WHERE t.internal_store_id = s.internal_id
    RETURNING t.internal_store_id
  `;
  const values = [store_id];
  const r = await dashboardQuery(query, values);

  if (r.rowCount === 0) {
    // ما في سجلات تم حذفها لهذا المتجر
    // بإمكانك ترجع بدون خطأ أو ترمي خطأ—حسب منطقك:
    // throw new Error('لا يوجد ترند لهذا المتجر ليتم حذفه');
  }
}
,
getStoreTrends: async (store_id: string) => {
    const q = `
      SELECT 
        t.internal_store_id,
        t.details,
        t.contract_image,
        t.from_date,
        t.to_date,
        t.create_at,
        s.store_id
      FROM trends t
      JOIN stores s ON s.internal_id = t.internal_store_id
      WHERE s.store_id = $1
      ORDER BY t.create_at DESC
    `;
    const r = await dashboardQuery(q, [store_id]);
    return r.rows || [];
  },
async getInternalStoreId(storeId: string): Promise<number | null> {
    const q = `SELECT internal_id FROM stores WHERE store_id = $1 LIMIT 1`;
    const res = await dashboardQuery(q, [storeId]);
    return res?.rows?.[0]?.internal_id ?? null;
  },

  async getShiftsByStore(storeId: string): Promise<WorkShiftRow[]> {
    const q = `
      SELECT shift_id, store_id, internal_store_id, day_of_week, opening_time, closing_time
      FROM working_hours
      WHERE store_id = $1
      ORDER BY 
        CASE day_of_week
          WHEN 'Sun' THEN 1 WHEN 'Mon' THEN 2 WHEN 'Tue' THEN 3
          WHEN 'Wed' THEN 4 WHEN 'Thu' THEN 5 WHEN 'Fri' THEN 6
          WHEN 'Sat' THEN 7 ELSE 8 END,
        opening_time ASC
    `;
    const res = await dashboardQuery(q, [storeId]);
            console.log(res.rows,'gfghjkl;')

    return res?.rows ?? [];
  },

  async hasOverlap(args: {
    internalStoreId: number;
    day: string;
    opening: string; // 'HH:MM'
    closing: string; // 'HH:MM'
  }): Promise<boolean> {
    // تداخل إذا كان: new.open < existing.close AND new.close > existing.open
    const q = `
      SELECT 1
      FROM working_hours
      WHERE internal_store_id = $1
        AND day_of_week = $2
        AND (to_char(opening_time, 'HH24:MI') < $4)
        AND (to_char(closing_time, 'HH24:MI') > $3)
      LIMIT 1
    `;
    const res = await dashboardQuery(q, [
      args.internalStoreId, args.day, args.opening, args.closing,
    ]);
        console.log(res.rows+'gfghjkl;')

    return Boolean(res?.rowCount);
  },

  async insertShift(args: {
    storeId: string;
    internalStoreId: number;
    day: string;
    opening: string; // 'HH:MM'
    closing: string; // 'HH:MM'
  }): Promise<{ shift_id: number }> {
    const q = `
      INSERT INTO working_hours (store_id, internal_store_id, day_of_week, opening_time, closing_time)
      VALUES ($1, $2, $3, $4::time, $5::time)
      RETURNING shift_id
    `;
    console.log('he1')
    const res = await dashboardQuery(q, [
      args.storeId, args.internalStoreId, args.day, args.opening, args.closing,
    ]);
    console.log(res.rows+'gfghjkl;')
    return { shift_id: res?.rows?.[0]?.shift_id };
  },

  async deleteShift(shiftId: number): Promise<void> {
    const q = `DELETE FROM working_hours WHERE shift_id = $1`;
    await dashboardQuery(q, [shiftId]);
  },
async listPartnerRequestsByStatus(
    status: 'new' | 'wait'
  ): Promise<PartnerWithdrawalRow[]> {
    const q = `
      SELECT 
        wr.withdrawal_id,
        p.partner_name,
        p.bank_name AS bank,
        p.iban      AS iban,
        wr.withdrawal_status,
        TO_CHAR(wr.uploaded_at, 'YYYY-MM-DD"T"HH24:MI:SS') AS uploaded_at
      FROM withdrawal_requests wr
      JOIN partners p ON p.partner_id = wr.partner_id
      WHERE wr.withdrawal_user = 'partner'::enum_withdrawal_user
        AND wr.withdrawal_status = $1::enum_withdrawal_status
      ORDER BY wr.uploaded_at DESC NULLS LAST
    `;
    const r = await dashboardQuery(q, [status]);
    return r?.rows ?? [];
  },

  /* ============ Partner: move to waiting ============ */
  async markPartnerRequestWaiting(withdrawalId: string): Promise<void> {
    const q = `
      UPDATE withdrawal_requests
      SET withdrawal_status = 'wait'::enum_withdrawal_status
      WHERE withdrawal_id = $1
        AND withdrawal_user = 'partner'::enum_withdrawal_user
    `;
    await dashboardQuery(q, [withdrawalId]);
  },

  /* ============ Partner: mark done ============ */


  /* ====== Images for partner/driver withdrawals ====== */
  async insertWithdrawalImages(params: {
    withdrawalId: string;
    userId: string | number | null; // اختياري
    images: { url: string; description?: string }[];
    userType: 'partner' | 'driver';
  }): Promise<void> {
    if (!params.images?.length) return;

    // نجهّز placeholders ديناميكياً
    const values: any[] = [];
    const rows: string[] = [];
    let i = 1;

    for (const img of params.images) {
      rows.push(
        // ملاحظة: عندك في الجدول اسم العمود Withdrawal_id بحرف كبير W
        `($${i++}, $${i++}, $${i++}, $${i++}, $${i++}::enum_withdrawal_user, NOW(), FALSE)`
      );
      values.push(
        params.withdrawalId,                            // Withdrawal_id
        params.userId ?? null,                          // userId
        img.description ?? 'withdrawal_document',       // document_description
        img.url,                                        // image_url
        params.userType                                 // user_type (enum)
      );
    }

    const q = `
      INSERT INTO withdrawal_document_images
        ("Withdrawal_id", "userId", document_description, image_url, user_type, uploaded_at, expired)
      VALUES ${rows.join(', ')}
    `;
    await dashboardQuery(q, values);
  },

  /* ==================== Driver: list all ==================== */
  async listDriverRequests(): Promise<DriverWithdrawalRow[]> {
    const q = `
      SELECT 
        wr.withdrawal_id,
        d.full_name,
        wr.withdrawal_status AS status,
        d.bank_name AS bank,
        d.iban      AS iban,
        TO_CHAR(wr.uploaded_at, 'YYYY-MM-DD"T"HH24:MI:SS') AS uploaded_at
      FROM withdrawal_requests wr
      JOIN remotely.drivers d 
        ON d.driver_id::text = wr.partner_id
      WHERE wr.withdrawal_user = 'driver'::enum_withdrawal_user
      ORDER BY wr.uploaded_at DESC NULLS LAST
    `;
    const r = await dashboardQuery(q, []);
    return r?.rows ?? [];
  },
  async allocateWithdrawalAcrossStores(params: {
    withdrawalId: string;
    partnerId: string;
    amount: number;
    notes?: string | null;
  }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // جيب متاجر الشريك
      const storesRes = await client.query(
        `SELECT s.internal_id, s.store_id
         FROM stores s
         WHERE s.partner_id = $1
         ORDER BY s.internal_id ASC`,
        [params.partnerId]
      );
      const stores: Array<{ internal_id: number; store_id: string }> = storesRes.rows;

      if (!stores.length) {
        throw new Error('لا توجد متاجر لهذا الشريك');
      }

      let remaining = params.amount;
      const now = new Date();

      for (const st of stores) {
        if (remaining <= 0) break;

        // حدّث رصيد المحفظة حتى الآن (تأكد الدالة تستخدم transaction_at)
        await client.query(
          `SELECT public.get_store_wallet_balance($1)`,
          [st.store_id]
        );

        // اقفل صف المحفظة وخذ الرصيد الحالي
        const wRes = await client.query(
          `SELECT balance_previous_day
           FROM store_wallets
           WHERE store_id = $1
           FOR UPDATE`,
          [st.store_id]
        );

        const currentBalance = Number(wRes.rows?.[0]?.balance_previous_day ?? 0);
        if (currentBalance <= 0) continue;

        const take = Math.min(remaining, currentBalance);
        if (take <= 0) continue;

        // أدخل قيد سحب
        const transactionId = storeTransactionsGenerator.getExtraBtuid();
        await client.query(
          `INSERT INTO store_transactions
             (transaction_id, partner_id, store_id, internal_store_id,
              transaction_type, amount, amount_platform_commission, transaction_at, notes)
           VALUES ($1, $2, $3, $4, 'withdraw', $5, 0, $6, $7)`,
          [
            transactionId,
            params.partnerId,
            st.store_id,
            st.internal_id,
            take,
            now,
            params.notes ? `${params.notes} (withdrawalId=${params.withdrawalId})`
                         : `withdrawalId=${params.withdrawalId}`,
          ]
        );

        // خصم فوري من المحفظة وتحديث وقت آخر تحديث
        await client.query(
          `UPDATE store_wallets
             SET balance_previous_day = balance_previous_day - $2,
                 last_updated_at = $3
           WHERE store_id = $1`,
          [st.store_id, take, now]
        );

        remaining -= take;
      }

      if (remaining > 0) {
        // ما قدرنا نغطي كامل السحب
        throw new Error('الرصيد غير كافٍ لدى متاجر الشريك لتغطية مبلغ السحب');
      }

      await client.query('COMMIT');
      return { success: true };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async markPartnerRequestDone(withdrawalId: string): Promise<void> {
    const q = `
      UPDATE withdrawal_requests
      SET withdrawal_status = 'done'::enum_withdrawal_status,
          done = TRUE,
          uploaded_at = NOW()
      WHERE withdrawal_id = $1
        AND withdrawal_user = 'partner'::enum_withdrawal_user
    `;
    await dashboardQuery(q, [withdrawalId]);
  },
};
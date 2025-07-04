import { dataEntryrepository } from "./dashBoard.dataEntry.repository";
import bcrypt from "bcryptjs";

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
//------------------------------------------------------------------------------------------

export const dataEntryService = {
  //--------------------------------------------------------------------------------
  Login: async (userName, reqPassword) => {
    const result = await dataEntryrepository.fetchIdPasswordByUserName(
      userName
    );
    const { password, id } = result[0];
    const isMatch = await bcryptjs.compare(reqPassword, password);
    if (isMatch) {
      const token = jwt.sign(
        { admin_id: id, role: "admin" },
        process.env.TOKEN_SECRET_ADMIN as string
      );
      return { token, role: "admin", admin_id: id };
    }

    return null;
  },

  //------------------------------------------------------------------------------------------
  getPartners: async (page: number, pagesize: number) => {
    const offset = (page - 1) * pagesize;
    const [rows, total] = await Promise.all([
      dataEntryrepository.getPartners(pagesize, offset),
      dataEntryrepository.getPartnerscounts(),
    ]);

    return {
      data: {
        partners: rows,
        pagination: {
          total: total,
          page: Number(page),
          pageSize: Number(pagesize),
          totalPages: Math.ceil(total / pagesize),
        },
      },
    };
  },
  //-----------------------------------------------------------------------------------
  getPartnersForSearch: async (
    partnerName: string,
    page: number,
    pagesize: number
  ) => {
    const offset = (page - 1) * pagesize;

    const [rows, total] = await Promise.all([
      dataEntryrepository.getPartnersForSearch(partnerName, pagesize, offset),
      dataEntryrepository.getPartnerscountsforsearch(partnerName),
    ]);

    return {
      data: {
        partners: rows,
        pagination: {
          total: total,
          page: Number(page),
          pageSize: Number(pagesize),
          totalPages: Math.ceil(total / pagesize),
        },
      },
    };
  },
  //---------------------------------------------------------------------------------

  changeParenterState: async (partnerId: string, state: string) => {
    return await dataEntryrepository.changeParenterState(partnerId, state);
  },
  //-----------------------------------------------------------------------------------
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
    return await dataEntryrepository.getPartner(partnerId);
  },
  //-----------------------------------------------------------------------------------------------------
  addPartner: async (
    partner_name: string,
    phone_number: string,
    company_name_ar: string,
    company_name_en: string,
    bank_name: string,
    iban: string,
    status: string,
    email: string,
    password: string,
    userName: string
  ): Promise<{ partner_id: number }> => {
    const existing = await dataEntryrepository.findByUserName(userName);
    if (existing) {
      throw new Error("اسم المستخدم موجود مسبقاً");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await dataEntryrepository.insertPartner(
      partner_name,
      phone_number,
      company_name_ar,
      company_name_en,
      bank_name,
      iban,
      status,
      email,
      hashedPassword,
      userName
    );
  },
  //-----------------------------------------------------------------------------------------------
  updatePartner: async (
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
    password?: string
  ): Promise<void> => {
    const existing = await dataEntryrepository.findByUserName(userName);
    if (existing && existing.partner_id !== partner_id) {
      throw new Error("اسم المستخدم مستخدم من قبل شريك آخر");
    }

    let encryptedPassword: string | undefined = undefined;
    if (password) {
      encryptedPassword = await bcrypt.hash(password, 10);
    }

    await dataEntryrepository.updatePartnerById(
      partner_id,
      partner_name,
      phone_number,
      company_name_ar,
      company_name_en,
      bank_name,
      iban,
      email,
      status,
      userName,
      encryptedPassword
    );
  },
  //------------------------------------------------------------------------------------------------------------------
  deleteCategory: async (
    store_id: string,
    category_id: string
  ): Promise<void> => {
    await dataEntryrepository.deleteCategory(store_id, category_id);
  },

  //------------------------------------------------------------------------------------------------------------------
  editCategory: async (
    store_id: string,
    category_id: string,
    name_ar: string,
    name_en: string,
    order: number
  ): Promise<void> => {
    await dataEntryrepository.editCategory(
      store_id,
      category_id,
      name_ar,
      name_en,
      order
    );
  },
  //------------------------------------------------------------------------------------------------------------------------
  addCategory: async (
    store_id: string,
    category_id: string,
    name_ar: string,
    name_en: string,
    order: number
  ): Promise<void> => {
    await dataEntryrepository.addCategory(
      store_id,
      category_id,
      name_ar,
      name_en,
      order
    );
  },
  //------------------------------------------------------------------------------------------------------------------
  deleteItem: async (store_id: string, item_id: string): Promise<void> => {
    await dataEntryrepository.deleteItem(store_id, item_id);
  },

  //------------------------------------------------------------------------------------------------------------------------------
  addNewItem: async ({
    store_id,
    category_id,
    name_en,
    name_ar,
    description_en,
    description_ar,
    is_best_seller,
    is_activated,
    order,
    allergens,
    sizes,
    image_path,
  }: {
    store_id: string;
    category_id: string;
    name_en: string;
    name_ar: string;
    description_en: string;
    description_ar: string;
    is_best_seller: boolean;
    is_activated: boolean;
    order: number;
    allergens: string[];
    sizes: {
      name: string;
      order: number;
      price: number;
      size_id: string;
      calories: number;
      modifiers_id: string[];
    }[];
    image_path: string;
  }): Promise<void> => {
    await dataEntryrepository.addNewItem(
      store_id,
      category_id,
      name_en,
      name_ar,
      description_en,
      description_ar,
      is_best_seller,
      is_activated,
      order,
      allergens,
      sizes,
      image_path
    );
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
    allergens,
    sizes
  ): Promise<void> => {
    await dataEntryrepository.EditItem(
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
      allergens,
      sizes
    );
  },

  //------------------------------------------------------------------------------------------

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
    allergens,
    sizes,
    image_path
  ): Promise<void> => {
    await dataEntryrepository.EditItemWithImage(
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
      allergens,
      sizes,
      image_path
    );
  },
  //----------------------------------------------------------------------------------------------------------------------------
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
    await dataEntryrepository.addModifier(
      store_id,
        max,
        min,
        enTille,
        arTitle,
        items
    );
  },

  //---------------------------------------------------------------------------------------------------------
  editModifier: async (
  store_id, modifier_id, max, min, enTille, arTitle,items
  ): Promise<void> => {
    await dataEntryrepository.editModifier(
      store_id,
        modifier_id,
        max,
        min,
        enTille,
        arTitle,
        items
    );
  },

  //------------------------------------------------------------------------------------------
    deleteModifier: async ( store_id, modifier_id): Promise<void> => {
    await dataEntryrepository.deleteItem( store_id, modifier_id);
  },
//---------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------------------------
  addModifierItem: async ({
    store_id,
        ModifierId,
        arTitle,
        enTitle,
        price,
        isDefault,
        isEnable,
  }: {
        store_id:string,
        ModifierId:string,
        arTitle:string,
        enTitle:string,
        price:any,
        isDefault:any,
        isEnable:any
  }): Promise<void> => {
    await dataEntryrepository.addModifierItem(
    store_id,
        ModifierId,
        arTitle,
        enTitle,
        price,
        isDefault,
        isEnable
    );
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
        isEnable  ): Promise<void> => {
    await dataEntryrepository.editModifiersItem(
        store_id,
        ModifierId,
        ModifieritemId,
        arTitle,
        enTitle,
        price,
        isDefault,
        isEnable
    );
  },

  //------------------------------------------------------------------------------------------
    deleteModifierItem: async (  store_id, modifier_id, ModifierItemId ): Promise<void> => {
    await dataEntryrepository.deleteModifierItem(  store_id, modifier_id, ModifierItemId) ;
  },
//---------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------------------------
  addSize: async ({
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
  }): Promise<void> => {
    await dataEntryrepository.addSize({
        store_id,
        itemId,
        arSize,
        enSize,
        price,
        calories,
        modifierid
  });
  },

  //---------------------------------------------------------------------------------------------------------
  editSize: async (
 store_id,sizeId, itemId, arSize, enSize, price, calories ,modifierid:any[] ): Promise<void> => {
    await dataEntryrepository.editSize(
  store_id,sizeId, itemId, arSize, enSize, price, calories,modifierid
    );
  },

  //------------------------------------------------------------------------------------------
    deleteSize: async (  store_id, sizeId  ): Promise<void> => {
    await dataEntryrepository.deleteSize(  store_id, sizeId ) ;
  },
//---------------------------------------------------------------------------------------------------------

};

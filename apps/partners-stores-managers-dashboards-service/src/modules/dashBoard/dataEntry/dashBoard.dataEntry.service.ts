import { dataEntryrepository } from "./dashBoard.dataEntry.repository";
import bcrypt from "bcryptjs";

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { PG_ORDERS_DATABASE } from "../../../../../../modules/database/config";
import { imageService } from "../../../../../image-service/src/image.service";
import { documentImagesGenerator, rolesGenerator, tagsGenerator } from "../../../../../../modules/btuid/dashboardBtuid";
import { driversGenerator } from "../../../../../../modules/btuid/deliveryBtuid";
//------------------------------------------------------------------------------------------
type DocType = 'profile' | 'plate' | 'driving_license';
type GetDriversInput = {
  page: number;
  pageSize: number;
  q?: string;
  vehicle_type?: string;
  is_activated?: boolean;
};

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
  ): Promise<{ partner_id: string }> => {
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
    name_ar: string,
    name_en: string,
    order: number
  ): Promise<void> => {
    await dataEntryrepository.addCategory(store_id, name_ar, name_en, order);
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
  }: //image_path,
  {
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
      arSize: string;
      enSize: string;
      order: number;
      price: number;
      calories: number;
      modifiers_id: string[];
    }[];
    //image_path: string;
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
      sizes
      //image_path
    );
  },

  //---------------------------------------------------------------------------------------------------------
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
    allergens
  ): Promise<void> => {
    await dataEntryrepository.EditItem(
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
      allergens
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
    allergens
    //image_path
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
      allergens
      //image_path
    );
  },
  //----------------------------------------------------------------------------------------------------------------------------
  addModifier: async (
    store_id,
    max,
    min,
    type,
    lable,

    enTille,
    arTitle,
    items: {
      name: string;
      order: number;
      price: number;
      is_enable: boolean;
      is_default?: boolean;
    }[]
  ): Promise<void> => {
    await dataEntryrepository.addModifier(
      store_id,
      max,
      min,
      type,
      lable,

      enTille,
      arTitle,
      items
    );
  },

  //---------------------------------------------------------------------------------------------------------
  editModifier: async (
    store_id,
    modifier_id,
    max,
    min,
    type,
    lable,
    enTille,
    arTitle
    // items
  ): Promise<void> => {
    await dataEntryrepository.editModifier(
      store_id,
      modifier_id,
      max,
      min,
      type,
      lable,
      enTille,
      arTitle
      //items
    );
  },

  //------------------------------------------------------------------------------------------
  deleteModifier: async (store_id, modifier_id): Promise<void> => {
    await dataEntryrepository.deleteModifier(store_id, modifier_id);
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
    order,
  }: {
    store_id: string;
    ModifierId: string;
    arTitle: string;
    enTitle: string;
    price: any;
    isDefault: any;
    isEnable: any;
    order: number;
  }): Promise<void> => {
    await dataEntryrepository.addModifierItem(
      store_id,
      ModifierId,
      arTitle,
      enTitle,
      price,
      isDefault,
      isEnable,
      order
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
    isEnable,
    order
  ): Promise<void> => {
    await dataEntryrepository.editModifiersItem(
      store_id,
      ModifierId,
      ModifieritemId,
      arTitle,
      enTitle,
      price,
      isDefault,
      isEnable,
      order
    );
  },

  //------------------------------------------------------------------------------------------
  deleteModifierItem: async (
    store_id,
    modifier_id,
    ModifierItemId
  ): Promise<void> => {
    await dataEntryrepository.deleteModifierItem(
      store_id,
      modifier_id,
      ModifierItemId
    );
  },
  //---------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------------------------
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
    await dataEntryrepository.addSize({
      store_id,
      itemId,
      arSize,
      enSize,
      order,
      price,
      calories,
      modifierid,
    });
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
    await dataEntryrepository.editSize(
      store_id,
      sizeId,
      itemId,
      arSize,
      enSize,
      price,
      calories,
      modifierid
    );
  },

  //------------------------------------------------------------------------------------------
  deleteSize: async (store_id, sizeId): Promise<void> => {
    await dataEntryrepository.deleteSize(store_id, sizeId);
  },
  //---------------------------------------------------------------------------------------------------------
addStoreBranch: async ({
  store_namear, store_nameen, orders_type, preparation_time, user_name,
  phone_number, email, full_address, min_order_price, Latitude, longitude,
  logo_image_url, cover_image_url, store_description, platform_commission,
  category_name_id, managerUserName, password, images, tag_name_id, partnerId
}: {
  store_namear: string,
  store_nameen: string,
  orders_type: 'delivery' | 'take_away_and_delivery' | 'take_away' | string,
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
}): Promise<void> => {
  // placeholders مؤقّتاً حتى تفعّل الرفع الفعلي
  const _logo = '/uploads/_mock/logo-placeholder.png';
  const _cover = '/uploads/_mock/cover-placeholder.png';

  await dataEntryrepository.addStoreBranch({
    store_namear,
    store_nameen,
    orders_type,
    preparation_time,
    user_name,
    phone_number,
    email,
    full_address,
    min_order_price,
    Latitude,
    longitude,
    logo_image_url: _logo,
    cover_image_url: _cover,
    store_description,
    platform_commission,
    category_name_id,
    managerUserName,
    password,
    images: images || [],
    tag_name_id: Array.isArray(tag_name_id) ? tag_name_id : [],
    partnerId
  });
},

getCategories: async (): Promise<
    { category_id: string; category_name_ar: string | null; category_name_en: string | null }[]
  > => {
    return await dataEntryrepository.getCategories();
  },

  createCategory: async ({
    category_name_ar,
    category_name_en,
  }: {
    category_name_ar?: string;
    category_name_en?: string;
  }): Promise<void> => {
    await dataEntryrepository.createCategory({
      category_name_ar,
      category_name_en,
    });
  },

  // =========================== TAGS ==========================

  getTags: async (): Promise<
    { tag_id: string; tag_name_ar: string | null; tag_name_en: string | null; category_id: string | null; internal_id: number | null }[]
  > => {
    return await dataEntryrepository.getTags();
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
    await dataEntryrepository.createTag({
      tag_name_ar,
      tag_name_en,
      category_id,
    });
  },
addDriver: async (payload: {
    full_name: string;
    phone_number: string;
    email?: string;
    is_activated: boolean;
    vehicle_type: string; // enum_vehicle_type عندك بالـ DB
    address?: string;
    bank_name?: string;
    iban?: string;
    user_name: string;
    encrypted_password: string;
    documents: { type: DocType; buffer: Buffer }[];
  }) => {
    const driver_id = driversGenerator.getExtraBtuid();

    // ارفع الصور واحصل على أسماء الملفات
    const uploadedDocs: { type: DocType; fileName: string }[] = [];
    for (const d of payload.documents) {
      const fileName = await imageService.processAndUploadImage(d.buffer);
      uploadedDocs.push({ type: d.type, fileName });
    }

    // خزّن السائق
    await dataEntryrepository.insertDriver({
      driver_id,
      full_name: payload.full_name,
      phone_number: payload.phone_number,
      email: payload.email ?? null,
      is_activated: payload.is_activated,
      vehicle_type: payload.vehicle_type,
      address: payload.address ?? null,
      bank_name: payload.bank_name ?? null,
      iban: payload.iban ?? null,
      user_name: payload.user_name,
      encrypted_password: payload.encrypted_password,
    });

    // خزّن صور الوثائق في delivery_document_images
    if (uploadedDocs.length) {
      await dataEntryrepository.insertDriverDocuments(
        driver_id,
        uploadedDocs.map(d => ({
          document_id: documentImagesGenerator.getExtraBtuid(),
          document_description:
            d.type === 'profile' ? 'profile_image' :
            d.type === 'plate' ? 'plate' :
            'driving_license',
          image_url: d.fileName,
          expired: false,
        }))
      );
    }

    return { driver_id, user_name: payload.user_name };
  },

  getDriverDetails: async (driver_id: string) => {
    const base = await dataEntryrepository.getDriverById(driver_id);
    if (!base) return null;

    const images = await dataEntryrepository.getDriverDocuments(driver_id);

    return {
      driver_id: base.driver_id,
      full_name: base.full_name,
      phone_number: base.phone_number,
      email: base.email,
      is_activated: base.is_activated,
      vehicle_type: base.vehicle_type,
      address: base.address,
      bank_name: base.bank_name,
      iban: base.iban,
      user_name: base.user_name,
      images: images.map(img => ({
        document_id: img.document_id,
        document_description: img.document_description,
        image_url: img.image_url,
        uploaded_at: img.uploaded_at,
        expired: img.expired,
      })),
    };
  },
  getDrivers: async (params: GetDriversInput) => {
    const { page, pageSize, q, vehicle_type, is_activated } = params;
    const { rows, total } = await dataEntryrepository.getDrivers({
      page,
      pageSize,
      q,
      vehicle_type,
      is_activated,
    });

    return {
      rows,
      pagination: {
        total,
        page,
        pageSize,
      },
    };
  },
  addTrend: async (payload: {
    store_id: string;
    details: string | null;
    contract_image: string | null;
    from_date: Date | null;
    to_date: Date | null;
    create_at: Date | null;
  }): Promise<void> => {
    await dataEntryrepository.addTrend(payload);
  },

  stopTrend: async (payload: {
    store_id: string;
    details: string | null;
  }): Promise<void> => {
    await dataEntryrepository.stopTrend(payload);
  },
   getStoreTrends: async (store_id: string) => {
    return dataEntryrepository.getStoreTrends(store_id);
  },
};

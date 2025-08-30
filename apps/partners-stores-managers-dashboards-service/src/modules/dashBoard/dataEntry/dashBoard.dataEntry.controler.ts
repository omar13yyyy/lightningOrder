import bcrypt from "bcryptjs";
import { imageService } from "../../../../../image-service/src/image.service";
import { dataEntryService } from "./dashBoard.dataEntry.service";
import { imagesIdGenerator } from "../../../../../../modules/btuid/imagesBtuid";

//------------------------------------------------------------------------------------------

export const dataEntryControler = {
  //------------------------------------------------------------------------------------------
  Login: async (req, res) => {
    const { userName, password } = req.body;
    console.log(userName + "ussssseeeeeeeeeeeerrrrrrrr name");
    try {
      const stats = await dataEntryService.Login(userName, password);

      if (stats != null) {
        return res.status(200).json({
          success: true,
          data: stats,
        });
      } else {
        res
          .status(401)
          .send({ message: "The phone number or password is incorrect." });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  },
  //---------------------------------------------------------------------

  getPartners: async (req, res) => {
    try {
      const { page } = req.query;
      const { pagesize } = req.query || 10;
      const stats = await dataEntryService.getPartners(page, pagesize);

      return res.status(200).json({
        success: true,
        ...stats,
      });
    } catch (error) {
      console.error("Error in partnerInfo:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  //----------------------------------------------------------------------------

  getPartnersForSearch: async (req, res) => {
    try {
      const { partnerName } = req.query;
      const { page } = req.query;
      const { pagesize } = req.query || 10;
      const stats = await dataEntryService.getPartnersForSearch(
        partnerName,
        page,
        pagesize
      );

      return res.status(200).json({
        success: true,
        ...stats,
      });
    } catch (error) {
      console.error("Error in partnerInfo:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  //----------------------------------------------------------------------------

  changeParenterState: async (req, res) => {
    try {
      const { partnerId, state } = req.body;

      const stats = await dataEntryService.changeParenterState(
        partnerId,
        state
      );

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error("Error in partnerInfo:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  getPartner: async (req, res) => {
    try {
      const { partnerId } = req.body;

      const stats = await dataEntryService.getPartner(partnerId);

      return res.status(200).json({
        data: stats,
        success: true,
      });
    } catch (error) {
      console.error("Error in partnerInfo:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  addPartner: async (req, res) => {
    try {
      const {
        partner_name,
        phone_number,
        company_name_ar,
        company_name_en,
        bank_name,
        iban,
        status,
        email,
        password,
        userName,
      } = req.body;

      const stats = await dataEntryService.addPartner(
        partner_name,
        phone_number,
        company_name_ar,
        company_name_en,
        bank_name,
        iban,
        status,
        email,
        password,
        userName
      );

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error("Error in partnerInfo:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  editPartner: async (req, res) => {
    try {
      const {
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
        password,
      } = req.body;

      await dataEntryService.updatePartner(
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
        password
      );

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error in editPartner:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },
  //---------------------------------------------------------------------------------------------------------
  deleteCategory: async (req, res) => {
    try {
      const { store_id, category_id } = req.body;

      await dataEntryService.deleteCategory(
        store_id,

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
  },
  //---------------------------------------------------------------------------------------------------------
  editCategory: async (req, res) => {
    try {
      const { store_id, category_id, name_ar, name_en, order } = req.body;

      await dataEntryService.editCategory(
        store_id,
        category_id,
        name_ar,
        name_en,
        order
      );

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error :", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },
  //------------------------------------------------------------------------------------------
  addCategory: async (req, res) => {
    try {
      const { store_id, name_ar, name_en, order } = req.body;

      await dataEntryService.addCategory(store_id, name_ar, name_en, order);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error :", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },
  //---------------------------------------------------------------------------------------------------------
  deleteItem: async (req, res) => {
    try {
      const { store_id, item_id } = req.body;

      await dataEntryService.deleteItem(store_id, item_id);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error :", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },
  //-----------------------------------------------------------------------------
  addNewItem: async (req, res) => {
    try {
      const imageFile = req.file;
    const image_url = `${imagesIdGenerator.getExtraBtuid()}${imageFile.filename}.jpg`
    imageService.processAndUploadImage(image_url,imageFile.buffer)

      const {
        store_id,
        category_id,
        name_en,
        name_ar,
        description_en,
        description_ar,
        is_best_seller,
        is_activated,
        order,
      } = req.body;

      const allergens = JSON.parse(req.body.allergens);
      const sizes = JSON.parse(req.body.sizes) || {};

      await dataEntryService.addNewItem({
        image_url,
        store_id,
        category_id,
        name_en,
        name_ar,
        description_en,
        description_ar,
        is_best_seller,
        is_activated,
        order: parseInt(order),
        allergens,
        sizes,
        
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error in addNewItem:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },
  //---------------------------------------------------------------------------------------------------------
  EditItem: async (req, res) => {
    try {
      const {
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
      } = req.body;
      const allergens = JSON.parse(req.body.allergens);

      await dataEntryService.EditItem(
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

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error :", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },
  //------------------------------------------------------------------------------------------

  EditItemWithImage: async (req, res) => {
    try {
      //const imageFile = req.file;

      const {
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
      } = req.body;
      const allergens = JSON.parse(req.body.allergens);

      await dataEntryService.EditItemWithImage(
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
        //imageFile?.path || null
      );

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error :", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },
  //---------------------------------------------------------------------------------------------
  addModifier: async (req, res) => {
    try {
      const { store_id, max, min, type, lable, enTille, arTitle } = req.body;
      console.log(
        store_id,
        "<",
        "<",
        max,
        "<",
        min,
        "<",
        type,
        "<",
        lable,
        "<",
        enTille,
        "<",
        arTitle
      );

      const items = JSON.parse(req.body.items);

      await dataEntryService.addModifier(
        store_id,
        max,
        min,
        type,
        lable,

        enTille,
        arTitle,
        items
      );

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error in addModifier:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },

  //-----------------------------------------------------------------------------
  editModifier: async (req, res) => {
    try {
      const { store_id, modifier_id, max, min, type, lable, enTille, arTitle } =
        req.body;
      //const items = JSON.parse(req.body.items);
     console.log(
        store_id,
        "<",
        modifier_id,
        "<",
        max,
        "<",
        min,
        "<",
        type,
        "<",
        lable,
        "<",
        enTille,
        "<",
        arTitle
      );
      await dataEntryService.editModifier(
        store_id,
        modifier_id,
        max,
        min,
        type,
        lable,
        enTille,
        arTitle
        //  items
      );

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error :", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },
  //---------------------------------------------------------------------------------------------------------
  deleteModifier: async (req, res) => {
    try {
      const { store_id, modifier_id } = req.body;

      await dataEntryService.deleteModifier(store_id, modifier_id);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error :", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },
  //-----------------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------
  addModifierItem: async (req, res) => {
    try {
      const {
        store_id,
        ModifierId,
        arTitle,
        enTitle,
        price,
        isDefault,
        isEnable,
        order,
      } = req.body;
     console.log(
        store_id,
        "<",
        ModifierId,
        "<",
        arTitle,
        "<",
        enTitle,
        "<",
        price,
        "<",
        isDefault,
        "<",
        isEnable,
        "<",
        order
      );
      await dataEntryService.addModifierItem({
        store_id,
        ModifierId,
        arTitle,
        enTitle,
        price,
        isDefault,
        isEnable,
        order,
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error :", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },
  //-----------------------------------------------------------------------------
  editModifiersItem: async (req, res) => {
    try {
      const {
        store_id,
        ModifierId,
        ModifieritemId,
        arTitle,
        enTitle,
        price,
        isDefault,
        isEnable,
        order
      } = req.body;
 console.log(
        store_id,
        "<",
        ModifierId,
        "<",
        ModifieritemId,
        "<",
        arTitle,
        "<",
        enTitle,
        "<",
        price,
        "<",
        isDefault,
        "<",
        isEnable,
        "<",
        order
      );
      await dataEntryService.editModifiersItem(
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

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error :", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },
  //---------------------------------------------------------------------------------------------------------
  deleteModifierItem: async (req, res) => {
    try {
      const { store_id, modifier_id, ModifierItemId } = req.body;

      await dataEntryService.deleteModifierItem(
        store_id,
        modifier_id,
        ModifierItemId
      );

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error :", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },
  //--------------------------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------
  addSize: async (req, res) => {
    try {
      const { store_id, itemId, arSize, enSize, price, calories, order } =
        req.body;
      console.log(
        store_id,
        "<",
        "<",
        itemId,
        "<",
        arSize,
        "<",
        enSize,
        "<",
        price,
        "<",
        calories,
        "<",
        order
      );
      const modifierid = JSON.parse(req.body.modifierid);

      await dataEntryService.addSize({
        store_id,
        itemId,
        arSize,
        enSize,
        order,
        price,
        calories,
        modifierid,
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error :", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },
  //-----------------------------------------------------------------------------
  editSize: async (req, res) => {
    try {
      const { store_id, sizeId, itemId, arSize, enSize, price, calories } =
        req.body;
      console.log(
        store_id,
        "<",
        sizeId,
        "<",
        itemId,
        "<",
        arSize,
        "<",
        enSize,
        "<",
        price,
        "<",
        calories
      );

      const modifierid = JSON.parse(req.body.modifierid);

      await dataEntryService.editSize(
        store_id,
        sizeId,
        itemId,
        arSize,
        enSize,
        price,
        calories,
        modifierid
      );

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error :", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },
  //---------------------------------------------------------------------------------------------------------
  deleteSize: async (req, res) => {
    try {
      const { store_id, sizeId } = req.body;

      await dataEntryService.deleteSize(store_id, sizeId);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error :", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },
  //--------------------------------------------------------------------------------------------------------------
//   //---------------------------------------------------------------------------------------------
addStoreBranch: async (req, res) => {
  try {
    const {
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
      // logo_image_url,         // ما رح ناخده من البودي حالياً
      // cover_image_url,        // ما رح ناخده من البودي حالياً
      store_description,
      platform_commission,
      category_name_id,
      managerUserName,
      password,
      images,
      partnerId
    } = req.body;

    // إذا عم توصلك tag_name_id كنص (من الفرونت عم نبعته JSON.stringify)
    const tag_name_id = req.body.tag_name_id ? JSON.parse(req.body.tag_name_id) : [];

    // ---------------------------------------------
    // صور معلّقة (Placeholders) مؤقتاً للتجربة
    // ملاحظة: لما تفعّل الرفع فعلياً، بدّل هالقيم بمسارات الملفات القادمة من multer



    // إذا بدك تعتمد multer لاحقاً:
    const files = req.files 
    const logoFile = files?.logo?.[0];
    const coverFile = files?.cover?.[0];
    const logo_image_url = `${imagesIdGenerator.getExtraBtuid()}${logoFile.filename}.jpg`
    const cover_image_url = `${imagesIdGenerator.getExtraBtuid()}${coverFile.filename}.jpg`
    // ---------------------------------------------
    
    imageService.processAndUploadImage(logo_image_url,req.files?.logo?.[0].buffer)
        imageService.processAndUploadImage(cover_image_url,req.files?.logo?.[0].buffer)


    await dataEntryService.addStoreBranch({
      store_namear,
      store_nameen,
      orders_type,
      preparation_time: Number(preparation_time),
      user_name,
      phone_number,
      email,
      full_address,
      min_order_price: Number(min_order_price),
      Latitude: Number(Latitude),
      longitude: Number(longitude),
      logo_image_url,          // المعلّقات المؤقتة
      cover_image_url,         // المعلّقات المؤقتة
      store_description,
      platform_commission: Number(platform_commission),
      category_name_id,
      managerUserName,
      password,
      tag_name_id: Array.isArray(tag_name_id) ? tag_name_id : [],
      partnerId: partnerId ?? null
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error :", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
},




  getCategories: async (req, res) => {
    try { console.log('helloo')
      const list = await dataEntryService.getCategories();
   return res.status(200).json({
        data: list,
        success: true,
      });    } catch (error) {
      console.error("Error :", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { category_name_ar, category_name_en } = req.body;

      await dataEntryService.createCategory({
        category_name_ar,
        category_name_en,
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error :", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },

  // =========================== TAGS ==========================

  getTags: async (req, res) => {
    try {
      const list = await dataEntryService.getTags();
      console.log(list)
   return res.status(200).json({
        data: list,
        success: true,
      });    } catch (error) {
      console.error("Error :", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },

  createTag: async (req, res) => {
    try {
      const { tag_name_ar, tag_name_en, category_id } = req.body;

      await dataEntryService.createTag({
        tag_name_ar,
        tag_name_en,
        category_id,
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error :", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },

//   //-----------------------------------------------------------------------------
//   editStoreBranch: async (req, res) => {
//     try {
//       const { store_id, sizeId, itemId, arSize, enSize, price, calories } =
//         req.body;
//       console.log(
//         store_id,
//         "<",
//         sizeId,
//         "<",
//         itemId,
//         "<",
//         arSize,
//         "<",
//         enSize,
//         "<",
//         price,
//         "<",
//         calories
//       );

//       const modifierid = JSON.parse(req.body.modifierid);

//       await dataEntryService.editStoreBranch(
//         store_id,
//         sizeId,
//         itemId,
//         arSize,
//         enSize,
//         price,
//         calories,
//         modifierid
//       );

//       return res.status(200).json({ success: true });
//     } catch (error) {
//       console.error("Error :", error);
//       return res.status(500).json({
//         success: false,
//         message: error.message || "Internal server error",
//       });
//     }
//   },
//   //---------------------------------------------------------------------------------------------------------
//   editStoreBranchWithOutImages: async (req, res) => {
//     try {
//       const { store_id, sizeId } = req.body;

//       await dataEntryService.editStoreBranchWithOutImages(store_id, sizeId);

//       return res.status(200).json({ success: true });
//     } catch (error) {
//       console.error("Error :", error);
//       return res.status(500).json({
//         success: false,
//         message: error.message || "Internal server error",
//       });
//     }
//   },
//   //--------------------------------------------------------------------------------------------------------------
addDriver: async (req, res) => {
    try {
      const {
        full_name,
        phone_number,
        email,
        is_activated,
        vehicle_type,
        address,
        bank_name,
        iban,
        password,
        userName,
      } = req.body;

      // الملفات المرفوعة (ندعم الطريقتين)
      const files = req.files as Record<string, Express.Multer.File[] | undefined>;

      // قد تأتي الملفات بأسماء منفصلة
      const driverImageFile = files?.driver_image?.[0];
      const plateImageFile = files?.plate?.[0];
      const licenseImageFile = files?.driving_license_image?.[0];

      // أو مصفوفة عامة تحت images
      const imagesArray = files?.images || [];

      // نبني مصفوفة توحّدية للمعالجة: [type, file]
      type DocType = 'profile' | 'plate' | 'driving_license';
      const collected: Array<{ type: DocType; file: Express.Multer.File }> = [];

      if (driverImageFile) collected.push({ type: 'profile', file: driverImageFile });
      if (plateImageFile) collected.push({ type: 'plate', file: plateImageFile });
      if (licenseImageFile) collected.push({ type: 'driving_license', file: licenseImageFile });

      // لو في images[] بدون أسماء محددة، نحاول نخمّن النوع من الاسم/الوصف/الترتيب
      imagesArray.forEach((f, idx) => {
        const name = (f.originalname || '').toLowerCase();
        const guess: DocType =
          name.includes('plate') ? 'plate' :
          name.includes('license') || name.includes('driving') ? 'driving_license' :
          'profile'; // الافتراضي
        collected.push({ type: guess, file: f });
      });

      // تشفير كلمة السر
      const hashed = await bcrypt.hash(String(password), 10);

      // تمريـر للّير الخدمي
      const result = await dataEntryService.addDriver({
        full_name,
        phone_number,
        email,
        is_activated: String(is_activated).toLowerCase() === 'true',
        vehicle_type,
        address,
        bank_name,
        iban,
        user_name: userName,
        encrypted_password: hashed,
        documents: collected.map(c => ({ type: c.type, buffer: c.file.buffer })),
      });

      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      console.error('addDriver Error:', error);
      return res.status(500).json({ success: false, message: error?.message || 'Internal server error' });
    }
  },

  getDriverDetails: async (req, res) => {
    try {
      const { driverId } = req.query as { driverId?: string };
      if (!driverId) return res.status(400).json({ success: false, message: 'driverId is required' });

      const details = await dataEntryService.getDriverDetails(driverId);
      if (!details) return res.status(404).json({ success: false, message: 'Driver not found' });

      return res.status(200).json({ success: true, data: details });
    } catch (error: any) {
      console.error('getDriverDetails Error:', error);
      return res.status(500).json({ success: false, message: error?.message || 'Internal server error' });
    }
  },
  getDrivers: async (req, res) => {
    try {
      const page = Number(req.query.page ?? 1) || 1;
      const pageSize = Number(req.query.pageSize ?? 20) || 20;

      const q = req.query.q ? String(req.query.q) : undefined;
      const vehicle_type = req.query.vehicle_type ? String(req.query.vehicle_type) : undefined;

      let is_activated: boolean | undefined = undefined;
      if (typeof req.query.is_activated !== 'undefined') {
        const v = String(req.query.is_activated).toLowerCase();
        is_activated = v === 'true' || v === '1';
      }

      const result = await dataEntryService.getDrivers({
        page,
        pageSize,
        q,
        vehicle_type,
        is_activated,
      });
      return res.status(200).json({
        success: true,
        data: result.rows,            // متوافقة مع الفرونت { success, data }
        pagination: result.pagination // ممكن تستخدمها لاحقًا
      });
    } catch (error: any) {
      console.error('Error :', error);
      return res.status(500).json({
        success: false,
        message: error?.message || 'Internal server error',
      });
    }
  },
  // ------- ADD TREND (no images) -------
addTrend: async (req, res) => {
  try {
    const {
      store_id,
      details,
      from_date,
      to_date,
      create_at
    } = req.body as any;

    if (!store_id) {
      return res.status(400).json({ success: false, message: 'store_id مطلوب' });
    }

    // لا صور بعد الآن
    const payload = {
      store_id: String(store_id),
      details: details ?? null,
      contract_image: null, // ثابت null
      from_date: from_date ? new Date(from_date) : null,
      to_date: to_date ? new Date(to_date) : null,
      create_at: create_at ? new Date(create_at) : new Date(),
    };

    await dataEntryService.addTrend(payload);

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error addTrend:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
},


  // ------- STOP TREND -------
  stopTrend: async (req, res) => {
    try {
      const { store_id, details } = req.body as any;
      if (!store_id) {
        return res.status(400).json({ success: false, message: 'store_id مطلوب' });
      }

      await dataEntryService.stopTrend({
        store_id: String(store_id),
        details: details ?? null,
      });

      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Error stopTrend:', error);
      return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  },
   getStoreTrends: async (req, res) => {
    try {
      const { storeId } = req.query as any;
      if (!storeId) {
        return res.status(400).json({ success: false, message: 'storeId مطلوب' });
      }
      const rows = await dataEntryService.getStoreTrends(String(storeId));
            console.log(rows+'lkjhgfdsfghjkl')

      return res.status(200).json({ success: true, data: rows });

    } catch (error: any) {
      console.error('Error getStoreTrends:', error);
      return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  },
getWorkShifts: async (req, res) => {
    try {
      const { storeId } = req.query as any;
      if (!storeId) return res.status(400).json({ success: false, message: 'storeId مطلوب' });

      const data = await dataEntryService.getWorkShifts(String(storeId));
      console.log(data)
      return res.status(200).json({ success: true, data });
    } catch (err: any) {
      console.error('getWorkShifts error:', err);
      return res.status(500).json({ success: false, message: err.message || 'Internal server error' });
    }
  },

  // POST /dataentry/addWorkShift (form-data OR json)
  addWorkShift: async (req, res) => {
    try {
      const {
        store_id,
        day_of_week,
        opening_time,
        closing_time,
      } = (req.body || {});

      if (!store_id || !day_of_week || !opening_time || !closing_time) {
        return res.status(400).json({ success: false, message: 'حقول ناقصة' });
      }

      const { shift_id } = await dataEntryService.addWorkShift({
        store_id,
        day_of_week,
        opening_time,
        closing_time,
      });

      return res.status(200).json({ success: true, data: { shift_id } });
    } catch (err: any) {
      console.error('addWorkShift error:', err);
      return res.status(400).json({ success: false, message: err.message || 'Bad request' });
    }
  },

  // DELETE /dataentry/deleteWorkShift?shiftId=...
  deleteWorkShift: async (req, res) => {
    try {
      const { shiftId } = req.query || {};
      if (!shiftId) return res.status(400).json({ success: false, message: 'shiftId مطلوب' });

      await dataEntryService.deleteWorkShift(Number(shiftId));
      return res.status(200).json({ success: true });
    } catch (err: any) {
      console.error('deleteWorkShift error:', err);
      return res.status(500).json({ success: false, message: err.message || 'Internal server error' });
    }
  },
  // GET /dashBoard/newWithdrawalRequestsPartner
  // GET /dashBoard/newWithdrawalRequestsPartner
  async newWithdrawalRequestsPartner(req, res) {
    try {
      const rows = await dataEntryService.getNewPartnerRequests();
      return res.status(200).json({ success: true, data: rows });
    } catch (e: any) {
      console.error('newWithdrawalRequestsPartner error:', e);
      return res
        .status(500)
        .json({ success: false, message: e?.message || 'Internal error' });
    }
  },

  // GET /dashBoard/waitWithdrawalRequestsPartner
  async waitWithdrawalRequestsPartner(req, res) {
    try {
      const rows = await dataEntryService.getWaitPartnerRequests();
      return res.status(200).json({ success: true, data: rows });
    } catch (e: any) {
      console.error('waitWithdrawalRequestsPartner error:', e);
      return res
        .status(500)
        .json({ success: false, message: e?.message || 'Internal error' });
    }
  },

  // POST /dashBoard/withdrawalRequestsStatusPartner
  // body: x-www-form-urlencoded { WithdrawalId: string }
  async withdrawalRequestsStatusPartner(req, res) {
    try {
      console.log('hhhhhhhhhhhhh')
      const withdrawalId =  req.body?.withdrawalId as string;
            console.log('hhhhhhhhhhhhh',withdrawalId)

      if (!withdrawalId) {
        return res.status(400).json({ success: false, message: 'WithdrawalId مطلوب' });
      }

      const out = await dataEntryService.movePartnerRequestToWaiting(withdrawalId);
      return res.status(200).json({ success: true, ...out });
    } catch (e: any) {
      console.error('withdrawalRequestsStatusPartner error:', e);
      return res
        .status(400)
        .json({ success: false, message: e?.message || 'Bad request' });
    }
  },

  // POST /dashBoard/withdrawalRequestDonePartner
  // يدعم:
  //  - Multipart مع images[] (مرفقات)
  //  - أو body.images كنص/مصفوفة URLs
async withdrawalRequestDonePartner(req, res) {
  try {
    const withdrawalId =
      (req.body?.WithdrawalId || req.body?.withdrawalId) as string;
    const amount = Number(req.body?.amount ?? req.body?.withdrawAmount);
    const notes = req.body?.notes ?? null;

    if (!withdrawalId) {
      return res.status(400).json({ success: false, message: 'WithdrawalId مطلوب' });
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: 'قيمة السحب غير صالحة' });
    }

    // يُفضَّل أخذ partnerId من الـ JWT
    const partnerId = (req as any)?.user?.partner_id ?? req.body?.partnerId;
    if (!partnerId) {
      return res.status(401).json({ success: false, message: 'غير مصرح: partnerId مفقود' });
    }

    // وزّع السحب على متاجر الشريك وسجّل القيود
    await dataEntryService.completePartnerWithdrawal({
      withdrawalId,
      partnerId,
      amount,
      notes,
    });

    // غيّر حالة الطلب إلى done (كما كان)
    await dataEntryService.markPartnerRequestDone(withdrawalId);

    return res.status(200).json({ success: true });
  } catch (e: any) {
    console.error('withdrawalRequestDonePartner error:', e);
    return res
      .status(400)
      .json({ success: false, message: e?.message || 'Bad request' });
  }
},

  // GET /dashBoard/withdrawalRequestsDriver
  async withdrawalRequestsDriver(req, res) {
    try {
      const rows = await dataEntryService.getDriverRequests();
      return res.status(200).json({ success: true, data: rows });
    } catch (e: any) {
      console.error('withdrawalRequestsDriver error:', e);
      return res
        .status(500)
        .json({ success: false, message: e?.message || 'Internal error' });
    }
  },
};
import { dataEntryService } from "./dashBoard.dataEntry.service";

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
      const { store_id, category_id, name_ar, name_en, order } = req.body;

      await dataEntryService.addCategory(
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
      const sizes = JSON.parse(req.body.size);

      await dataEntryService.addNewItem({
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
        image_path: imageFile.path,
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
      const sizes = JSON.parse(req.body.size);

      await dataEntryService.EditItem(
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
      const imageFile = req.file;

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
      const sizes = JSON.parse(req.body.size);

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
        allergens,
        sizes,
        imageFile?.path || null
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
    const modifiers = JSON.parse(req.body.modifiers); // ⬅️ مصفوفة كاملة

    if (!Array.isArray(modifiers)) {
      return res.status(400).json({ success: false, message: "Invalid modifiers format" });
    }

    for (const modifier of modifiers) {
      const {
        store_id,
        max,
        min,
        enTille,
        arTitle,
        items
      } = modifier;

      await dataEntryService.addModifier(
        store_id,
        max,
        min,
        enTille,
        arTitle,
        items
      );
    }

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
      const { store_id, modifier_id, max, min, enTille, arTitle } = req.body;
      const items = JSON.parse(req.body.items);

      await dataEntryService.editModifier(
        store_id,
        modifier_id,
        max,
        min,
        enTille,
        arTitle,
        items
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
      } = req.body;

      await dataEntryService.addModifierItem({
        store_id,
        ModifierId,
        arTitle,
        enTitle,
        price,
        isDefault,
        isEnable
     } );

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
      } = req.body;

      await dataEntryService.editModifiersItem(
        store_id,
        ModifierId,
        ModifieritemId,
        arTitle,
        enTitle,
        price,
        isDefault,
        isEnable
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
      const { store_id, itemId, arSize, enSize, price, calories } = req.body;
      const modifierid = JSON.parse(req.body.modifierid);

      await dataEntryService.addSize({
        store_id,
        itemId,
        arSize,
        enSize,
        price,
        calories,
        modifierid
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
      const { store_id,sizeId, itemId, arSize, enSize, price, calories } = req.body;
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

      await dataEntryService.deleteSize(
        store_id,
       sizeId
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
};

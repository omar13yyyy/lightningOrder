import { dataEntryService } from "./dashBoard.dataEntry.service";


//------------------------------------------------------------------------------------------

export const dataEntryControler = {
  //------------------------------------------------------------------------------------------
 Login: async (req, res) => {
   const { userName, password } = req.body;
 console.log(userName+'ussssseeeeeeeeeeeerrrrrrrr name')
   try {
     const stats = await dataEntryService.Login(userName, password);
 
     if (stats != null) {
         return res.status(200).json({
       success: true,
         data: stats,
       });
     } else {
       res.status(401).send({ message: "The phone number or password is incorrect." });
     }
   } catch (error) {
     console.error("Login error:", error);
     res.status(500).send({ message: "Internal server error" });
   }
 },
 //---------------------------------------------------------------------
 
 
 getPartners: async (req, res) => {
    try {
 const {page} = req.query;
    const {pagesize} = req.query || 10;
      const stats = await dataEntryService.getPartners(page,pagesize);

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
        const {partnerName}=req.query
 const {page} = req.query;
    const {pagesize} = req.query || 10;
      const stats = await dataEntryService.getPartnersForSearch(partnerName,page,pagesize);

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
        const {partnerId,state}=req.body

      const stats = await dataEntryService.changeParenterState(partnerId,state);

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
        const {partnerId}=req.body

      const stats = await dataEntryService.getPartner(partnerId);

      return res.status(200).json({
        data:stats,
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
        const {partner_name,phone_number,company_name_ar,company_name_en,bank_name,iban,status,email,password
,userName}=req.body

      const stats = await dataEntryService.addPartner(partner_name,phone_number,company_name_ar,company_name_en,bank_name,iban,status,email,password
,userName);

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
      password
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
}
,
//---------------------------------------------------------------------------------------------------------
deleteCategory: async (req, res) => {
  try {
    const {
    store_id,  
  category_id
    } = req.body;

    await dataEntryService.deleteCategory(    store_id,  

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
editCategory: async (req, res) => {
  try {
    const {
 store_id, category_id,name_ar,name_en,order
    } = req.body;

    await dataEntryService.editCategory(store_id,
category_id,name_ar,name_en,order
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
addCategory: async (req, res) => {
  try {
    const {
 store_id,name_ar,name_en,order
    } = req.body;

    await dataEntryService.addCategory(
 store_id,name_ar,name_en,order
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
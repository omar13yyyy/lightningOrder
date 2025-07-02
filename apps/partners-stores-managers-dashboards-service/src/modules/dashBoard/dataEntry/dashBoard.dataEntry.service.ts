import { dataEntryrepository } from "./dashBoard.dataEntry.repository";
import bcrypt from "bcryptjs";

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
//------------------------------------------------------------------------------------------

export const dataEntryService = {

//--------------------------------------------------------------------------------
Login: async (
    userName,
    reqPassword
  )=> {
    const result = await dataEntryrepository.fetchIdPasswordByUserName(
      userName
    );
    const { password,  id } = result[0];
    const isMatch = await bcryptjs.compare(reqPassword, password);
    if (isMatch) {
      const token = jwt.sign(
        { admin_id: id  , role: "admin"},
        process.env.TOKEN_SECRET_ADMIN as string
      );
      return {token,
          role: 'admin',
    admin_id: id,}
    }

    return null;
  },

  //------------------------------------------------------------------------------------------
  getPartners: async (
    page: number,
    pagesize:number
 ) => {
        const offset = (page - 1) * pagesize;
   const [rows, total] = await Promise.all([

     dataEntryrepository.getPartners(pagesize,offset),
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
    }
  };
},
//-----------------------------------------------------------------------------------
  getPartnersForSearch: async (
    partnerName:string,
    page: number,
    pagesize:number
 )=> {
        const offset = (page - 1) * pagesize;

          const [rows, total] = await Promise.all([
      dataEntryrepository.getPartnersForSearch(partnerName,pagesize,offset),
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
    }
  };
   },
   //---------------------------------------------------------------------------------
   
  changeParenterState: async (
  partnerId:string,
  state:string
 )=> {
           
    return await dataEntryrepository.changeParenterState(partnerId,state);
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
}
,


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
}
,
//------------------------------------------------------------------------------------------------------------------
deleteCategory: async (
store_id: string,
    category_id: string
  ): Promise<void> => {
    await dataEntryrepository.deleteCategory(store_id, category_id);
  }

,
//------------------------------------------------------------------------------------------------------------------
editCategory: async (
  store_id: string,
category_id:string
,name_ar:string,name_en:string,order:number
): Promise<void> => {
 
  await dataEntryrepository.editCategory(store_id,category_id,name_ar,name_en,order);
}
,
//------------------------------------------------------------------------------------------------------------------------
addCategory: async (
  store_id: string,
name_ar:string,name_en:string,order:number
): Promise<void> => {
 
  await dataEntryrepository.addCategory(store_id,name_ar,name_en,order

  );
}
,
//-------------------------------------------------------------------------------------------------------------------------
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
}

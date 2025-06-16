
import { storesServices } from './stores.service';
import { resolveStoreId } from '../../utils/resolveStoreId';

export const storesController ={


      //------------------------------------------------------------------------------------------
    
    StoreLogin: async (req, res) => {
      const { userName, password } = req.body;
    console.log(userName+'ussssseeeeeeeeeeeerrrrrrrr name')
      try {
        const token = await storesServices.loginService(userName, password);
    
        if (token != null) {
          res.send({
           data:{ token,
            username: userName, 
          }});
        } else {
          res.status(401).send({ message: "The phone number or password is incorrect." });
        }
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    },
    
      //------------------------------------------------------------------------------------------
    changeItemState: async   (req, res)=>{
    const {itemId,state} = req.body; 

   const storeId = resolveStoreId(req);
   console.log(storeId)
       const result = await storesServices.changeItemState(itemId,storeId,state);
    res.send(result)
},
//---------------------------------------------------------------------------------------------------
  changeModifiersItemState: async (req, res) => {
    try {   const storeId = resolveStoreId(req);

      const {  modifiers_item_id, state } = req.query;
      const stats = await storesServices.changeModifierItemState(
        storeId,
        modifiers_item_id,
        state
      );

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error :", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  //-------------------------------------------------------------------------------------------------
    getCategoryTag : async    (req, res)=>{
        const ln = req.query.ln; 
        const categoryId = req.query.categoryId; 
    const result = await storesServices.getCategoryTagsService(ln,categoryId);
        res.send(result)
} ,
getStoreCategories: async   (req, res)=>{
    const ln = req.query.ln; // undefined لأن 'ln' بدون قيمة

    const result = await storesServices.getStoreCategoriesService(ln);
    res.send(result)
}
,
getWorkShifts: async   (req, res)=>{
    const storeId = req.query.storeId; 
    const result = await storesServices.getWorkingHoursServie(storeId);
    res.send(result)
},
getStoreProducts: async   (req, res)=>{
    const ln = req.query.ln; 

   const storeId = resolveStoreId(req);
   console.log(ln,storeId)
       const result = await storesServices.getStoreProductsService(ln,storeId);
    res.send(result)
},
getCouponDetails: async   (req, res)=>{
    const {couponCode,storeId} = req.body

    const result = await storesServices.getCouponDetailsService(couponCode,storeId);
    res.send(result)
}
}
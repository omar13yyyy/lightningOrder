import { Request, Response, NextFunction } from 'express';

import { query } from "../../../../modules/database/commitDashboardSQL";

const checkStoreOwnership = async (req, res, next) => {
  const { storeId } = req.body;
  const {partnerId} = req.body;

  const { rows } = await query(
    'SELECT 1 FROM stores WHERE store_id = $1 AND partner_id = $2',
    [storeId, partnerId]
  );

  if (rows.length === 0) {
    return res.status(403).json({ message: 'غير مصرح لك بتعديل هذا المتجر' });
  }

  next(); 
};

export default checkStoreOwnership;
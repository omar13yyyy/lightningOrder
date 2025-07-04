import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  store_id?: string;
  partner_id?: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const auth = (allowedRoles: string[]) => { 
  return (req: Request, res: Response, next: NextFunction) => {
    console.log('auth middleware')
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'غير مصرح: لا يوجد توكن' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET_ADMIN as string) as JwtPayload;

      if (!decoded.role || !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'غير مصرح: صلاحيات غير كافية' });
      }
console.log(decoded.role);
console.log(decoded.partner_id+'kjhgfdfghjkl,kmnbvgyuikmnbvgbhuikmn');

      (req as any).user = decoded;

      next();
    } catch (err) {
      return res.status(401).json({ message: 'توكن غير صالح أو منتهي' });
    }
  };
};

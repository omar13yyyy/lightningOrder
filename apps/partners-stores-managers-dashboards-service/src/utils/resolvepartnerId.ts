import { Request } from 'express';

export function resolvepartnerId(req: Request): number  {
  const user = req.user as { partner_id?: number; role?: string };

  if (user?.role === 'partner') {
    if (user.partner_id) {
      console.log(user.partner_id + ' << partner_id from resolveStoreId [partner]');
      return user.partner_id;
    } else {
      throw new Error('partner_id is required for partner');
    }
  }

  const partnerId =
    (req.query?.partnerId ) ||
    (req.params?.partnerId ) ||
    (req.body?.partnerId);
      console.log(partnerId+ ' << partner_id from resolveStoreId ');

  // if (!partnerId || typeof partnerId !== 'string')
     if (!partnerId) {
    console.warn('resolveStoreId: partnerId is empty (allowed for non-partner)');
    return undefined;
  }

  return partnerId;
}

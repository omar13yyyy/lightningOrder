import { Request } from 'express';

export function resolveStoreId(req: Request): string  {
  const user = req.user as { store_id?: string; role?: string };

  if (user?.role === 'manager') {
    if (user.store_id) {
      console.log(user.store_id + ' << store_id from resolveStoreId [manager]');
      return user.store_id;
    } else {
      throw new Error('store_id is required for manager');
    }
  }

  const storeId =
    (req.query?.storeId as string) ||
    (req.params?.storeId as string) ||
    (req.body?.storeId as string);

  if (!storeId || typeof storeId !== 'string') {
    console.warn('resolveStoreId: storeId is empty (allowed for non-manager)');
    return undefined;
  }

  return storeId;
}

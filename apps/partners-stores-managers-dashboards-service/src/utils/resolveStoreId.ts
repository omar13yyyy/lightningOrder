import { Request } from 'express';

export function resolveStoreId(req: Request): string {
  const user = req.user as {  store_id?: string };

  if (user.store_id) {
    console.log(user.store_id+'stooooreidfromresolvestoreid')
    return user.store_id;
  }

  const storeId =
    req.query.storeId ||
    req.params.storeId ||
    req.body.storeId;

  if (!storeId || typeof storeId !== 'string') {
    throw new Error('store_id مفقود أو غير صالح');
  }

  return storeId;
}
0
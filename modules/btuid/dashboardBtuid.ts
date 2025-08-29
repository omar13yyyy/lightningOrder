import { BtuidGenerator } from 'btuid';
import path from 'path';

const rootLocation: string = process.env.ROOT_LOCATION || "/home/omar/project3/coding/backend/";

const dashboard :string = "dashboard" 

const partnersFilePath = path.join(rootLocation,"btuidFiles" ,dashboard, 'partners.json');
export const partnersGenerator = new BtuidGenerator({ path: partnersFilePath });

const adminsFilePath = path.join(rootLocation,"btuidFiles" ,dashboard, 'admins.json');
export const adminsGenerator = new BtuidGenerator({ path: adminsFilePath });

const permisionsFilePath = path.join(rootLocation,"btuidFiles" ,dashboard, 'permisions.json');
export const permisionsGenerator = new BtuidGenerator({ path: permisionsFilePath });

const rolesFilePath = path.join(rootLocation,"btuidFiles" ,dashboard, 'roles.json');
export const rolesGenerator = new BtuidGenerator({ path: rolesFilePath });

const rolePermissionFilePath = path.join(rootLocation,"btuidFiles" ,dashboard, 'role_permission.json');
export const rolePermissionGenerator = new BtuidGenerator({ path: rolePermissionFilePath });

const storeTransactionsFilePath = path.join(rootLocation,"btuidFiles" ,dashboard, 'store_transactions.json');
export const storeTransactionsGenerator = new BtuidGenerator({ path: storeTransactionsFilePath });

const tagsFilePath = path.join(rootLocation,"btuidFiles" ,dashboard, 'tags.json');
export const tagsGenerator = new BtuidGenerator({ path: tagsFilePath });

const storesFilePath = path.join(rootLocation,"btuidFiles" ,dashboard, 'stores.json');
export const storesGenerator = new BtuidGenerator({ path: storesFilePath });

const categoryTagsFilePath = path.join(rootLocation,"btuidFiles" ,dashboard, 'category_tags.json');
export const categoryTagsGenerator = new BtuidGenerator({ path: categoryTagsFilePath });

const storeCategoriesFilePath = path.join(rootLocation,"btuidFiles" ,dashboard, 'store_categories.json');
export const storeCategoriesGenerator = new BtuidGenerator({ path: storeCategoriesFilePath });

const productsSoldFilePath = path.join(rootLocation,"btuidFiles" ,dashboard, 'products_sold.json');
export const productsSoldGenerator = new BtuidGenerator({ path: productsSoldFilePath });

const documentImagesFilePath = path.join(rootLocation,"btuidFiles" ,dashboard, 'document_images.json');
export const documentImagesGenerator = new BtuidGenerator({ path: documentImagesFilePath });

const withdrawalDocumentImagesFilePath = path.join(rootLocation,"btuidFiles" ,dashboard, 'withdrawal_document_images.json');
export const withdrawalDocumentImagesGenerator = new BtuidGenerator({ path: withdrawalDocumentImagesFilePath });

const withdrawalRequestsFilePath = path.join(rootLocation,"btuidFiles" ,dashboard, 'withdrawal_requests.json');
export const withdrawalRequestsGenerator = new BtuidGenerator({ path: withdrawalRequestsFilePath });

const productsFilePath = path.join(rootLocation,"btuidFiles" ,dashboard, 'products.json');
export const productsGenerator = new BtuidGenerator({ path: productsFilePath });

const modifiersFilePath = path.join(rootLocation, "dashboard", "btuidFiles", 'modifiers.json');
export const modifiersGenerator = new BtuidGenerator({ path: modifiersFilePath }); 

const modifierItemsFilePath = path.join(rootLocation, "dashboard", "btuidFiles", 'modifier_items.json');
export const modifierItemsGenerator = new BtuidGenerator({ path: modifierItemsFilePath }); 
const sizesFilePath = path.join(rootLocation, "dashboard", "btuidFiles", 'sizes.json');
export const sizesGenerator = new BtuidGenerator({ path: sizesFilePath }); 

const categoriesFilePath = path.join(rootLocation, "dashboard", "btuidFiles", 'categories.json');
export const categoriesGenerator = new BtuidGenerator({ path: categoriesFilePath }); 
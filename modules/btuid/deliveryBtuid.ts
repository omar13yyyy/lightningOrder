import { BtuidGenerator } from 'btuid';
import path from 'path';


const rootLocation: string = process.env.ROOT_LOCATION || "/home/omar/project3/coding/backend/"

const delivery : string = "delivery"
const driversFilePath = path.join(rootLocation, "btuidFiles",delivery
,  'drivers.json');
export const driversGenerator = new BtuidGenerator({ path: driversFilePath });

const deliveryDocumentImagesFilePath = path.join(rootLocation, "btuidFiles",delivery
, 'delivery_document_images.json');
export const deliveryDocumentImagesGenerator = new BtuidGenerator({ path: deliveryDocumentImagesFilePath });

const driverTransactionsFilePath = path.join(rootLocation, "btuidFiles",delivery
,  'driver_transactions.json');
export const driverTransactionsGenerator = new BtuidGenerator({ path: driverTransactionsFilePath });

const driverWalletsPreviousDayFilePath = path.join(rootLocation, "btuidFiles",delivery
,  'driver_wallets_previous_day.json');
export const driverWalletsPreviousDayGenerator = new BtuidGenerator({ path: driverWalletsPreviousDayFilePath });

const trustPointsLogFilePath = path.join(rootLocation, "btuidFiles",delivery
, 'trust_points_log.json');
export const trustPointsLogGenerator = new BtuidGenerator({ path: trustPointsLogFilePath });

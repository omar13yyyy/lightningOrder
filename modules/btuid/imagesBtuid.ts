import { BtuidGenerator } from 'btuid';
import path from 'path';


const rootLocation: string = process.env.ROOT_LOCATION || "E:/lightningOrder/"



const imagesFilePath = path.join(rootLocation, "btuidFiles", 'order.json');
export const imagesIdGenerator = new BtuidGenerator({ path: imagesFilePath });
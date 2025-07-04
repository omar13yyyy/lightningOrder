import { imagesIdGenerator } from "../../../modules/btuid/imagesBtuid";

import sharp from 'sharp';
import {minioService} from './minio.service';

export const imageService = {
    
  compressToTargetSize : async(inputBuffer, maxSizeKB) => {
  let quality = 80;
  let outputBuffer = await sharp(inputBuffer)
    .jpeg({ quality })
    .toBuffer();

  while (outputBuffer.length / 1024 > maxSizeKB && quality > 10) {
    quality -= 5;
    outputBuffer = await sharp(inputBuffer)
      .jpeg({ quality })
      .toBuffer();
  }

  return outputBuffer;
},
processAndUploadImage : async (imageBuffer) => {
  const processedImage = await imageService.compressToTargetSize(imageBuffer,1024)
  console.log("processedImage ",processedImage)
  const fileName = `image-${imagesIdGenerator.getExtraBtuid()}.jpg`;
    console.log("fileName ",fileName)
  await minioService.uploadImage(fileName, processedImage);

  return fileName;
},

getImageStream : async (fileName) => {
  return await minioService.getImageStream(fileName);
},

deleteImage : async (fileName) => {
  await minioService.deleteImage(fileName);
},

updateImage : async (fileName, imageBuffer) => {
  const processedImage =await imageService.compressToTargetSize(imageBuffer,1024)

  await minioService.uploadImage(fileName, processedImage); 
  return fileName;
},
getImageUrl : async (fileName) => {
  return await minioService.getPresignedUrl(fileName);
},
}
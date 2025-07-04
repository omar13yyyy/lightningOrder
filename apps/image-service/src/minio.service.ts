import * as Minio from 'minio'
const endPoint: string =process.env.MINIO_ENDPOINT ||"localhost";
const port: number = parseInt(process.env.MINIO_PORT || '9001');
const accessKey: string = process.env.MINIO_ACCESS_KEY ||"minioadmin"
const secretKey: string = process.env.MINIO_SECRET_KEY ||"minioadmin";

const client = new Minio.Client({
  endPoint: endPoint,
  port: port,
  useSSL: false,
  accessKey: accessKey,
  secretKey: secretKey,
});

const BUCKET_NAME = process.env.MINIO_BUCKET || "images";
export const minioService = {
  ensureBucketExists: async () => {
    const exists = await client.bucketExists(BUCKET_NAME);
    if (!exists) await client.makeBucket(BUCKET_NAME);
  },

  uploadImage: async (fileName, buffer) => {
    await minioService.ensureBucketExists();
    await client.putObject(BUCKET_NAME, fileName, buffer);
  },

  getImageStream: async (fileName) => {
    return await client.getObject(BUCKET_NAME, fileName);
  },

  deleteImage: async (fileName) => {
    await client.removeObject(BUCKET_NAME, fileName);
  },

  getPresignedUrl: async (fileName, expirySeconds = 60*60*24) => {
    return await client.presignedGetObject(
      BUCKET_NAME,
      fileName,
      expirySeconds
    );
  },
};

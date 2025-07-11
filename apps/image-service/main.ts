
import {imageControler} from "./src/image.controler"
import express from 'express';
export const imageTestRouter= express.Router()
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });



imageTestRouter.route('/uploadImage').post(upload.single('image'),imageControler.uploadImage)
imageTestRouter.route('/getImage').get(imageControler.getImage)
imageTestRouter.route('/deleteImage').delete(imageControler.deleteImage)
imageTestRouter.route('/updateImage').put(upload.single('image'),imageControler.updateImage)
imageTestRouter.route('/getPresignedUrl').get(imageControler.getPresignedUrl)
imageTestRouter.route('/getImageUrl').get(imageControler.getImageUrl)


/*
// تأمين كل مسارات المستخدم

// إعادة توجيه إلى خدمة المستخدمين
router.use(
  '/',
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/users': '/' },
  })
);

*/


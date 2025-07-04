import {Router} from 'express';
import {imageTestRouter} from '../../../image-service/main'
// import {userHyperdAuth }from '../middleware/customerHyperdAuth.middleware'
export const imagesRouter = Router();


imagesRouter.use('/images',imageTestRouter); 



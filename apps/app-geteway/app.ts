import express, { Router } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

//import { errorHandler } from './middleware/error.middleware';
import {router} from './src/routes/index'
const app = express();



app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors({ origin: "*", }))
app.use(cors());
app.use('/',router)
// جميع المسارات تحت /api


// المعالجة الموحدة للأخطاء
//app.use(errorHandler);

export default app;
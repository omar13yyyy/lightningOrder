import express, { Router } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
//import  handleOrderEvents from './socket-handlers/order'
//import { errorHandler } from './middleware/error.middleware';
import {router} from './src/routes/index'
export const app = express();

app.use(express.static('public'));
app.use('/images/stores',express.static('images/stores'));
app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors({ origin: "*", }))
app.use(cors());
app.use('/',router)



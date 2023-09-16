import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import router from './router.js';
import payment from './payment.router.js'
import morgan from 'morgan';
import cors from 'cors';

const app = express();

// Configurar CORS
app.use(cors());

app.use(express.json());
app.use(morgan(':method => :url - :status | :res[content-length] - :response-time ms'))
app.use(payment)
app.use(router);

export default app;

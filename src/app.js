import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import router from './router.js';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

// Configurar CORS
app.use(cors());

// Diretório 'uploads' como estático
app.use(express.json());
app.use(morgan(':method => :url - :status | :res[content-length] - :response-time ms'))
app.use(router);

export default app;

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
app.use(express.static('uploads'));
app.use(express.json());
app.use(morgan('common'))
app.use(router);

export default app;

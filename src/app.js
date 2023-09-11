import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import mongoose from 'mongoose';
import router from './router.js';
import morgan from 'morgan';
import cors from 'cors';

const app = express();


// Configurar CORS
app.use(cors());

// Diretório 'uploads' como estático
app.use(express.static('uploads'));
app.use(express.json());

// Conectar-se ao MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Conexão com o MongoDB estabelecida com sucesso.');
    app.use(morgan('common'))
    app.use(router);
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
  });

export default app;

import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import mongoose from 'mongoose';
import router from './router.js';
import morgan from 'morgan';
const app = express();


// Configurar CORS
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

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
    app.use(morgan('dev'))
    app.use(router);
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
  });

export default app;

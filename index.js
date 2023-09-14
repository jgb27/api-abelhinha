import app from "./src/app.js";
import { Client } from './database.js';
import { CREATE_TABLE_PRODUCT, CREATE_TABLE_PRODUCT_USER, CREATE_TABLE_USER } from './src/createTable.js'

const PORT = process.env.PORT || 2727;

Client.connect()
  .then(async () => {
    await Client.query(CREATE_TABLE_USER)
    await Client.query(CREATE_TABLE_PRODUCT)
    await Client.query(CREATE_TABLE_PRODUCT_USER)

    app.listen(PORT, () => {
      console.log(`Banco de dados online: ${process.env.PG_HOST}`);
      console.log(`Servidor online na porta: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar:', error);
  });

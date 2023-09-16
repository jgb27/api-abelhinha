import mercadopago from "mercadopago";
import { Client } from '../../database.js';

export const WebHook = async (req, res) => {
  mercadopago.configure({
    access_token: process.env.TOKEN_MERCADO
  });

  console.log("Checking...");
  const payment = req.query;

  try {
    if (payment.type === 'payment') {
      const { response, body } = await mercadopago.payment.findById(payment['data.id']);
      const { status } = response;
      const id = body.additional_info.items[0].id;
      console.log(body)
      const _id = body.additional_info.items[0].description;

      if (status === "approved") {
        console.log(status);
        console.log(`Inserting ${id} in ${_id}`)
        const query = 'INSERT INTO user_product(user_id, product_id) VALUES ($1, $2);';
        const values = [_id, id];
        const { rowCount } = await Client.query(query, values);
        console.log(rowCount);

        if (rowCount === 0) {
          return res.status(404).send({ message: 'Produto não encontrado' });
        }

        return res.sendStatus(204);
      }
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error", error: error.message });
  }
};

import mercadopago from "mercadopago"
import { Client } from "../../database.js"

export const CreateOrder = async (req, res) => {
  mercadopago.configure({
    access_token: process.env.TOKEN_MERCADO
  })

  const { _id: id, name: title, price, description } = req.body

  const query = 'SELECT _id FROM users WHERE _id = $1;';
  const { rows } = await Client.query(query, [req.user.userId]);
  const user = rows[0];
  const { _id } = user;

  const { body: preferences } = await mercadopago.preferences.create({

    items: [{
      id,
      title,
      unit_price: Number(price),
      category_id: "learnings",
      description: _id,
      quantity: 1,
    }],
    notification_url: "https://9bc5-2804-d45-9775-c500-985a-9047-4586-3fa1.ngrok.io/webhook"
  },)

  const response = {
    clientId: preferences.clientId,
    dateCreated: preferences.date_created,
    item: preferences.items[0],
    checkout: preferences.init_point,
  }

  return res.status(200).send({ response })
}

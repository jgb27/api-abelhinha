import mercadopago from "mercadopago"

export const CreateOrder = async (req, res) => {
  mercadopago.configure({
    access_token: process.env.TOKEN_MERCADO
  })

  const preferences = await mercadopago.preferences.create({
    items: [{
      title: "Colorindo a vida",
      unit_price: 50.99,
      category_id: "learnings",
      description: "Colorindo a vida toda",
      quantity: 1,
      picture_url: "https://abelhinha-bucket.s3.sa-east-1.amazonaws.com/image/development/77f6a477d686138a360538f82784de68.jpeg"
    }],
    back_urls: {
      success: "http://localhost:2727/success",
      failure: "http://localhost:2727/failure",
      pending: "http://localhot:2727/pending"
    },
    notification_url: ""
  })

  return res.status(200).send({ preferences })
}

export const WebHook = (req, res) => {
  console.log(req.quer)

  return res.status(200).send("WebHook")
}

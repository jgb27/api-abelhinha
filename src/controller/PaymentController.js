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
    notification_url: "https://f209-2804-d45-9775-c500-985a-9047-4586-3fa1.ngrok.io/webhook"
  })

  return res.status(200).send({ preferences: preferences.body })
}

export const WebHook = async (req, res) => {
  const payment = req.query;
  console.log("Bruto: " + payment)
  try {
    if (payment.type === 'payment') {
      console.log(payment['data.id'])
      const data = await mercadopago.payment.findById(payment['data.id'])
      console.log(data)
      const paymentData = {
        product: [{

        }]
      }
    }
    return res.status(204).send("WebHook")
  } catch (error) {
    return res.status(500).send({ message: "Internal server error", error: error.message })
  }
}

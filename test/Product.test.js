import app from "../src/app.js";
import request from "supertest";

const CreateProduct = async () => {
  const product = {
    image: "/src/assets/abelhinha_construtora.svg",
    title: "Atividades do test",
    price: 30.00,
    tags: ["Atividades", "Imprimir"],
    url: "https://www.github.com/jgbispo",
    description: "Um belo produto para sua criança brincar e se divertir"
  };

  const response = await request(app)
    .post("/product")
    .send(product);

  return response.body.product.id
}

describe("Testando as requisições com sucesso referente ao produto", () => {
  const path = "/product"

  it("Deve retornar todos os produtos com sucesso", async () => {
    const response = await request(app)
      .get(path);

    expect(response.statusCode).toBe(200);
  });

  it("Deve adicionar um novo produto com sucesso", async () => {
    const response = await request(app)
      .post(path)
      .send(
        {
          "title": "Atividades do Test",
          "image": "/src/assets/abelhinha_construtora.svg",
          "price": 30.00,
          "tags": ["Atividades", "Imprimir"],
          "url": "https://www.github.com/jgbispo2",
          "description": "Um belo produto para sua criança brincar e se divertir"
        }
      )
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Produto registrado com sucesso')
    expect(response.body.product.title).toBe('Atividades do Test')
  });

  it('Deve deletar conta com sucesso', async () => {
    const product = await CreateProduct()
    const response = await request(app)
      .delete(`${path}/${product}`)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Produto excluído com sucesso')
  })
});

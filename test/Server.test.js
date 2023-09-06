import app from "../src/app.js";
import request from "supertest";

describe("Testando o servidor", () => {
  it("Deve iniciar o servidor e responder com 200 OK", async () => {
    const response = await request(app).get("/listAllProduct");
    expect(response.statusCode).toBe(200);
  });
});

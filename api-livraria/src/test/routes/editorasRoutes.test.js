import { afterEach, beforeEach, describe } from "@jest/globals";
import app from "../../app.js";
import request from "supertest";

let server;
beforeEach(() => {
  const port = 3001;
  server = app.listen(port);
});

afterEach(() => {
  server.close();
});

describe("GET em /editoras", () => {
  it("Deve retornar uma lista de editoras", async () => {
    const resposta = await request(app)
      .get("/editoras")
      .set("Accept", "application/json")
      .expect("content-type", /json/)
      .expect(200);

    expect(resposta.body[0].email).toEqual("e@e.com");
  });
});

let idResposta;
describe("POST em /editoras", () => {
  it("Deve adicionar uma nova editora", async () => {
    const resposta = await request(app)
      .post("/editoras")
      .send({ nome: "Scorax", cidade: "Lisboa", email: "scorax@e.com" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201);
    idResposta = resposta.body.content.id;
  });

  it("Deve não adicionar nada ao passar o body vazio", async () => {
    await request(app).post("/editoras").send({}).expect(400);
  });
});

describe("GET em /editoras/id", () => {
  it("Deve retornar o recurso selecionado", async () => {
    await request(app).get(`/editoras/${idResposta}`).expect(200);
  });
});

describe("PUT em /editoras/id", () => {
  test.each([
    ["nome", { nome: "Coletivo Scorax" }],
    ["cidade", { cidade: "SP" }],
    ["email", { email: "cs@cs.com" }],
  ])("Deve alterar o campo %s", async (chave, param) => {
    await request(app)
    .put(`/editoras/${idResposta}`)
    .send(param)
    .expect(204);
  });
});

describe("DELETE em /editoras/id", () => {
  it("Deve deletar o recurso adicionado", async () => {
    await request(app).delete(`/editoras/${idResposta}`).expect(200);
  });
});

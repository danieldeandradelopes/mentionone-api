import JsonWebTokenAdapter from "../../../infra/JwtAssign/JsonWebTokenAdapter";

describe("Testa JsonWebTokenAdapter", () => {
  test("Deve ser possível gerar um novo token", () => {
    const jsonWebTokenAdapter = new JsonWebTokenAdapter();

    const token = jsonWebTokenAdapter.generate({ id: 1 });

    expect(token).toBeTruthy();
  });

  test("Deve ser possível validar um token", () => {
    const jsonWebTokenAdapter = new JsonWebTokenAdapter();

    const newToken = jsonWebTokenAdapter.generate({ id: 1 });

    const tokenIsValid = jsonWebTokenAdapter.verify(newToken);

    expect(tokenIsValid).toBeTruthy();
  });

  test("Deve retornar false quando um token for inválido", () => {
    const jsonWebTokenAdapter = new JsonWebTokenAdapter();

    const tokenIsValid = jsonWebTokenAdapter.verify(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTA3OTUxOTksImRhdGEiOnsiaWQiOjF9LCJpYXQiOjE3MTA3OTE1OTl9.05ddUZSjIuIGvMr_iUXzGqdzz2kW1ptY3BApCqW3z5Ms"
    );

    expect(tokenIsValid).toBeFalsy();
  });
});

import BCryptAdapter from "../../../infra/Encrypt/BCryptAdapter";

describe("Testa o adapter BCryptAdapter", () => {
  test("Deve ser possível encriptar uma string", async () => {
    const bcryptAdapter = new BCryptAdapter();

    const hash = await bcryptAdapter.encrypt("daniel");

    expect(hash).not.toBe("daniel");
  });

  test("Deve ser possível comparar um hash com uma string", async () => {
    const bcryptAdapter = new BCryptAdapter();

    const result = await bcryptAdapter.compareValue(
      "daniel",
      "$2b$10$vab2.42p9cHoRiWdovkREuePlAKKadop8ER8g4cT1d/Bdv3rGt08q"
    );

    expect(result).toBeTruthy();
  });

  test("Deve lidar com erros ao tentar comparar um hash inválido", async () => {
    const bcryptAdapter = new BCryptAdapter();

    const result = await bcryptAdapter.compareValue(
      "daniel2",
      "$2b$10$vab2.42p9cHoRiWdovkREuePlAKKadop8ER8g4cT1d/Bdv3rGt08q"
    );

    expect(result).toBeFalsy();
  });
});

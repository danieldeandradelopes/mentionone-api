import InMemoryUserGateway from "../../../gateway/UserGateway/InMemoryUserGateway";
import JsonWebTokenAdapter from "../../../infra/JwtAssign/JsonWebTokenAdapter";

describe("Testa o InMemroyUserGateway", () => {
  test("Deve ter uma lista vazia de users", async () => {
    const inMemoryUserGateway = new InMemoryUserGateway(
      [],
      new JsonWebTokenAdapter()
    );

    expect(await inMemoryUserGateway.getUsers()).toHaveLength(0);
  });

  test("Deve adicionar 3 users", async () => {
    const inMemoryUserGateway = new InMemoryUserGateway(
      [],
      new JsonWebTokenAdapter()
    );

    await inMemoryUserGateway.addUser("Daniel", "daniel@gmail.com", "123456");
    await inMemoryUserGateway.addUser("Maria", "maria@gmail.com", "123456");
    await inMemoryUserGateway.addUser("José", "jose@gmail.com", "123456");

    expect(await inMemoryUserGateway.getUsers()).toHaveLength(3);
  });

  test("Deve remover um usuário da lista", async () => {
    const inMemoryUserGateway = new InMemoryUserGateway(
      [],
      new JsonWebTokenAdapter()
    );

    await inMemoryUserGateway.addUser("Daniel", "daniel@gmail.com", "123456");
    await inMemoryUserGateway.addUser("Maria", "maria@gmail.com", "123456");
    await inMemoryUserGateway.addUser("José", "jose@gmail.com", "123456");
    await inMemoryUserGateway.removeUser(1);

    expect(await inMemoryUserGateway.getUsers()).toHaveLength(2);
  });

  test("Deve lidar com erros quando um usuário não é encontrado para excluir", async () => {
    try {
      const inMemoryUserGateway = new InMemoryUserGateway(
        [],
        new JsonWebTokenAdapter()
      );

      await inMemoryUserGateway.addUser("Daniel", "daniel@gmail.com", "123456");
      await inMemoryUserGateway.addUser("Maria", "maria@gmail.com", "123456");
      await inMemoryUserGateway.addUser("José", "jose@gmail.com", "123456");
      await inMemoryUserGateway.removeUser(5);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("User not found");
      }
    }
  });

  test("Deve adicionar 1 usuário na lista", async () => {
    const inMemoryUserGateway = new InMemoryUserGateway(
      [],
      new JsonWebTokenAdapter()
    );

    await inMemoryUserGateway.addUser("Daniel", "daniel@gmail.com", "123456");

    expect((await inMemoryUserGateway.getUser(1)).name).toBe("Daniel");
  });

  test("Deve atualizar um usuário na lista", async () => {
    const inMemoryUserGateway = new InMemoryUserGateway(
      [],
      new JsonWebTokenAdapter()
    );

    await inMemoryUserGateway.addUser("Daniel", "daniel@gmail.com", "123456");
    expect((await inMemoryUserGateway.getUser(1)).name).toBe("Daniel");

    await inMemoryUserGateway.updateUser({
      id: 1,
      name: "Daniel Lopes",
      access_level: "admin",
      avatar: "",
      email: "daniel2@gmail.com",
      phone: "11111111111",
      statusPayment: "",
      password: "",
    });

    expect((await inMemoryUserGateway.getUser(1)).name).toBe("Daniel Lopes");
    expect((await inMemoryUserGateway.getUser(1)).email).toBe(
      "daniel2@gmail.com"
    );

    expect((await inMemoryUserGateway.getUser(1)).phone).toBe("11111111111");
  });

  test("Deve validar um usuário não encontrado ao tentar listar", async () => {
    const inMemoryUserGateway = new InMemoryUserGateway(
      [],
      new JsonWebTokenAdapter()
    );

    await inMemoryUserGateway.addUser("Daniel", "daniel@gmail.com", "123456");
    expect(async () => await inMemoryUserGateway.getUser(2)).rejects.toThrow(
      new Error("User not found")
    );
  });

  test("Deve validar um usuário não encontrado ao tentar atualizar", async () => {
    const inMemoryUserGateway = new InMemoryUserGateway(
      [],
      new JsonWebTokenAdapter()
    );

    await inMemoryUserGateway.addUser("Daniel", "daniel@gmail.com", "123456");

    expect(
      async () =>
        await inMemoryUserGateway.updateUser({
          id: 2,
          access_level: "",
          avatar: "",
          email: "daniel2@gamil.com",
          name: "",
          phone: "",
          statusPayment: "",
          created_at: "",
          password: "",
          updated_at: "",
        })
    ).rejects.toThrow(new Error("User not found"));
  });
});

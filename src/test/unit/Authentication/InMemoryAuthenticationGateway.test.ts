import User from "../../../entities/User";
import InMemoryAuthenticationGateway from "../../../gateway/AuthenticationGateway/InMemoryAuthenticationGateway";

describe("Testa o InMemoryAuthenticationGateway", () => {
  const usersList: User[] = [
    {
      id: 1,
      name: "Daniel 2",
      email: "daniel@gmail.com",
      password: "123456",
      access_level: "student",
      avatar: "",
      phone: "",
      created_at: "2024-03-16 15:51:43.414 -0300",
      updated_at: "2024-03-16 15:51:43.414 -0300",
      statusPayment: "free",
    },
    {
      id: 2,
      name: "Pedro",
      email: "pedro@gmail.com",
      password: "123456",
      access_level: "student",
      avatar: "",
      phone: "",
      created_at: "2024-03-16 15:51:43.414 -0300",
      updated_at: "2024-03-16 15:51:43.414 -0300",
      statusPayment: "free",
    },
  ];

  test("Deve fazer login com um usuário existente", async () => {
    const inMemoryUserGateway = new InMemoryAuthenticationGateway([
      ...usersList,
    ]);

    const response = await inMemoryUserGateway.makeLogin(
      "daniel@gmail.com",
      "123456"
    );

    expect(response).toHaveProperty("user");
    expect(response).toHaveProperty("token");

    expect(response.token).toBe("novotoken");
  });

  test("Deve validar um usuário não encontrado ao tentar atualizar", async () => {
    const inMemoryUserGateway = new InMemoryAuthenticationGateway([
      ...usersList,
    ]);

    await expect(
      async () =>
        await inMemoryUserGateway.makeLogin("daniel@gmail.com", "1234567")
    ).rejects.toThrow(new Error("Failed to make login"));
  });
});

import AuthenticationController from "../../../controllers/AuthenticationController";
import UserController from "../../../controllers/UserController";
import InMemoryAuthenticationGateway from "../../../gateway/AuthenticationGateway/InMemoryAuthenticationGateway";
import InMemoryUserGateway from "../../../gateway/UserGateway/InMemoryUserGateway";

describe("Testa o UserController", () => {
  test("Deve realizar login com um usuário válido", async () => {
    const authenticationController = new AuthenticationController(
      new InMemoryAuthenticationGateway([
        {
          id: 1,
          name: "Daniel",
          access_level: "admin",
          avatar: "",
          email: "daniel@gmail.com",
          phone: "",
          statusPayment: "",
          password: "123456",
        },
        {
          id: 2,
          name: "Maria",
          access_level: "student",
          avatar: "",
          email: "maria@gmail.com",
          phone: "",
          statusPayment: "",
          password: "123456",
        },
      ])
    );

    const response = await authenticationController.makeLogin({
      email: "daniel@gmail.com",
      password: "123456",
    });
    expect(response.user.name).toBe("Daniel");
  });

  test("Deve lidar com erros ao tentar efetuar login com dados inválidos", async () => {
    const authenticationController = new AuthenticationController(
      new InMemoryAuthenticationGateway([
        {
          id: 1,
          name: "Daniel",
          access_level: "admin",
          avatar: "",
          email: "daniel@gmail.com",
          phone: "",
          statusPayment: "",
          password: "123456",
        },
        {
          id: 2,
          name: "Maria",
          access_level: "student",
          avatar: "",
          email: "maria@gmail.com",
          phone: "",
          statusPayment: "",
          password: "123456",
        },
      ])
    );

    expect(
      async () =>
        await authenticationController.makeLogin({
          email: "daniel@gmail.com",
          password: "1234568",
        })
    ).rejects.toThrow(new Error("Failed to make login"));
  });
});

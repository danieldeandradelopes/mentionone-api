import UserController from "../../../controllers/UserController";
import InMemoryUserGateway from "../../../gateway/UserGateway/InMemoryUserGateway";
import JsonWebTokenAdapter from "../../../infra/JwtAssign/JsonWebTokenAdapter";

describe("Testa o UserController", () => {
  test("Deve trazer uma lista vazia de usuários", async () => {
    const usersController = new UserController(
      new InMemoryUserGateway([], new JsonWebTokenAdapter())
    );

    const usersList = await usersController.list();

    expect(usersList).toHaveLength(0);
  });

  test("Deve trazer uma lista com 2 usuários", async () => {
    const usersController = new UserController(
      new InMemoryUserGateway(
        [
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
        ],
        new JsonWebTokenAdapter()
      )
    );

    const usersList = await usersController.list();

    expect(usersList).toHaveLength(2);
  });

  test("Deve deve encontrar um usuário existente na listasgem", async () => {
    const usersController = new UserController(
      new InMemoryUserGateway(
        [
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
        ],
        new JsonWebTokenAdapter()
      )
    );

    const user = await usersController.get(1);

    expect(user.name).toBe("Daniel");
  });

  test("Deve lidar com erros ao não encontrar um usuário", async () => {
    try {
      const usersController = new UserController(
        new InMemoryUserGateway(
          [
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
          ],
          new JsonWebTokenAdapter()
        )
      );

      await usersController.get(3);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("User not found");
      }
    }
  });

  test("Deve atualizar um usuário", async () => {
    const usersController = new UserController(
      new InMemoryUserGateway(
        [
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
        ],
        new JsonWebTokenAdapter()
      )
    );

    const updatedUser = await usersController.update({
      id: 1,
      name: "Danilo",
      access_level: "",
      avatar: "",
      email: "",
      phone: "",
      statusPayment: "",
      password: "",
    });

    expect(updatedUser.name).toBe("Danilo");
  });

  test("Deve lidar com erros ao tentar atualizar um usuário", async () => {
    try {
      const usersController = new UserController(
        new InMemoryUserGateway(
          [
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
          ],
          new JsonWebTokenAdapter()
        )
      );

      await usersController.update({
        id: 3,
        name: "Pedro",
        access_level: "",
        avatar: "",
        email: "",
        phone: "",
        statusPayment: "",
        password: "",
      });
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("User not found");
      }
    }
  });

  test("Deve remover um usuário da lista", async () => {
    const usersController = new UserController(
      new InMemoryUserGateway(
        [
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
        ],
        new JsonWebTokenAdapter()
      )
    );

    expect(await usersController.list()).toHaveLength(2);
    await usersController.destroy(2);

    expect(await usersController.list()).toHaveLength(1);
  });

  test("Deve lidar com erros ao tentar excluir um usuário inexistente", async () => {
    try {
      const usersController = new UserController(
        new InMemoryUserGateway(
          [
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
          ],
          new JsonWebTokenAdapter()
        )
      );

      await usersController.destroy(3);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("User not found");
      }
    }
  });

  test("Deve ser possível adicionar dois novos usuários", async () => {
    const usersController = new UserController(
      new InMemoryUserGateway([], new JsonWebTokenAdapter())
    );

    expect(await usersController.list()).toHaveLength(0);

    const newUser1 = await usersController.store({
      email: "pedro@gmail.com",
      name: "Pedro",
      password: "123456",
    });
    const newUser2 = await usersController.store({
      email: "paulo@gmail.com",
      name: "Paulo",
      password: "123456",
    });

    expect(newUser1.user.name).toBe("Pedro");
    expect(newUser2.user.name).toBe("Paulo");
    expect(await usersController.list()).toHaveLength(2);
  });
});

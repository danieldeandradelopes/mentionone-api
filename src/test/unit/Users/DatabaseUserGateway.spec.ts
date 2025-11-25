import KnexUserGateway from "../../../gateway/UserGateway/KnexUserGateway";
import IUserGateway from "../../../gateway/UserGateway/IUserGateway";
import { Registry, container } from "../../../infra/ContainerRegistry";
import knex from "knex";
import BCryptAdapter from "../../../infra/Encrypt/BCryptAdapter";
import JsonWebTokenAdapter from "../../../infra/JwtAssign/JsonWebTokenAdapter";

describe("Testa o DatabaseUserGateway", () => {
  let connection: any;

  beforeEach(async () => {
    connection = knex({
      client: "postgres",
      connection: {
        host: "localhost",
        port: 5436,
        user: "postgres",
        password: "example",
        database: "postgres",
      },
    });
    await connection.schema.dropTableIfExists("users");
    await connection.schema.createTable("users", function (table: any) {
      table.increments("id");
      table.string("name", 40).notNullable();
      table.string("email", 100).notNullable().unique();
      table.string("password").notNullable();
      table.string("access_level").notNullable().defaultTo("student");
      table.string("avatar");
      table.string("phone");
      table.string("statusPayment").notNullable().defaultTo("free");
      table.timestamps(true, true);
    });
    container.rebind(Registry.UserGateway).toDynamicValue(() => {
      return new KnexUserGateway(
        connection,
        new BCryptAdapter(),
        new JsonWebTokenAdapter()
      );
    });
  });

  afterEach(async () => {
    await connection.schema.dropTableIfExists("users");
  });

  test("Deve ter uma lista vazia de users", async () => {
    const databaseUserGateway = container.get<IUserGateway>(
      Registry.UserGateway
    );

    expect(await databaseUserGateway.getUsers()).toHaveLength(0);
  });

  test("Deve adicionar 3 users", async () => {
    const databaseUserGateway = container.get<IUserGateway>(
      Registry.UserGateway
    );

    await databaseUserGateway.addUser("Daniel", "daniel@gmail.com", "123456");
    await databaseUserGateway.addUser("Maria", "maria@gmail.com", "123456");
    await databaseUserGateway.addUser("José", "jose@gmail.com", "123456");

    expect(await databaseUserGateway.getUsers()).toHaveLength(3);
  });

  test("Deve remover um usuário da lista", async () => {
    const databaseUserGateway = container.get<IUserGateway>(
      Registry.UserGateway
    );

    await databaseUserGateway.addUser("Daniel", "daniel@gmail.com", "123456");
    await databaseUserGateway.addUser("Maria", "maria@gmail.com", "123456");
    await databaseUserGateway.addUser("José", "jose@gmail.com", "123456");
    await databaseUserGateway.removeUser(1);

    expect(await databaseUserGateway.getUsers()).toHaveLength(2);
  });

  test("Deve lidar com erros quando um usuário não é encontrado para excluir", async () => {
    try {
      const databaseUserGateway = container.get<IUserGateway>(
        Registry.UserGateway
      );
      await databaseUserGateway.addUser("Daniel", "daniel@gmail.com", "123456");
      await databaseUserGateway.addUser("Maria", "maria@gmail.com", "123456");
      await databaseUserGateway.addUser("José", "jose@gmail.com", "123456");
      await databaseUserGateway.removeUser(5);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("User not found");
      }
    }
  });

  test("Deve adicionar 1 usuário na lista", async () => {
    const databaseUserGateway = container.get<IUserGateway>(
      Registry.UserGateway
    );

    await databaseUserGateway.addUser("Daniel", "daniel@gmail.com", "123456");

    expect((await databaseUserGateway.getUser(1)).name).toBe("Daniel");
  });

  test("Deve atualizar um usuário na lista", async () => {
    const databaseUserGateway = container.get<IUserGateway>(
      Registry.UserGateway
    );

    await databaseUserGateway.addUser("Daniel", "daniel@gmail.com", "123456");
    expect((await databaseUserGateway.getUser(1)).name).toBe("Daniel");

    await databaseUserGateway.updateUser({
      id: 1,
      name: "Daniel Lopes",
      access_level: "admin",
      avatar: "",
      email: "daniel2@gmail.com",
      phone: "11111111111",
      statusPayment: "",
      password: "",
    });

    expect((await databaseUserGateway.getUser(1)).name).toBe("Daniel Lopes");
    expect((await databaseUserGateway.getUser(1)).email).toBe(
      "daniel2@gmail.com"
    );

    expect((await databaseUserGateway.getUser(1)).phone).toBe("11111111111");
  });

  test("Deve validar um usuário não encontrado ao tentar listar", async () => {
    const databaseUserGateway = container.get<IUserGateway>(
      Registry.UserGateway
    );

    await databaseUserGateway.addUser("Daniel", "daniel@gmail.com", "123456");
    expect(async () => await databaseUserGateway.getUser(2)).rejects.toThrow(
      new Error("User not found")
    );
  });

  test("Deve validar um usuário não encontrado ao tentar atualizar", async () => {
    const databaseUserGateway = container.get<IUserGateway>(
      Registry.UserGateway
    );

    await databaseUserGateway.addUser("Daniel", "daniel@gmail.com", "123456");

    expect(
      async () =>
        await databaseUserGateway.updateUser({
          id: 2,
          access_level: "",
          avatar: "",
          email: "",
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

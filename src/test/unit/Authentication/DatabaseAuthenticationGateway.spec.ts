import knex from "knex";
import IAuthenticationGateway from "../../../gateway/AuthenticationGateway/IAuthenticationGateway";
import KnexUserGateway from "../../../gateway/UserGateway/KnexUserGateway";
import { Registry, container } from "../../../infra/ContainerRegistry";
import BCryptAdapter from "../../../infra/Encrypt/BCryptAdapter";
import KnexAuthenticationGateway from "../../../gateway/AuthenticationGateway/KnexAuthenticationGateway";
import JsonWebTokenAdapter from "../../../infra/JwtAssign/JsonWebTokenAdapter";

describe("Testa o DatabaseAuthenticationGateway", () => {
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
    await connection.schema.dropTableIfExists("barbers");
    await connection.schema.dropTableIfExists("Enterprise");

    await connection.schema.createTable("users", function (table: any) {
      table.increments("id");
      table.string("name", 40).notNullable();
      table.string("email", 100).notNullable().unique();
      table.string("password").notNullable();
      table.string("access_level").notNullable().defaultTo("barber");
      table.string("avatar");
      table.string("phone");
      table.timestamps(true, true);
    });

    await connection.schema.createTable("Enterprise", function (table: any) {
      table.increments("id");
      table.string("name", 40).notNullable();
      table.string("cover");
      table.string("address");
      table.string("description");
      table.string("statusPayment");
      table.timestamps(true, true);
    });

    await connection.schema.createTable("barbers", function (table: any) {
      table.increments("id");
      table.integer("user_id").references("id").inTable("users").notNullable();
      table
        .integer("enterprise_id")
        .references("id")
        .inTable("Enterprise")
        .notNullable();
      table.string("specialties");
      table.text("bio");
      table.decimal("rate", 3, 2).defaultTo(0);
      table.boolean("is_active").defaultTo(true);
      table.timestamps(true, true);
      table.unique(["user_id", "enterprise_id"]);
    });

    await connection("users").insert([
      {
        id: 1,
        name: "Daniel 2",
        email: "daniel@gmail.com",
        password:
          "$2b$10$XNF5/NoXlG.HuQ4q0HaIDOP2fVNe/o8VQDiMfw6NhFtPJDpbQGe7G",
        access_level: "student",
        avatar: "",
        phone: "",
        created_at: "2024-03-16 15:51:43.414 -0300",
        updated_at: "2024-03-16 15:51:43.414 -0300",
      },
      {
        id: 2,
        name: "Pedro",
        email: "pedro@gmail.com",
        password:
          "$2b$10$XNF5/NoXlG.HuQ4q0HaIDOP2fVNe/o8VQDiMfw6NhFtPJDpbQGe7G",
        access_level: "student",
        avatar: "",
        phone: "",
        created_at: "2024-03-16 15:51:43.414 -0300",
        updated_at: "2024-03-16 15:51:43.414 -0300",
      },

      {
        id: 3,
        name: "Camila",
        email: "camila@gmail.com",
        password:
          "$2b$10$XNF5/NoXlG.HuQ4q0HaIDOP2fVNe/o8VQDiMfw6NhFtPJDpbQGe7G",
        access_level: "student",
        avatar: "",
        phone: "",
        created_at: "2024-03-16 15:51:43.414 -0300",
        updated_at: "2024-03-16 15:51:43.414 -0300",
      },
    ]);

    container.rebind(Registry.AuthenticationGateway).toDynamicValue(() => {
      return new KnexAuthenticationGateway(
        connection,
        new JsonWebTokenAdapter(),
        new BCryptAdapter(),
        new KnexUserGateway(
          connection,
          new BCryptAdapter(),
          new JsonWebTokenAdapter()
        )
      );
    });
  });

  afterEach(async () => {
    await connection.schema.dropTableIfExists("users");
    await connection.schema.dropTableIfExists("barbers");
    await connection.schema.dropTableIfExists("Enterprise");
  });

  test("Deve efetuar login com sucesso e retornar informações da barbearia para barbeiro", async () => {
    const bcrypt = new BCryptAdapter();
    const password = await bcrypt.encrypt("123456");

    const enterpriseId = await connection("Enterprise")
      .insert({
        name: "Barbearia Teste",
        cover: "cover.jpg",
        address: "Rua Teste",
        description: "Descrição teste",
        statusPayment: "active",
      })
      .returning("id");

    const userId = await connection("users")
      .insert({
        name: "Daniel",
        email: "daniel@gmail.com",
        password: password,
        access_level: "barber",
        phone: "123456789",
      })
      .returning("id");

    await connection("barbers").insert({
      user_id: userId[0].id,
      enterprise_id: enterpriseId[0].id,
      specialties: "Corte de cabelo",
      bio: "Barbeiro profissional",
      rate: 4.5,
    });

    const authenticationUserGateway = container.get<IAuthenticationGateway>(
      Registry.AuthenticationGateway
    );

    const result = await authenticationUserGateway.makeLogin(
      "daniel@gmail.com",
      "123456"
    );

    expect(result.user.email).toBe("daniel@gmail.com");
    expect(result.Enterprise).toBeDefined();
  });

  test("Deve efetuar login com sucesso e não retornar informações da barbearia para cliente", async () => {
    const bcrypt = new BCryptAdapter();
    const password = await bcrypt.encrypt("123456");

    await connection("users").insert({
      name: "Cliente",
      email: "cliente@gmail.com",
      password: password,
      access_level: "client",
      phone: "123456789",
    });

    const authenticationUserGateway = container.get<IAuthenticationGateway>(
      Registry.AuthenticationGateway
    );

    const result = await authenticationUserGateway.makeLogin(
      "cliente@gmail.com",
      "123456"
    );

    expect(result.user.email).toBe("cliente@gmail.com");
    expect(result.Enterprise).toBeNull();
  });

  test("Deve lidar com erros ao tentar efetuar login com senha inválida", async () => {
    const authenticationUserGateway = container.get<IAuthenticationGateway>(
      Registry.AuthenticationGateway
    );

    expect(
      async () =>
        await authenticationUserGateway.makeLogin("daniel@gmail.com", "1234568")
    ).rejects.toThrow(new Error("Failed to make login"));
  });

  test("Deve lidar com erros ao tentar efetuar login com email inválido", async () => {
    const authenticationUserGateway = container.get<IAuthenticationGateway>(
      Registry.AuthenticationGateway
    );

    expect(
      async () =>
        await authenticationUserGateway.makeLogin("daniel2@gmail.com", "123456")
    ).rejects.toThrow(new Error("Failed to make login"));
  });
});

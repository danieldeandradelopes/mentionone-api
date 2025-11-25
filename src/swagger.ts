import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API da Barbearia",
    version: "1.0.0",
    description: "Documentação da API com Swagger",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
  servers: [
    {
      url: "http://localhost:3000", // ou a URL do seu backend
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ["./src/routes/**/*.ts"], // Caminho onde estão as rotas com JSDoc
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };

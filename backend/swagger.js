const swaggerAutogen = require('swagger-autogen');
const { adminSwaggerRoutes } = require("./routes/admin.routes")


const doc = {
  info: {
    title: 'real-brave',
    description: 'API documentation',
  },
  host: "localhost:3000",//process.env.HOST || 'localhost:3000',
  schemes: "http", //[process.env.SCHEME || 'http'],
  basePath: '/api/v1',
  components: {
    schemas: {},
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
  tags: [],
};
const endpointsFiles = ['./routes/index.js'];

const outputFile = './swagger_output.json';


adminSwaggerRoutes(doc);

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully!');
});

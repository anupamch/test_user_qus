const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
openapi: "3.0.0",
info: {
title: "My API",
version: "1.0.0",
description: "WS NodeJS Task",
},
servers: [
    { url: 'http://localhost:3000' },
  ],
};

const options = {
swaggerDefinition,
apis: [`${__dirname}/routes/router.js`], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import path from 'path'
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Scratchpay Code Challenge API',
      version: '1.0.0',
      description: 'API Documentation',
    },
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  apis: ['./src/routes/*.ts'], // Update this with your route files
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

export const setupSwagger = (app: any) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

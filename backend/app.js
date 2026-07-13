import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import routerForm from './routes/form.routes.js';

const app = express();

// Middleware parsing JSON
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Form API',
      version: '1.0.0',
      description: 'A simple Form API'
    }
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', routerForm);

export default app;
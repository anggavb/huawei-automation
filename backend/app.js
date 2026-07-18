import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import routerForm from './routes/form.routes.js';
import formService from './service/form.service.js';
import response from './utils/response.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// View Engine Setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

// Middleware parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Web Routes
app.get('/', (req, res) => {
  const formData = formService.getForm();
  res.render('index', { formData });
});

// API Routes
app.use('/api', routerForm);

// Error Handling Middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json(response('Invalid JSON body', null, ['Invalid JSON body']));
  }
  next(err);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json(response('Internal Server Error', null, [err.message]));
});

export default app;
import express from 'express';
import routerForm from './routes/form.routes.js';

const app = express();

// Middleware parsing JSON
app.use(express.json());

app.use('/api', routerForm);

export default app;
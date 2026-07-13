import 'dotenv/config'
import app from './app.js';

const port = process.env.APP_PORT;

if (!port) {
  console.error('APP_PORT is not defined in the environment variables.');
  process.exit(1);
}

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
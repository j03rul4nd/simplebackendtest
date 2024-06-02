import express from 'express';
import router from './routes/index.js';

const app = express();

// Configurar el endpoint HTTP
app.use('/', router);

export default app;

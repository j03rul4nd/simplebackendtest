import { createServer } from 'http';
import app from './app.js';
import { WebSocketServer } from 'ws';
import { handleWebSocketConnection } from './controllers/roomController.js';

const server = createServer(app);

// Crear el servidor WebSocket
const wss = new WebSocketServer({ server });

wss.on('connection', handleWebSocketConnection);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

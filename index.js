import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = createServer(app); // Crear un servidor HTTP

// Configurar el endpoint HTTP
app.get('/', (req, res) => {
    res.send('Welcome to the website');
});

// Crear el servidor WebSocket
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('New client connected');

    // Enviar un mensaje al cliente
    ws.send('Welcome new client!');

    // Manejar mensajes recibidos del cliente
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        // Opcionalmente, puedes enviar una respuesta al cliente
        ws.send(`You said: ${message}`);
    });

    // Manejar la desconexión del cliente
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Usar el puerto asignado por Render o 3000 en local
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

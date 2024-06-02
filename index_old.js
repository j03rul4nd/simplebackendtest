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

function isJsonString(str) {
    try {
        const obj = JSON.parse(str);
        return obj && typeof obj == 'object';
    } catch (e) {
        return false;
    }
}

// Estructura para almacenar salas y los clientes en cada sala
const rooms = {};

// Función para generar un código de sala de 8 dígitos
function generateRoomCode() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}


wss.on('connection', (ws) => {
    console.log('New client connected');
    ws.send('Welcome new client!');

    ws.on('message', (message) => {
        if (isJsonString(message)) {
            const msgObject = JSON.parse(message);
            console.log('Received object:', msgObject);

            if (msgObject.type == 'create_room') {
                const roomCode = generateRoomCode();
                rooms[roomCode] = rooms[roomCode] || [];
                rooms[roomCode].push(ws);
                ws.roomCode = roomCode;
                console.log("Generated new room code:", roomCode);
                ws.send(JSON.stringify({ type: 'room_created', roomCode: roomCode }));

            } else if (msgObject.type == 'join_room') {
                const roomCode = msgObject.roomCode;
                if (rooms[roomCode]) {
                    rooms[roomCode].push(ws);
                    ws.roomCode = roomCode;
                    ws.send(JSON.stringify({ type: 'room_joined', roomCode: roomCode }));


                    // Enviar el número de clientes conectados a todos en la sala
                    const clientCount = rooms[roomCode].length;
                    rooms[roomCode].forEach(client => {
                        if (client.readyState == ws.OPEN) {
                            client.send(JSON.stringify({ type: 'connected_clients', roomCode: roomCode, count: clientCount }));
                        }
                    });
                } else {
                    ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
                }

            } else if (msgObject.type == 'message') {
                const roomCode = ws.roomCode;
                if (roomCode && rooms[roomCode]) {
                    rooms[roomCode].forEach(client => {
                        console.log("Room " + roomCode + " received from " + client);
                        if (client != ws && client.readyState == ws.OPEN) {
                            client.send(JSON.stringify(msgObject));
                            console.log("Sent message");
                        }
                    });
                } else {
                    ws.send(JSON.stringify({ type: 'error', message: 'You are not in a room' }));
                }
            } else if (msgObject.type == 'get_connected_clients') {
                const roomCode = msgObject.roomCode;
                if (rooms[roomCode]) {
                    const clientCount = rooms[roomCode].length;
                    ws.send(JSON.stringify({ type: 'connected_clients', roomCode: roomCode, count: clientCount }));
                } else {
                    ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
                }

            } else if (msgObject.type == 'get_rooms_info') {
                const roomsInfo = Object.keys(rooms).map(roomCode => ({
                    roomCode,
                    hasClients: rooms[roomCode].length > 0
                }));
                ws.send(JSON.stringify({ type: 'rooms_info', rooms: roomsInfo }));

            }

        } else {
            console.log(`Received message: ${message}`);
            ws.send(`You said: ${message}`);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        // Remover el cliente de la sala
        if (ws.roomCode && rooms[ws.roomCode]) {
            rooms[ws.roomCode] = rooms[ws.roomCode].filter(client => client != ws);
            if (rooms[ws.roomCode].length == 0) {
                delete rooms[ws.roomCode];
            }
        }
    });
});

// Usar el puerto asignado por Render o 3000 en local
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

import { rooms, handleCreateRoom, handleJoinRoom, handleMessage, handleGetConnectedClients, handleGetRoomsInfo, deleteRoom } from '../services/roomService.js';
import { isJsonString } from '../utils/utils.js';

export function handleWebSocketConnection(ws) {
    console.log('New client connected');
    ws.send('Welcome new client!');

    ws.on('message', (message) => {
        if (isJsonString(message)) {
            const msgObject = JSON.parse(message);
            console.log('Received object:', msgObject);

            switch (msgObject.type) {
                case 'create_room':
                    handleCreateRoom(ws);
                    break;
                case 'join_room':
                    handleJoinRoom(ws, msgObject.roomCode);
                    break;
                case 'responseMessage':
                case 'message':
                    handleMessage(ws, msgObject);
                    break;
                case 'get_connected_clients':
                    handleGetConnectedClients(ws, msgObject.roomCode);
                    break;
                case 'get_rooms_info':
                    handleGetRoomsInfo(ws);
                    break;
                default:
                    console.log('Unknown message type:', msgObject.type);
            }
        } else {
            console.log(`Received message: ${message}`);
            ws.send(`You said: ${message}`);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        handleClientDisconnect(ws);
    });
}


function handleClientDisconnect(ws) {
    if (ws.roomCode && rooms[ws.roomCode]) {
        rooms[ws.roomCode] = rooms[ws.roomCode].filter(client => client !== ws);

        // Enviar el número actualizado de clientes conectados a todos en la sala
        const clientCount = rooms[ws.roomCode].length;
        rooms[ws.roomCode].forEach(client => {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify({ type: 'connected_clients', roomCode: ws.roomCode, count: clientCount }));
            }
        });

        
        if (rooms[ws.roomCode].length === 0) {
            deleteRoom(ws.roomCode);
        }
    }
}
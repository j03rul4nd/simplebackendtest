const rooms = {};

function generateRoomCode() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}

export function handleCreateRoom(ws) {
    const roomCode = generateRoomCode();
    rooms[roomCode] = rooms[roomCode] || [];
    rooms[roomCode].push(ws);
    ws.roomCode = roomCode;
    console.log("Generated new room code:", roomCode);
    ws.send(JSON.stringify({ type: 'room_created', roomCode: roomCode }));
}

export function handleJoinRoom(ws, roomCode) {
    if (rooms[roomCode]) {
        rooms[roomCode].push(ws);
        ws.roomCode = roomCode;
        ws.send(JSON.stringify({ type: 'room_joined', roomCode: roomCode }));

        const clientCount = rooms[roomCode].length;
        rooms[roomCode].forEach(client => {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify({ type: 'connected_clients', roomCode: roomCode, count: clientCount }));
            }
        });
    } else {
        ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
    }
}

export function handleMessage(ws, msgObject) {
    const roomCode = ws.roomCode;
    if (roomCode && rooms[roomCode]) {
        rooms[roomCode].forEach(client => {
            if (client !== ws && client.readyState === ws.OPEN) {
                client.send(JSON.stringify(msgObject));
            }
        });
    } else {
        ws.send(JSON.stringify({ type: 'error', message: 'You are not in a room' }));
    }
}

export function handleGetConnectedClients(ws, roomCode) {
    if (rooms[roomCode]) {
        const clientCount = rooms[roomCode].length;
        ws.send(JSON.stringify({ type: 'connected_clients', roomCode: roomCode, count: clientCount }));
    } else {
        ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
    }
}

export function handleGetRoomsInfo(ws) {
    const roomsInfo = Object.keys(rooms).map(roomCode => ({
        roomCode,
        hasClients: rooms[roomCode].length > 0
    }));
    ws.send(JSON.stringify({ type: 'rooms_info', rooms: roomsInfo }));
}

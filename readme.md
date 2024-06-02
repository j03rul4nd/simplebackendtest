# Chat Room Backend

Este es un backend simple para crear salas de chat donde los usuarios pueden conectarse y comunicarse en tiempo real utilizando WebSockets. El proyecto está construido con Node.js, Express y la biblioteca `ws` para manejar conexiones WebSocket.

## Características

- Crear salas de chat únicas.
- Unirse a salas de chat existentes.
- Enviar y recibir mensajes en tiempo real dentro de una sala de chat.
- Obtener información sobre las salas y los clientes conectados.

## Estructura del Proyecto

```css
/src
├── /controllers
│ └── roomController.js
├── /services
│ └── roomService.js
├── /utils
│ └── utils.js
├── /routes
│ └── index.js
├── server.js
└── app.js
```

## Requisitos

- Node.js (v14 o superior)
- npm (v6 o superior)

## Instalación

1. Clona este repositorio en tu máquina local:
    
    ```bash
    git clone <https://github.com/j03rul4nd/simplebackendtest.git> 
    cd chat-room-backend
    ```
    
2. Instala las dependencias necesarias:
    
    ```bash
    npm install
    ```
    

## **Uso**

1. Inicia el servidor:
    
    ```bash
    node src/server.js
    ```
    
    El servidor escuchará en el puerto **`3000`** o el puerto especificado en la variable de entorno **`PORT`**.
    
2. Accede a **`http://localhost:3000`** en tu navegador para ver el mensaje de bienvenida.

## **Endpoints**

### **HTTP Endpoints**

- **`GET /`**: Devuelve un mensaje de bienvenida.

### **WebSocket Mensajes**

- **`create_room`**: Crea una nueva sala y devuelve el código de la sala.
    
    ```json
    {
      "type": "create_room"
    }
    ```
    
- **`join_room`**: Se une a una sala existente usando el código de la sala.
    
    ```json
    {
      "type": "join_room",
      "roomCode": "CODE1234"
    }
    ```
    
- **`message`**: Envía un mensaje a todos los clientes en la sala.
    
    ```json
    {
      "type": "message",
      "content": "Hello, World!"
    }
    ```
    
- **`get_connected_clients`**: Obtiene el número de clientes conectados en una sala.
    
    ```json
    {
      "type": "get_connected_clients",
      "roomCode": "CODE1234"
    }
    ```
    
- **`get_rooms_info`**: Obtiene información sobre todas las salas.
    
    ```json
    {
      "type": "get_rooms_info"
    }
    ```
    

## **Despliegue**

Para desplegar este proyecto en un entorno de producción, sigue estos pasos:

1. Asegúrate de tener configuradas las variables de entorno necesarias, especialmente **`PORT`**.
2. Usa un proceso de manejo como **`pm2`** para mantener la aplicación en funcionamiento:
    
    ```bash
    npm install -g pm2
    pm2 start src/server.js
    ```
    
3. Configura un servidor web como Nginx para gestionar las solicitudes HTTP y WebSocket.

## **Contribuciones**

¡Las contribuciones son bienvenidas! Si deseas contribuir, por favor abre un issue o envía un pull request.
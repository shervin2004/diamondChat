DiamondChat APIs (shervin2004/diamondChat)

This document lists the HTTP APIs and Socket.IO events for the diamondChat project from https://github.com/shervin2004/diamondChat.

HTTP APIs

| Method | Endpoint                     | Description                              | Request Body Example                                     | Response Example                                                                 |
|--------|------------------------------|------------------------------------------|---------------------------------------------------------|----------------------------------------------------------------------------------|
| GET    | /chat/messages/:roomId       | Retrieve up to 50 messages for a room    | None                                                    | [] or [{"_id": "67123456abcdef1234567890", "roomId": "room1", "userId": "user1", "content": "Hello", "timestamp": "2025-05-10T12:34:56.789Z"}] |
| POST   | /chat/messages               | Create a new message                     | {"roomId": "room1", "userId": "user1", "content": "Hello"} | {"_id": "67123456abcdef1234567890", "roomId": "room1", "userId": "user1", "content": "Hello", "timestamp": "2025-05-10T12:34:56.789Z"} |

Socket.IO Events

| Event         | Direction       | Description                              | Data Example                                            |
|---------------|-----------------|------------------------------------------|---------------------------------------------------------|
| joinRoom      | Client → Server | Join a chat room                         | "room1"                                                 |
| sendMessage   | Client → Server | Send a message to a room                 | {"roomId": "room1", "userId": "user1", "content": "Hello"} |
| message       | Server → Client | Receive a message in a room              | {"roomId": "room1", "userId": "user1", "content": "Hello", "timestamp": "2025-05-10T12:34:56.789Z"} |
| disconnect    | Client → Server | Handle client disconnection              | None                                                    |

Testing Examples

HTTP APIs (Postman):
- GET /chat/messages/room1:
  URL: http://localhost:8001/chat/messages/room1
  Method: GET
  Headers: None
  Body: None
  Response: [] or [{"_id": "67123456abcdef1234567890", "roomId": "room1", "userId": "user1", "content": "Hello", "timestamp": "2025-05-10T12:34:56.789Z"}]
- POST /chat/messages:
  URL: http://localhost:8001/chat/messages
  Method: POST
  Headers: Content-Type: application/json
  Body: {"roomId": "room1", "userId": "user1", "content": "Hello"}
  Response: {"_id": "67123456abcdef1234567890", "roomId": "room1", "userId": "user1", "content": "Hello", "timestamp": "2025-05-10T12:34:56.789Z"}
- POST /chat/messages (Error):
  URL: http://localhost:8001/chat/messages
  Method: POST
  Headers: Content-Type: application/json
  Body: {"roomId": "", "userId": "", "content": ""}
  Response: {"error": "\"roomId\" is not allowed to be empty"}

Socket.IO (test.html, Recommended):
- Create test.html:
  <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
  <script>
    const socket = io('http://localhost:8001', { transports: ['websocket'] });
    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('joinRoom', 'room1');
      socket.emit('sendMessage', { roomId: 'room1', userId: 'user1', content: 'Test message' });
    });
    socket.on('message', (msg) => {
      console.log('Received message:', msg);
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  </script>
- Serve: npx http-server . -p 8080
- Open: http://localhost:8080/test.html
- Console Output:
  Connected to server
  Received message: {"roomId": "room1", "userId": "user1", "content": "Test message", "timestamp": "2025-05-10T12:34:56.789Z"}
- Server Log:
  A user connected: <socket_id>
  User <socket_id> joined room room1
  User <socket_id> disconnected (on tab close)

Socket.IO (Postman WebSocket, Optional):
- Connect:
  URL: ws://localhost:8001/socket.io/?EIO=4&transport=websocket
  Headers: Origin: http://localhost, Sec-WebSocket-Version: 13
  Action: Click Connect
  Server Log: A user connected: <socket_id>
- joinRoom:
  Message: {"event": "joinRoom", "data": "room1"}
  Server Log: User <socket_id> joined room room1
- sendMessage:
  Message: {"event": "sendMessage", "data": {"roomId": "room1", "userId": "user1", "content": "Hello via Postman"}}
  Response: {"roomId": "room1", "userId": "user1", "content": "Hello via Postman", "timestamp": "2025-05-10T12:34:56.789Z"}
- message:
  (Received after sendMessage in same room)
  Response: {"roomId": "room1", "userId": "user1", "content": "Hello via Postman", "timestamp": "2025-05-10T12:34:56.789Z"}
- disconnect:
  Action: Click Disconnect
  Server Log: User <socket_id> disconnected

Notes
- Runs on port 8001 to avoid conflict with other services.
- Uses MongoDB database chat_service.
- Validates messages with Joi (requires roomId, userId, content).
- Identical functionality to ShivaDiamond/chat_service but in a separate repository.
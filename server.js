const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { connectMongo } = require('./config/mongo');
const chatRoutes = require('./api/chat');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use('/chat', chatRoutes);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('sendMessage', async ({ roomId, userId, content }) => {
        try {
            const db = require('./config/mongo').getDb();
            const message = {
                roomId,
                userId,
                content,
                timestamp: new Date(),
            };
            await db.collection('messages').insertOne(message);
            io.to(roomId).emit('message', message);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

if (require.main === module) {
    connectMongo().then(() => {
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch((error) => {
        console.error('Startup error:', error);
        process.exit(1);
    });
}

module.exports = app;
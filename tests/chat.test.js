const request = require('supertest');
const app = require('../server');
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat_service';

let client;
let db;

describe('Chat API', () => {
    beforeAll(async () => {
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db('chat_service');
        await db.collection('messages').deleteMany({});
    });

    afterAll(async () => {
        await client.close();
    });

    it('should get messages for a room', async () => {
        const roomId = 'room1';
        await db.collection('messages').insertOne({
            roomId,
            userId: 'user1',
            content: 'Hello',
            timestamp: new Date(),
        });

        const res = await request(app).get(`/chat/messages/${roomId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body[0].content).toEqual('Hello');
    });

    it('should create a message', async () => {
        const message = {
            roomId: 'room1',
            userId: 'user1',
            content: 'Test message',
        };
        const res = await request(app).post('/chat/messages').send(message);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.content).toEqual(message.content);
    });

    it('should return 400 for invalid message', async () => {
        const invalidMessage = {
            roomId: '',
            userId: '',
            content: '',
        };
        const res = await request(app).post('/chat/messages').send(invalidMessage);
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });
});
const { MongoClient } = require('mongodb');

let db;
let client;

async function connectMongo() {
    try {
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        db = client.db('chat_service');
        if (process.env.NODE_ENV !== 'test') {
            console.log('Connected to MongoDB');
        }
        return db;
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        throw error;
    }
}

function getDb() {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
}

module.exports = { connectMongo, getDb, closeClient: () => client.close() };
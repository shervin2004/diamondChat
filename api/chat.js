const express = require('express');
const { getDb } = require('../config/mongo');
const { validateMessage } = require('../models/chat');
const router = express.Router();

router.get('/messages/:roomId', async (req, res, next) => {
    try {
        const db = getDb();
        const messages = await db.collection('messages')
            .find({ roomId: req.params.roomId })
            .sort({ timestamp: -1 })
            .limit(50)
            .toArray();
        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
});

router.post('/messages', async (req, res, next) => {
    try {
        const { error } = validateMessage(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const db = getDb();
        const message = {
            roomId: req.body.roomId,
            userId: req.body.userId,
            content: req.body.content,
            timestamp: new Date(),
        };
        await db.collection('messages').insertOne(message);
        res.status(200).json(message);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
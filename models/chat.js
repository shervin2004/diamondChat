const Joi = require('joi');

const messageSchema = Joi.object({
    roomId: Joi.string().required(),
    userId: Joi.string().required(),
    content: Joi.string().min(1).max(1000).required(),
});

function validateMessage(message) {
    return messageSchema.validate(message);
}

module.exports = { validateMessage };
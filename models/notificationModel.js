const Joi = require('joi');

exports.newNotificationSchema = Joi.object().options({ abortEarly: false }).keys({
    text: Joi.string().required(),
    date: Joi.date().required(),
});

exports.notificationSchema = Joi.object().options({ abortEarly: false }).keys({
    id: Joi.number().required(),
    text: Joi.string().required(),
    date: Joi.date().required(),
});
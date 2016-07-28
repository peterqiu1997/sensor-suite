cfg = {};
cfg.port = process.env.PORT || 3000;
cfg.uristring = process.env.MONGODB_URI;
cfg.ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
cfg.AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
cfg.NUMBERS = [process.env.FIRST, process.env.SECOND, process.env.THIRD];
cfg.FROM_NUMBER = process.env.FROM_NUMBER;

module.exports = cfg;

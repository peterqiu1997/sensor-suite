cfg = {};
cfg.port = process.env.PORT || 3000;
cfg.uristring = process.env.MONGODB_URI;
cfg.EMAILS = 
cfg.smptConfig = {
    service: 'gmail',
    secure: true,
    auth: {
        user: '----',
        pass: '----'
    }
};

module.exports = cfg;

cfg = {};
cfg.port = process.env.PORT || 3000;
cfg.uristring = process.env.MONGODB_URI;
cfg.EMAILS = 
cfg.smptConfig = {
    service: 'gmail',
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
};

module.exports = cfg;

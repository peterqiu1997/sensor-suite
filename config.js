cfg = {};
cfg.port = process.env.PORT || 3000;
cfg.uristring = process.env.MONGODB_URI;
cfg.EMAILS = 
cfg.smptConfig = {
    service: 'gmail',
    secure: true,
    auth: {
        user: 'peterqiu1997@gmail.com',
        pass: 'madnessinteractive'
    }
};

module.exports = cfg;

cfg = {};
cfg.port = process.env.PORT || 3000;
cfg.uristring = process.env.MONGODB_URI;  // remove this later

module.exports = cfg;
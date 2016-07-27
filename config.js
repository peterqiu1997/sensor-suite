cfg = {};
cfg.port = process.env.PORT || 3000;
cfg.uristring = process.env.MONGODB_URI || "mongodb://heroku_4sr5ldpv:dgrg5e22e6md9uhrndeuknoe5f@ds023105.mlab.com:23105/heroku_4sr5ldpv";  // remove this later

module.exports = cfg;
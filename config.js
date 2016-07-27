cfg = {};
cfg.port = process.env.PORT || 3000;
cfg.uristring = process.env.MONGODB_URI || "mongodb://heroku_4sr5ldpv:dgrg5e22e6md9uhrndeuknoe5f@ds023105.mlab.com:23105/heroku_4sr5ldpv";  // remove this later
cfg.ACCOUNT_SID = process.env.ACCOUNT_SID || 'AC28a98dea2cc37464def62b6633f6f9fb';
cfg.AUTH_TOKEN = process.env.AUTH_TOKEN || '0df41c6e1df462cb591a42d5e9e8ef54';

module.exports = cfg;
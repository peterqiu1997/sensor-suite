cfg = {};
cfg.port = process.env.PORT || 3000;
cfg.uristring = process.env.MONGODB_URI || "***REMOVED***";  // remove this later

module.exports = cfg;
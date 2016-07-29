cfg = {};
cfg.port = process.env.PORT || 3000;
cfg.uristring = process.env.MONGODB_URI || '***REMOVED***';

module.exports = cfg;

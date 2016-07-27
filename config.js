cfg = {};
cfg.port = process.env.PORT || 3000;
cfg.uristring = process.env.MONGODB_URI || "***REMOVED***";  // remove this later
cfg.ACCOUNT_SID = process.env.ACCOUNT_SID || '***REMOVED***';
cfg.AUTH_TOKEN = process.env.AUTH_TOKEN || '***REMOVED***';

module.exports = cfg;

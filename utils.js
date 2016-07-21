const DataModel = require('./dist/models/DataModel');
const mongoose = require('mongoose');

const parseJSON = function(json) {
    
};

const fetch = function(range) {
    const nowMilli = Date.now();
    const now = new Date(nowMilli).toISOString();
    const before = new Date(nowMilli - range).toISOString();
    return { $gt: before, $lte: now };
};

module.exports = {
    fetchRange: fetch
};

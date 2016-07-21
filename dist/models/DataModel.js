const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mySchema = new Schema({
    temperature: {
    	type: Number,
    	required: true
    },
    humidity: {
    	type: Number,
    	required: true
    },
    pressure: {
    	type: Number,
    	required: true
    },
    count: {
    	type: Number,
    	required: true,
        default: 0
    }
}, { timestamps: true });

const DataModel = mongoose.model('myModels', mySchema);

module.exports = DataModel;

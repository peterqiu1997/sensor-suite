const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mySchema = new Schema({
	timeStamp: {
		type: Date,
		required: true,
		unique: true
	},
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
    	required: true
    }
});

const DataModel = mongoose.model('myModels', mySchema);

module.exports = DataModel;

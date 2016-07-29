'use strict'
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const compression = require('compression');
const DataModel = require('./dist/models/DataModel');
const cfg = require('./config');
const utils = require('./utils');

const app = express();
const server = app.listen(cfg.port);
const duration = 1000;
let connected = 0,
    open = false;

// middleware
app.use(compression());
app.use(express.static(path.join(__dirname, '/dist')));
app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/dist/index.html'));
});

// database
mongoose.connect(cfg.uristring, function(err, res) {
    if (!err) { open = true; }
});

// socket.io
const io = require('socket.io')(server);
io.on('connection', function(socket) {
    connected += 1;
    socket.on('request', function() {   
        /*DataModel.find({ createdAt: utils.past(86400000)}) // data from past day
             .exec(function(err, result) {
                if (!err && result != null) {
                    socket.emit('stats', result);
                } else {
                    socket.emit('stats', "Error")
                }
            });*/
    });
    socket.on('disconnect', function() {
        connected -= 1;
    });
});

// periodic updates
const pulse = setInterval(function() {
    if (connected > 0 && open) {
        DataModel.findOne().sort({createdAt: -1}).exec(function(err, result) {
            if (!err && result != null) {
                io.emit('update', result);
            }
        });
    }
}, duration);

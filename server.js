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
    lastCall = 0,
    statsCounter = 0,
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

// twilio 
const accountSid = cfg.ACCOUNT_SID;
const authToken = cfg.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// connect/disconnect functions
io.on('connection', function(socket) {
    connected += 1;
    socket.on('request', function() {   
        DataModel.find({ createdAt: utils.past(86400000)}) // data from past day
             .exec(function(err, result) {
                if (!err && result != null) {
                    socket.emit('stats', result);
                } else {
                    socket.emit('stats', "Error")
                }
            });
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
                if (result.count > 0.07 && Date.now() > (lastCall + 300000)) {
                    for (let number in cfg.NUMBERS) {
                        client.messages.create({
                            to: number,
                            from: cfg.FROM_NUMBER,
                            body: 'shimmy on down to the cleanroom - sent at: ' + 
                                   new Date().toString().split(' ').slice(0, 5).join(' ')
                        }, function (err, message) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                    lastCall = Date.now();
                }
            }
        });
    }
}, duration);

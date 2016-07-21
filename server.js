'use strict'
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const compression = require('compression');
const DataModel = require('./dist/models/DataModel');
const cfg = require('./config');
const utils = require('./utils');

const app = express();
const db = mongoose.connection;
const duration = 1000;
let connected = 0,
    statsCounter = 0,
    open = false;

const server = app.listen(cfg.port, function() {
    console.log('listening on port ' + cfg.port);
});

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
        console.log("Client requested something. Server side called.");
        socket.emit('response', "Server gave back this. Connection is open.");
    });
    socket.on('disconnect', function() {
        connected -= 1;
    });
});

const pulse = setInterval(function() {

    const dataPoint = new DataModel({
        temperature: Math.floor(Math.random() * 10 + 70),
        count: Math.floor(Math.random() * 2000) + 5500, 
        humidity: Math.floor(Math.random() * 5) + 30,
        pressure: Math.floor(Math.random() * 3) + 29
    });

    statsCounter = (statsCounter + 1) % 5;
    if (connected > 0 && open) {
        io.emit('update', dataPoint);
        if (statsCounter === 0) {
            DataModel.find({ createdAt: utils.fetchRange(86400000)})
             .exec(function(err, result) {
                if (!err) {
                    io.emit('stats', result.length);
                } else {
                    io.emit('stats', "Error")
                }
            });
        }
    }
    dataPoint.save(function(err) {
        if (err) {
            console.log(err);
        }
    });
}, duration);

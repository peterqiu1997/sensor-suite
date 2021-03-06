'use strict';
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const compression = require('compression');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const fs = require('fs');
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

// email 
const transporter = nodemailer.createTransport(smtpTransport(cfg.smtpConfig));
const mailOptions = {
    html: 'Please do <b>not</b> respond.'
};
const CSVOptions = {
    keys: ['createdAt', 'pressure', 'temperature', 'humidity', 'count']
};

// socket.io
const io = require('socket.io')(server);
io.on('connection', function(socket) { 
    connected += 1;
    socket.on('json', function(address) { 
        mailOptions.to = address;
        utils.sendJSON(transporter, mailOptions);
    });
    socket.on('csv', function(address) {
        mailOptions.to = address; 
        utils.sendCSV(transporter, mailOptions, CSVOptions);
    });
    socket.on('csv and json', function(address) {
        mailOptions.to = address;
        utils.sendBoth(transporter, mailOptions, CSVOptions);
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

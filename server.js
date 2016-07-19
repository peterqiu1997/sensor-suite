'use strict'

const express =  require('express');
const path = require('path');
const mongoose = require('mongoose');
const compression = require('compression');
const DataModel = require('./DataModel');

const port = process.env.PORT || 3000;
const uristring = process.env.MONGODB_URI || "***REMOVED***"; 

const app = express();
const db = mongoose.connection;
const duration = 1000;
let connected = 0,
    open = false;

const server = app.listen(port, function() {
    console.log('listening on port ' + port);
});

app.use(compression());
app.use(express.static(path.join(__dirname, '/dist')));
app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/dist/index.html'));
});

mongoose.connect(uristring, function(err, res) {
    if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      } else {
      console.log ('Succeeded connected to: ' + uristring);
      }
});

db.once('open', function() { open = true; });

const io = require('socket.io')(server);
io.on('connection', function(socket) {
    connected += 1;
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

    if (connected > 0 && open) {
        io.emit('update', dataPoint);
    }

    /*dataPoint.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Saved successfully!");
        }
    });*/
}, duration);

const express =  require('express');
const path = require('path');
const DataModel = require('./DataModel');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const app = express();

const server = app.listen(port, function() {
    console.log('listening on *:3000');
});

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, '/dist')));

app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname + './dist/index.html'));
});

io.on('connection', function(socket) {
    const pulse = setInterval(function() {
        io.emit('update', {
            temperature: Math.floor(Math.random() * 10 + 70),
            count: Math.floor(Math.random() * 300) + 5000, 
            humidity: Math.floor(Math.random() * 5) + 30,
            pressure: Math.floor(Math.random() * 3) + 29
        });
    }, 1000);

    socket.on('disconnect', function() {
        clearInterval(pulse);
    });
});




const express =  require('express');
const path = require('path');
const DataModel = require('./DataModel');
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

// io.sockets = io
/* a connection event receives each Socket instance as a parameter

io.on('connection', function(socket){
  socket.on('disconnect', function(){ });
});*/
io.on('connection', function(socket) {

    console.log("New connection!"); // TODO WHY DOES THIS RUN TWICE? FIGURE OUT CAPTURING/EMITTING EVENTS

    const pulse = setInterval(function() {
        io.emit('update', {
            temperature: Math.floor(Math.random() * 10 + 70),
            count: Math.floor(Math.random() * 300) + 6800,
            humidity: Math.floor(Math.random() * 5) + 30,
            pressure: Math.floor(Math.random() * 3) + 29
        });
    }, 1000);

    socket.on('mounted', function() { // what exactly IS socket here
        console.log("App mounted!");
    }); 

    socket.on('disconnect', function() {
        console.log("Client disconnected.");
        clearInterval(pulse);
    });
});




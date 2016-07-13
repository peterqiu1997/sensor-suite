const express = require('express'); 
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, '/dist')));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const server = app.listen(port, function() {
    console.log('listening on *:3000');
});

const io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log("There is a new connection.");

    setInterval(function() {
        io.emit('update', {
            temperature: Math.random() * 10 + 70,
            count: Math.random() * 300 + 5000,
            humidity: Math.random() * 5 + 30,
            pressure: Math.random() * 3 + 29
        });
    }, 1000);

    socket.on('disconnect', function() {
        console.log("Client disconnected.");
        clearInterval();
    });
});




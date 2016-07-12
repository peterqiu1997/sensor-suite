const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');


app.use(express.static(path.join(__dirname, '/dist')));

app.get('*', function(req, res) {
	res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

io.on('connection', function(socket) {
	alert("connection!");
});

app.listen(3000, function() {
	console.log('listening on *:3000');
});
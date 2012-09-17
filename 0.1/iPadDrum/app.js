var express = require('express');
var app = express();
var http = require('http');
var server = server = http.createServer(app);
var io = require('socket.io').listen(server);
var port = 8080;

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

server.listen(port);
console.log('Listening on port '+port);

var express = require('express');
var _ = require('underscore');
var app = express();
var http = require('http');
var server = server = http.createServer(app);
var io = require('socket.io').listen(server);
var port = 8080;

// Logs on every message slow things down too much
io.set('log level', 0);

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/../../'));

//`clients'
//
// * Keys: socket session ids.
// * Values: socket objects
var clients = {}
io.sockets.on('connection', function (socket) {
  clients[socket.id] = socket;

  socket.on('move', function (data) {
    _(_.values(clients)).each(function(client){
      client.emit('move', data);
    });
  });

  function setUpBroadcast(eventName){
    // `touches` - An array of objects with keys:
    //  * `id` - the touch id
    //  * `x` and `y` - position values normalized between 0 and 1.
    socket.on(eventName, function(touches){
      _(_.values(clients)).each(function(client){
        client.emit(eventName, touches);
      });
    });
  }
  setUpBroadcast('down');
  setUpBroadcast('up');

  socket.on('disconnect', function(){
    delete(clients[socket.id]);
  });
});

server.listen(port);
console.log('Listening on port '+port);

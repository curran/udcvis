var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app)
    , fs = require('fs');

app.listen(8080);

function handler (req, res) {
    console.log("here");
    fs.readFile(__dirname + '/index.html',
	function (err, data) {
	    if (err) {
		res.writeHead(500);
		return res.end('Error loading index.html');
	    }
	    res.writeHead(200);
	    res.end(data);
	});
}

var sockets = [];
io.sockets.on('connection', function (socket) {	
  sockets.push(socket);
  socket.on('disconnect', function (){
    var i = sockets.indexOf(socket);
    sockets.splice(i, 1);
  });
  socket.on('commitTransaction', function (data) {
    for(var i = 0; i < sockets.length; i++)
      if(sockets[i] != socket)
	sockets[i].emit('executeTransaction', data);
    console.log(data);
  });
});

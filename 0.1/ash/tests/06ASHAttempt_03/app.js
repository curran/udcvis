var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app)
    , fs = require('fs');

app.listen(8002);

function handler (req, res) {
  //TODO use one of the static file serving packages,
  //this code doesn't use the right MIME types
  var filePath = '.' + req.url;
  if (filePath == './')
    filePath = './index.html';
  fs.readFile(filePath, function(error, content) {
    res.writeHead(200);
    res.end(content, 'utf-8');
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
      sockets[i].emit('executeTransaction', data);
    console.log(data);
  });
});

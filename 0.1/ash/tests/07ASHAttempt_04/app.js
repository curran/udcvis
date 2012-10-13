var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app)
    , fs = require('fs');

app.listen(8003);

function handler (req, res) {
  //TODO use one of the static file serving packages,
  //this code doesn't use the right MIME types
  var filePath = '.' + req.url;
  if (filePath == './')
    filePath = './index.html';
  fs.readFile(filePath, function(error, content) {
    res.writeHead(200);
    res.end(content, 'utf-8') ;
  });
}

var actions = [];// a sequence of actions for this session
var sockets = [];// the list of open WebSockets to clients

var resourceIdCounter = 0; // the session-global resource Id counter
var resourceIdRangeSize = 50; // the number of Ids granted at one time to clients

io.sockets.on('connection', function (socket) {	
  sockets.push(socket);
  
  //initialize the client with the stored actions
  socket.emit('executeTransaction', actions);
  
  socket.on('disconnect', function (){
    var i = sockets.indexOf(socket);
    sockets.splice(i, 1);
  });
  socket.on('commitTransaction', function (data) {
    // broadcast the actions
    for(var i = 0; i < sockets.length; i++)
      sockets[i].emit('executeTransaction', data);
      
    // store the actions
    for(i in data)
      actions.push(data[i]);
    console.log(data);
  });
  
  socket.on('requestMoreIds', function(data)/*TODO remove 'data' as an argument*/{
    resourceIdCounter += resourceIdRangeSize;
    socket.emit('grantMoreIds',{
      resourceIdMin:resourceIdCounter - resourceIdRangeSize,
      resourceIdMax:resourceIdCounter
    });
  });
});

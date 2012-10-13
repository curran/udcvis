var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app)
    , fs = require('fs');

app.listen(8004);

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
var resourceIdRangeSize = 5; // the number of Ids granted at one time to clients

function parseAction(actionString){
  var tokens = actionString.split(' ');
  // set: ("s "+resource+" "+property+" "+value)
  // unset: ("us "+resource+" "+property)
  var action = {
    isSet: tokens[0] == 's',
    isUnSet: tokens[0] == 'us',
    resource: tokens[1],
    property: tokens[2]
  };
  if(action.isSet)
    action.value = tokens[2];
  return action;
}

function storeAction(actionString){
  var action = parseAction(actionString);
  
  for(var i = 0; i < actions.length; i++){
    var previousAction = parseAction(actions[i]);
    if( previousAction.resource == action.resource &&
        previousAction.property == action.property ){
      if(action.isSet && previousAction.isSet){
        // collapse [set a=5, set a=6] to [set a=6]
        console.log("replacing '"+actions[i]+"' with '"+actionString+"'");
        actions[i] = actionString;
        return;
      }
      else if(action.isUnSet && previousAction.isSet){
        // collapse [set a=5, unset a] to []
        actions.splice(i, 1);
        return;
      }
    }
  }
  // ... if no previous actions can be collapsed to represent the new one,
  // add the new action to the list of actions
  actions.push(actionString);
}

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
      storeAction(data[i]);
    console.log(data);
  });
  
  socket.on('requestMoreIds', function(){
    resourceIdCounter += resourceIdRangeSize;
    socket.emit('grantMoreIds',{
      resourceIdMin:resourceIdCounter - resourceIdRangeSize,
      resourceIdMax:resourceIdCounter
    });
  });
});

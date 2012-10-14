var fs = require('fs')
  , express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , lazy = require('lazy');

app.configure(function(){
  app.use(express.static(__dirname + '/static'));
});

app.get('/:scriptName/:sessionName', function(req, res){
  var filePath = './static/examples/'+req.params.scriptName+'.html';
  var sessionName = req.params.scriptName+'/'+req.params.sessionName;
  var inFileStream = fs.createReadStream(filePath, { 'bufferSize': 1  });
  inFileStream.on('close', function () {
    res.end();
    console.log("ended writing document");
  });
  res.writeHead(200);
  new lazy(inFileStream).lines.forEach(function(line){ 
    if(line)
      res.write(line.toString().replace("$sessionName",sessionName)+'\n');
  });
});

var actions = {};// the mapping of session names to sequences of actions for each session
var sockets = {};// the mapping of session names of open WebSockets to clients

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

function storeAction(sessionName, actionString){
  var action = parseAction(actionString);
  
  console.log("action.value = "+action.value);
  
  var sessionActions = actions[sessionName];
  
  if(!sessionActions)
    sessionActions = actions[sessionName] = [];
  
  for(var i = 0; i < sessionActions.length; i++){
    var previousAction = parseAction(sessionActions[i]);
    if( previousAction.resource == action.resource &&
        previousAction.property == action.property ){
      if(action.isSet && previousAction.isSet){
        // collapse [set a=5, set a=6] to [set a=6]
        sessionActions[i] = actionString;
        return;
      }
      else if(action.isUnSet && previousAction.isSet){
        // collapse [set a=5, unset a] to []
        sessionActions.splice(i, 1);
        return;
      }
    }
  }
  // ... if no previous actions can be collapsed to represent the new one,
  // add the new action to the list of actions
  sessionActions.push(actionString);
}

io.sockets.on('connection', function (socket) {
  var socketSessionName;
  socket.on('joinSession', function (sessionName){
    console.log("sessionName = "+sessionName);
  
    if(!sockets[sessionName])
      sockets[sessionName] = [];
    sockets[sessionName].push(socket);
    socketSessionName = sessionName;
    
    //initialize the client with the stored actions
    socket.emit('executeTransaction', actions[sessionName]);
    socket.emit('sessionJoined');
  });
  
  socket.on('disconnect', function (){
    if(socketSessionName){
      var sessionSockets = sockets[socketSessionName];
      if(sessionSockets){
        var i = sessionSockets.indexOf(socket);
        sessionSockets.splice(i, 1);
      }
    }
  });
  
  socket.on('commitTransaction', function (data) {
    if(socketSessionName){
      // broadcast the actions
      var sessionSockets = sockets[socketSessionName];
      for(var i = 0; i < sessionSockets.length; i++)
        sessionSockets[i].emit('executeTransaction', data);
        
      // store the actions
      for(i in data)
        storeAction(socketSessionName,data[i]);
      console.log(data);
    }
  });
  
  socket.on('requestMoreIds', function(){
    resourceIdCounter += resourceIdRangeSize;
    socket.emit('grantMoreIds',{
      resourceIdMin:resourceIdCounter - resourceIdRangeSize,
      resourceIdMax:resourceIdCounter
    });
  });
});
var port = 8000;
app.listen(port);
console.log("ASH server now running at http://localhost:"+port);

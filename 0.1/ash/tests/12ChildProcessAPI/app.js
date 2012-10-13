// from http://nodetuts.com/tutorials/2-webtail-nodejs-child-processes-and-http-chunked-encoding.html#video
var http = require('http');
var spawn = require('child_process').spawn;

http.createServer(function(request,response) {
  response.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  
  var child = spawn('echo',['Hello World']);
  
  child.stdout.on('data',function(data){
    console.log(data.toString());
    response.write(data);
  });
  
  child.on('exit', function(code){
    response.end();
  });
  
}).listen(4000);

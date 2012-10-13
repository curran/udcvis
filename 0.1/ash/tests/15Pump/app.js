var http = require('http'),
    fs = require('fs'),
    sys = require('sys');

var filePath = __dirname + '/image.jpg';
fs.stat(filePath, function(err,stat){
  if(err) throw err;
  
  http.createServer(function(req,res){

    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': stat.size
    });
    
    var rs = fs.createReadStream(filePath);
    sys.pump(rs,res,function(err){
      if(err) throw err;
    });
    /*
    var rs = fs.createReadStream(filePath);
    rs.on('data', function(data){
      var flushed = res.write(data);
      if(!flushed)
        rs.pause();
    });
    
    res.on('drain', function(){
      rs.resume();
    });
    
    rs.on('end', function(){
      res.end();
    });*/
  }).listen(4000);
});



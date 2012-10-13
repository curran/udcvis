var spawn = require('child_process').spawn;
var fs = require('fs');

function createRepo(name,callback){
  var dir = './'+name;
  fs.mkdir(dir, 0755, function(err){
    if(err) { throw err; }
    console.log('created directory');
    var queue = [
      {command:'touch', args:['script.txt']},
      {command:'git', args:['init']},
      {command:'git', args:['add','*']},
      {command:'git', args:['commit','-m','Initial Creation']},
    ];
    
    (function iterate(){
      if(queue.length === 0)
        callback();
      else{
        var task = queue.splice(0,1)[0];
        var child = spawn(task.command,task.args,{ 
          cwd: dir, env: process.env, 
          customFds: [-1, -1, -1]});
        
        child.on('exit', function(code){
          console.log('done');
          iterate();
        });
      }
    })();
    
    //callback();
  });
  //var child = spawn('git',['Hello World']);
}
/*  
child.stdout.on('data',function(data){
  console.log(data.toString());
});

child.on('exit', function(code){
  console.log('done');
});*/


createRepo('test',function(){
  console.log("created repo 'test'");
});

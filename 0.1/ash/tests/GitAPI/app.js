//TODO make this a Node.js module
//TODO create unit tests for this
//TODO learn about JS documentation best practices

var spawn = require('child_process').spawn;
var fs = require('fs');

var scriptName = 'script.txt';

function executeTasks(queue,workingDirectory,callback){
  (function iterate(){
    if(queue.length === 0)
      callback();
    else{
      var task = queue.splice(0,1)[0];
      var child = spawn(task.command,task.args,{ 
        cwd: workingDirectory, env: process.env, 
        customFds: [-1, -1, -1]});
      
      child.on('exit', function(code){
        iterate();
      });
    }
  })();
}

function createRepo(repoName,callback){
  var dir = './'+repoName;
  fs.mkdir(dir, 0755, function(err){
    if(err) { throw err; }
    console.log('created directory');
    executeTasks([
      {command:'touch', args:[scriptName]},
      {command:'git', args:['init']},
      {command:'git', args:['add','*']},
      {command:'git', args:['commit','-m','Initial Creation']},
    ],dir,callback);
  });
}

function setScriptContent(repoName,scriptContent,callback){
  var dir = './'+repoName;
  fs.writeFile(dir+'/'+scriptName, scriptContent,
    function(err) {
      if(err) { throw err; }
      else {
      
  //    git commit -m "made change" -a
//git tag -a v0.1 -m 'version 0.1'


        executeTasks([
          {command:'git', args:
            ['commit','-m','made a change','-a']},
          {command:'git', args:
            ['tag','-a','v0.1','-m','version 0.1']},
        ],dir,function(){
          console.log('executed commit and tag');
          callback();
        });
      }
    }
  ); 
}
/*  
child.stdout.on('data',function(data){
  console.log(data.toString());
});

child.on('exit', function(code){
  console.log('done');
});*/

var repoName = 'test';
createRepo(repoName,function(){
  console.log("created repo 'test'");
  var scriptContent = "Hello World\n";
  setScriptContent(repoName,scriptContent,function(err,version){
    console.log("saved script, currently at version "+version);
  });
});

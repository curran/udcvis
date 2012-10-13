var spawn = require('child_process').spawn,
    fs = require('fs');
var CONTENT_FILE_NAME = 'content.txt';
var prefix = '.';
function dirFromName(name){ return prefix+'/repos/'+name; }

// executes a series of command line commands serially, callback()
function executeCommands(dir, queue, callback){
  (function iterate(){
    if(queue.length === 0)
      callback();
    else{
      var task = queue.splice(0,1)[0];
      spawn(task.command,task.args,{cwd:dir}).on('exit', iterate);
    }
  })();
}

// creates a new Git repository with the given name,
// containing a single file called content.txt
// callback(err)
module.exports.createRepo = function(name,callback){
  var dir = dirFromName(name);
  fs.mkdir(dir, 0755, function(err){
    if(err) callback(err);
    else executeCommands(dir,[
      {command:'git', args:['init']},
      {command:'touch', args:[CONTENT_FILE_NAME]},
      {command:'git', args:['add','*']},
      {command:'git', args:['commit','-m','Initial Creation']}
    ], callback);
  });
}

// tags a the given git repository name with the given version
// callback(err)
module.exports.tagRepo = function(name, version, callback){
  executeCommands(dirFromName(name),[
    {command:'git', args:['commit','-m','x','-a']},
    {command:'git', args:['tag','-a','v'+version,'-m','x']}
  ], callback);
}

// sets the content of the given repo to the given text content
// then calls callback(err)
module.exports.setContent = function(name, content, callback){
  fs.writeFile(dirFromName(name)+'/'+CONTENT_FILE_NAME, content, callback);
}

// callback(err,content)
module.exports.getContent = function(name, version, callback){
  var child = spawn('git',['show', 'v'+version+':'+CONTENT_FILE_NAME],
    { cwd: dirFromName(name) });
  var content = '';
  child.stdout.on('data',function(data){ content += data.toString(); });
  child.on('exit', function(code){ 
    callback(null,content);
  });
};

// sets the prefix of the directory path used.
// stays the default when running app.js
// must be changed when node working dir is different (e.g. in export.js)
module.exports.setDirectoryPrefix = function(newPrefix){ prefix = newPrefix; };

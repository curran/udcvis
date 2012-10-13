// TODO make everything asynchronous in preparation for porting into MongoDB
// Curran 10/17/2011
var scripts =
[{
  name: 'a',
  version: 0.1,
  dependencies: []
},
{
  name: 'b',
  version: 0.1,
  dependencies: [
    {name:'a',version:0.1}
  ]
},
{
  name: 'a',
  version: 0.2,
  dependencies: []
},
{
  name: 'c',
  version: 0.1,
  dependencies: [
    {name:'b',version:0.1},
    {name:'a',version:0.2}
  ]
}];

function getScript(scriptInfo, callback){
  for(i in scripts){
    var script = scripts[i];
    if(script.name == scriptInfo.name && script.version == scriptInfo.version){
      callback(script);
      return;
    }
  }
}

function addDependencies(script, dependencies, callback){
  var scriptAlreadyInDependencies = false;
  // if the script is already in the list but using an older version,
  for(var i in dependencies){
    var dependency = dependencies[i];
    if(dependency.name == script.name){
      scriptAlreadyInDependencies = true;
      // use the latest version of the script
      if(dependency.version < script.version)
        dependencies[i] = script;
    }
  }
  
  if(!scriptAlreadyInDependencies)
    dependencies.push(script);
    
  var queue = script.dependencies.splice(0);//make a copy
  (function iterate(){
    if(queue.length === 0)
      callback();
    else{
      getScript(queue.splice(0,1)[0], function(script){
        addDependencies(script,dependencies,iterate);
      });
    }
  })();
}

function evaluateDependencies(script,callback){
  var dependencies = [];
  addDependencies(script,dependencies,function(){
    callback(null,dependencies.reverse());
  });
}

// Evaluating dependencies of c0.1 should result in [a0.2,b0.1,c0.1]
var script = scripts[3];
console.log(script.name+script.version+' depends:');
var dependencies = evaluateDependencies(script,function(err,dependencies){
  for(var i in dependencies){
    var d = dependencies[i];
    console.log(' '+d.name+d.version);
  }
});


// TODO put this in a MongoDB database, and have the script content backed by Git
// Curran 10/13/2011
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

function getScript(scriptInfo){
  for(i in scripts){
    var script = scripts[i];
    if(script.name == scriptInfo.name && script.version == scriptInfo.version)
      return script;
  }
}

// Evaluating dependencies of c0.1 should result in [a0.2,b0.1,c0.1]
function addDependencies(script, dependencies){
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
  for(var i in script.dependencies){
    var dependency = getScript(script.dependencies[i]);
    addDependencies(dependency,dependencies);
  }
}

function evaluateDependencies(script){
  var dependencies = [];
  addDependencies(script,dependencies);
  return dependencies.reverse();
}

var script = scripts[3];
console.log(script.name+script.version+' depends:');
var dependencies = evaluateDependencies(script);
for(var i in dependencies){
  var d = dependencies[i];
  console.log(' '+d.name+d.version);
}

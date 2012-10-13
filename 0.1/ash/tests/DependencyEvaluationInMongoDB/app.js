// TODO have the script content backed by Git
// Curran 10/17/2011

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;
 
var Scripts = new Schema({
  name: String,
  version: Number,
  dependencies: [{ type: Schema.ObjectId, ref: 'Script' }]
});

mongoose.connect('mongodb://localhost/mydatabase');
mongoose.model('Script',Scripts);
var Script = mongoose.model('Script');

//clear and repopulate the DB for testing
Script.remove({},function(){
  console.log("db cleared");

  var script = new Script();
  script.name = 'a';
  script.version = 0.1;
  script.dependencies = [];
  script.save(function(err){
    if(err){ console.log( err ); }
    console.log('saved '+script.name+script.version);
  
    
    script = new Script();
    script.name = 'b';
    script.version = 0.1;
    Script.findOne({name:'a',version:0.1},function(err, depenency){
      script.dependencies.push(depenency._id);
      
      script.save(function(err){
        if(err){ console.log( err ); }
        console.log('saved '+script.name+script.version);
        
        script = new Script();
        script.name = 'a';
        script.version = 0.2;
       
        script.save(function(err){
          if(err){ console.log( err ); }
          console.log('saved '+script.name+script.version);
          
          script = new Script();
          script.name = 'c';
          script.version = 0.1;
          Script.findOne({name:'b',version:0.1},function(err, depenency){
            script.dependencies.push(depenency._id);
            
            Script.findOne({name:'a',version:0.2},function(err, depenency){
              script.dependencies.push(depenency._id);
              
              script.save(function(err){
                if(err){ console.log( err ); }
                console.log('saved '+script.name+script.version);
                runTest();
              });
            });
          });
        });
      });
    });
  });
});

function addScriptToDependencies(script, dependencies, callback){
  var scriptAlreadyInDependencies = false;
  // if the script is already in the list but using an older version,
  for(var i in dependencies){
    var dependency = dependencies[i];
    if(dependency.name == script.name){
      scriptAlreadyInDependencies = true;
      // use the latest version of the script instead
      if(dependency.version < script.version)
        dependencies[i] = script;
    }
  }
  
  // otherwise just add the script to the end of the list
  if(!scriptAlreadyInDependencies)
    dependencies.push(script);
  
  callback();
}

function addDependenciesOfScript(script, dependencies, callback){
  if(script.dependencies.length != 0){
    var left = script.dependencies.length;
    // this approach parallelizes IO for each dependency of a script,
    // which works because the order of dependencies of a given script 
    // doesn't matter, and this code ensures that all dependencies are
    // in the dependency list before the scripts that depend on them.
    script.dependencies.forEach(function(dependencyId){
      Script.findOne({_id:dependencyId},function(err, dependency){
        // add this script's dependencies to the dependency list,
        addDependenciesOfScript(dependency,dependencies,function(){
          if(--left === 0)
            // then add this script itself to the dependency list
            // and call the callback
            addScriptToDependencies(script,dependencies,callback);
        });
      });
    });
  }
  else
    addScriptToDependencies(script,dependencies,callback);
  
    /*
    // this is a serial approach, which works, but the parallel approach is more efficient.
    
  var queue = [];
  script.dependencies.forEach(function(dependency){
    queue.push(dependency);
  });
  (function iterate(){
    if(queue.length === 0)
      addScriptToDependencies(script,dependencies,callback);
    else{
      var dependencyId = queue.splice(0,1)[0];
      Script.findOne({_id:dependencyId},function(err, script){
        addDependenciesOfScript(script,dependencies,iterate);
      });
    }
  })();*/
}

function evaluateDependencies(script,callback){
  var dependencies = [];
  addDependenciesOfScript(script,dependencies,function(){
    callback(dependencies);
  });
}
// Evaluating dependencies of c0.1 should result in [a0.2,b0.1,c0.1]
function runTest(){
  Script.findOne({name:'c',version:0.1},function(err, script){
    console.log(script.name+script.version+' depends:');
    evaluateDependencies(script,function(dependencies){
      for(var i in dependencies){
        var d = dependencies[i];
        console.log(' '+d.name+d.version);
      }
      mongoose.disconnect();
    });
  });
}



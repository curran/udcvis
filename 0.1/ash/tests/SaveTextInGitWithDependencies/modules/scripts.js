var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    git      = require('./git');

var RevisionPointers = new Schema({
  name: String,
  version: Number
});

var Revisions = new Schema({
  name: String,
  version: Number,
  dependencies: [RevisionPointers],
  template: {
    name: String,
    version: Number
  },
  message: {type: String, default:''}
});

var Scripts = new Schema({
  name: String,
  latestVersion: Number
});

var connectResult = mongoose.connect('mongodb://localhost/mydatabase');
mongoose.model('Script',Scripts);
mongoose.model('Revision',Revisions);

var Script = mongoose.model('Script');
var Revision = mongoose.model('Revision');

var firstVersion = 0;

module.exports.FIRST_VERSION = firstVersion;

// Clear the DB for testing
module.exports.clearDB = function(callback){
  Revision.remove({},function(){
    Script.remove({},callback);
  });
}

// Finds all scripts, callback(err, allScripts)
module.exports.all = function(callback){
  Script.find({},callback);
};

// inserts a new script with the given name and blank content.
// callback(error, version)
module.exports.insertNew = function(name, callback) {
  var script = new Script(), revision = new Revision();
  script.name = revision.name = name;
  script.latestVersion = revision.version = firstVersion;
  script.save(function(err){
    if(err) callback(err);
    else revision.save(function(err){
      if(err) callback(err);
      else git.createRepo(name,function(err){
        if(err) callback(err);
        else git.tagRepo(name, firstVersion, function(err){
          callback(err,firstVersion);
        });
      });
    });
  });
}

// Parses the dependencies out of the given script content.
// callbacks.dependsOn(name, version) is called for each '@depends' occurance.
// callbacks.embedIn(name, version) is called for each '@embed in' occurance.

function parseContent(content, callbacks){
  var lines = content.split('\n');
  for(var i = 0; i < lines.length; i++){
    var line = lines[i];
    var dependsOn = line.indexOf('@depends') != -1;
    var embedIn = line.indexOf('@embed') != -1;
    
    if(dependsOn || embedIn){
      var tokens = line.split(' ');
      var name = tokens[2];
      var version = tokens[3];
      if(dependsOn)
        callbacks.dependsOn(name, version);
      else if(embedIn)
        callbacks.embedIn(name, version);
    }
  }
}

// sets the content of the script with the given name to the given value
// callback(error, version)
module.exports.setContent = function(name, content, message, callback) {
  Script.findOne({ name: name }, function(err, script){
    script.latestVersion = Math.round(script.latestVersion*100+1)/100.0;
    // script.latestVersion + 0.01 leads to stuff like 0.10999999999999999
    if(err) callback(err);
    else script.save(function(err){
      var revision = new Revision();
      revision.name = name;
      revision.version = script.latestVersion;
      revision.message = message;
      parseContent(content, {
        dependsOn: function(name, version){
          revision.dependencies.push({
            name: name, version: version
          });
        },
        embedIn: function(name, version){
          revision.template = {
            name: name, version: version
          };
        }
      });
      revision.save(function(err){
        if(err) callback(err);
        else{
          git.setContent(name, content, function(err){
            if(err) callback(err);
            else git.tagRepo(name, revision.version, function(err){
              callback(err,revision.version);
            });
          });
        }
      });
    });
  });
};


// gets the content of the given revision
// revisionPointer = {name: ... , version: ...}
// callback(err, content)
module.exports.getContent = function(revisionPointer, callback){
  git.getContent(revisionPointer.name, revisionPointer.version, callback);
};

// gets the dependencies for the given revision pointer
// callback(err, dependencies)
module.exports.getDependencies = function(name, version, callback){
  Revision.findOne({ name: name, version:version }, function(err,revision){
    callback(err, revision.dependencies);
  });
};

// finds all revisions of the given script.
// callback(err, revisions)
module.exports.findAllRevisions = function(name, callback){
  Revision.find({ name: name }, callback);
};

module.exports.disconnect = function(){
  mongoose.disconnect();
};

// sets the prefix of the directory path used.
// stays the default when running app.js
// must be changed when node working dir is different (e.g. in export.js)
module.exports.setDirectoryPrefix = git.setDirectoryPrefix;


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
    script.dependencies.forEach(function(dependency){
      Revision.findOne({
        name: dependency.name,
        version: dependency.version
      },function(err, dependency){
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
}

// Evaluates the dependencies of the given revision (specified by name and version).
// If two versions of the same script are required, only the most
// recent version is included.
// callback(dependencies) where dependencies is a list of revision pointers.
module.exports.evaluateDependencies = function (name,version,callback){
  Revision.findOne({ name: name, version:version }, function(err,revision){
    var dependencies = [];
    addDependenciesOfScript(revision,dependencies,function(){
      callback(dependencies);
    });
  });
}

// Finds and returns the given revision (only metadata, no content)
// revisionPointer = {name: ... , version: ...}
// callback(err, revision)
module.exports.findRevision = function(revisionPointer, callback){
  Revision.findOne({
    name: revisionPointer.name, version: revisionPointer.version
  }, callback);
};

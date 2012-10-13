/*
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;
 
var Scripts = new Schema({
  name: String,
  content: String
});

//clear and repopulate the DB for testing
Script.remove({},function(){
  console.log("db cleared");
  
  var scripts = [
  {
    name: 'A',
    content: 'Apple 13 inch macbook'
  },
  {
    name: 'B',
    content: 'Apple iPad'
  },
  {
    name: 'C',
    content: 'Apple iPhone'
  }
  ];
  
  var saveScript = function(script){
    var scriptInDB = new Script();
    scriptInDB.name = script.name;
    scriptInDB.content = script.content;
    scriptInDB.save(function(err){
      if(err){ console.log( err ); }
      console.log('saved '+script.name);
    });
  }

  for(i in scripts)
    saveScript(scripts[i]);
});
*/
var scripts = [
{
  name: 'A',
  content: 'Apple 13 inch macbook'
},
{
  name: 'B',
  content: 'Apple iPad'
},
{
  name: 'C',
  content: 'Apple iPhone'
}
];

module.exports.all = function(callback){ callback(null,scripts); };
;

// finds the script with the given name.
// callback(error, script)
module.exports.find = function(name,callback){
  for(i in scripts)
    if(scripts[i].name == name){
      callback(null,scripts[i]);
      return;
    }
};

// inserts a new script with the given name and blank content.
// callback(error)
module.exports.insertNew = function(name, callback) {
  scripts.push({
    name:name,
    content:''
  });
  callback(null);
}

// sets the content of the script with the given name to the given value
// callback(error)
module.exports.setContent = function(name, content, callback) {
  for(i in scripts)
    if(scripts[i].name == name){
      scripts[i].content = content;
      callback(null);
      break;
    }
};

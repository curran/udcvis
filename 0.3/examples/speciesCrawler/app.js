var request = require('request'),
    _ = require('underscore'),
    async = require('async');

function Node(id, name){
  this.id = id;
  this.name = name;
  this.children = [];
}

var allSpecies = new Node(0, "All Species");

function childrenURL(id){
  return [
    "http://www.catalogueoflife.org/",
    "col/browse/tree/fetch/taxa?id=", id
  ].join("");
};

function buildTree(node, depth, callback){
  var url = childrenURL(node.id);
  request(url, function (error, response, json) {
    if (!error && response.statusCode == 200) {
      var subtasks = [],
          data = JSON.parse(json);
      _(data.items).each(function(childData){
        var id = childData.id,
            name = childData.name,
            child = new Node(id, name);
        node.children.push(child);
        subtasks.push(function(callback){
          if(depth > 1){
            buildTree(child, depth - 1, callback);
          }
          else{
            callback(null);
          }
        });
      });
      async.parallel(subtasks, callback);
    }
    else{
      callback(error);
    }
  })
}

var depth = 4;
buildTree(allSpecies, depth, function(err){
  printOutline(allSpecies,"");
});

function printOutline(node, indent){
  console.log(indent + node.name);
  indent += "  ";
  _(node.children).each(function(child){
    printOutline(child, indent);
  });
}


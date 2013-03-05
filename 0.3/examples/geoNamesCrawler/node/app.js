var request = require('request'),
    _ = require('underscore'),
    async = require('async');

function Node(id, name){
  this.id = id;
  this.name = name;
  this.children = [];
}

var earth = new Node("6295630", "Earth");

function childrenURL(id){
  return [
    "http://api.geonames.org/",
    "childrenJSON?formatted=true&geonameId=",
    id ,"&username=currankelleher&style=full"
  ].join("");
};

function buildTree(node, depth, callback){
  var url = childrenURL(node.id);
  request(url, function (error, response, json) {
    var subtasks = [],
        data = JSON.parse(json);
    if(data.status &&
       data.status.message.substr(0, 11) == "no children")
      callback(null);
    else{
      _(data.geonames).each(function(childData){
        var id = childData.geonameId,
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
  })
}

var depth = 2;
buildTree(earth, depth, function(err){
  printOutline(earth,"");
});

function printOutline(node, indent){
  console.log(indent + node.name);
  indent += "  ";
  _(node.children).each(function(child){
    printOutline(child, indent);
  });
}


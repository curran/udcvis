require(["jquery", "underscore", "async"], function($, _, async){
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
    $.get(childrenURL(node.id), function(data){
      var subtasks = [];
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
    });
  }

  $("#geoTree").html("loading...");
  var depth = 3,
      message = "<br>still loading...";
  buildTree(earth, depth, function(){
    message = "<br>Finished loading.";
    console.log(JSON.stringify(earth));
  });

  setInterval(function(){
    var htmlTree = treeToHTML(earth);
    $("#geoTree").html(htmlTree + message);
  }, 1000);

  function treeToHTML(node){
    var arr = [
      "<ul>",
      "<li>"+node.name+"</li>"
    ];
    _(node.children).each(function(child){
      arr.push(treeToHTML(child));
    });
    arr.push("</ul>");
    return arr.join("");
  }
});

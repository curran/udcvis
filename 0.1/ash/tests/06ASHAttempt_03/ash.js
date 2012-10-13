var ASH = (function() {
  var socket = io.connect('/');
  socket.on('executeTransaction', function (data) {
    var tokens = data.split(" ");
    actionSource = 'server';
    if(tokens[0] == 's')
    //commitTransaction("s "+resource+" "+property+" "+value);
      ASH.set(tokens[1],tokens[2],tokens[3]);
    else if(tokens[0] == 'us')
    //commitTransaction("us "+resource+" "+property);
      ASH.set(tokens[1],tokens[2]);
    actionSource = 'client';
  });
  function send(data){
    socket.emit('commitTransaction', data);
  }
  
  var resourceIdCounter = 0; // used by ASH.genResourceId()
  //TODO solve the big problem of:
  // - client A does "s 5 type foo"
  // - client B does "s 5 type bar"
  // - server gets client A's message
  // - server gets client B's message
  // - result is a conflicting state, where
  //   the resource "5" is created with type "foo",
  //   then "created again" with type "bar"
  // solution: have the server give out "tickets" like at
  // a meat counter, so maybe each clients get 50 ids
  // for resources it can create with the GUARANTEE that
  // it will not use an ID also used by another client.
  // As the client uses up the unique ids, maybe when there are
  // 25 left, request 50 more from the server so there is always enough
  // In the case where no ids are left, calls to ASH.genResourceId()
  // must wait until the server gives the client more ids. This
  // means that ASH.genResourceId() must be made asynchronous.
  
  var plugins = {}; // keys = type ids, values = resource factories
  
  var resourceTypes = {}; // keys = resource ids, values = type ids
  
  var resources = {}; // keys = resource ids, values = objects with
  // set(property,value) and unset(property)

  var actionSource = 'client'; // one of 'client' or 'server'

  return { // public interface
    registerPlugin: function (plugin) {
      plugins[plugin.type] = plugin;
    },
    genResourceId: function(){
      return (resourceIdCounter++).toString();
    },
    set: function (resource, property, value) {
      if(actionSource == 'client')
        send("s "+resource+" "+property+" "+value);
      else if(actionSource == 'server'){
        if(property == ASH.TYPE){
          var type = value;
          resourceTypes[resource] = type;
          resources[resource] = plugins[type].create(resource);
        }
        else
          resources[resource].set(property,value);
      }
    },
    unset: function (resource, property) {
      if(actionSource == 'client')
        commitTransaction("us "+resource+" "+property);
      else if(actionSource == 'server'){
        if(property == ASH.TYPE)
          plugins[resourceTypes[resource]].delete(resource);
      }
    },
    TYPE : "type"
  };
})();

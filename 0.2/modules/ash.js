// This modules provides collaboration and session history functionality.
define([],function(){
  // ## How ASH Works
  //
  // Private variables of the ASH singleton:
  //
  //  * `socket` The connection to the server (WebSocket).
  /** the `io` object comes from socket.io.js */
  /** TODO figure out how to use require.js with socket.io */
  //var socket = io.connect('');

  //  * `sendToServer(transaction)` Sends an ASH 
  //     transaction to the server.
  var sendToServer = function(transaction){
    socket.emit('commit', transaction);
  }

  // ### Internal Transaction API
  // Internally, ASH deals with transactions using the following API:
  var transaction = (function(){
    var transaction = {};
    // `transaction.create()` Creates a transaction object, 
    //  which has the following properties:
    transaction.create = function(){
      var actions = [];
      return {
        set: function(resource, property, value){
          var action = {
            type: "set",
            resource: resource,
            property: property,
            value: value
          };
          /* TODO collapse redundant actions */
          actions.push(setAction);
        },
        unset: function(resource, property){
          var action = {
            type: "unset",
            resource: resource,
            property: property
          };
          /* TODO collapse redundant actions */
          actions.push();
        }
      };
    }
    return transaction;
  })();
  // `plugins` is an object that contains the registered plugins.
  //
  //  * Keys are plugin type strings.
  //  * Values are plugin objects
  //    * Passed in from `registerPlugin()`.
  var plugins = {};

  // `queue` is the client's local transaction queue.
  // 
  //  * Transactions on this queue have been sent to the
  //    server but not yet received back from the server.
  var queue = [];

  // `currentTransaction` is non-null when
  //var currentTransaction;

  // `generateResourceId(callback(id))` 
  var generateResourceId = (function(){
    var idCounter = 0;
    return function(callback){
      callback(idCounter++);
    }
  })();

  // `idToType`
  //
  //  * Keys: resource id.
  //  * Values: the type of the plugin that created the resource.
  var idToType = {}

  // ## Exported API
  var ash = {
    registerPlugin: function(plugin){
      plugins[plugin.type] = plugin;
    },
    createResource: function(type, callback){
      generateResourceId(function(id){
        idToType[id] = type;
        callback(plugins[type].create(id));
      });
    },
    set: function(id, property, value){
      plugins[idToType[id]].set(id, property, value);
    }
  };
  return ash;
});

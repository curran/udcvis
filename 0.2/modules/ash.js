// This modules provides collaboration and session history functionality.
define(['udcvis/ash/transaction', 'udcvis/ash/server', 'udcvis/queue',
        'lib/backbone'],
    function(ashTransaction, ashServer, queue, Backbone){
  var log = false;
  // ## How ASH Works
  //
  // Private variables of the ASH singleton:
  //
  // `server` The server API. This is either:
  //
  //  * An API backed by a real server, or
  //  * A dummy server for unit testing.
  //  * For API details, see [ash server docs](../ash/docs/server.html).
  var server;

  // `setServer(server)` initializes a server object.
  // 
  //  * Called with a real server by default.
  //  * May be called again with a dummy server
  //    for unit testing via `ash.useDummyServer()`.
  var setServer = function(newServer){
    if(server)
      server.off('execute', execute);
    newServer.on('execute', execute);
    server = newServer;
  }

  // `q` is the client's local transaction queue.
  // 
  //  * Transactions on this queue have been sent to the
  //    server but not yet received back from the server.
  var q = queue.create();

  // `commit()` gets called when a transaction is locally executed.
  var commit = function(transaction){
    if(log)
      console.log('ASH: Committing transaction: '+
                  JSON.stringify(transaction));
    q.enqueue(currentTransaction);
    _(transaction.actions).each(function(action){
      _set(action.resource, action.property, action.value);
    });
    server.commit(transaction);
  };

  // `execute` is called when an execute message
  // is received from the server.
  //
  var execute = function(transaction){
    var queuedTx = q.dequeue();
    // * If there is a transaction in the local queue,
    if(queuedTx){
      //  * Check if it matches the received transaction.
      if(transaction.equals(queuedTx)){
      //   * If it matches, do nothing, as it is
      //     already locally executed and has been dequeued.
        if(log)
          console.log('ASH: Dequeued transaction: '+
                      JSON.stringify(transaction));
      }
      else{
      //   * If it does not match, rollback all queued
      //     transactions in inverse order. They will
      //     be executed later when they are received from the server.
        var tx = q.pop();
        while(tx){
          rollback(tx);
          tx = q.pop();
        }
        rollback(queuedTx);
      }
    }
    // * If there is no queued transaction,
    else{
    //
    //   * Then execute the one from the server.
      if(transaction.type === 'set'){
        if(log)
          console.log('ASH: Executing transaction from server: '+
                      JSON.stringify(transaction));
        _set(transaction.resource,
             transaction.property,
             transaction.value);
      }
    }
  };

  var currentTransaction;

  var _set = function(id, property, value){
    resources[id][property] = value;
  };

  // `plugins` is an object that contains the registered plugins.
  //
  //  * Keys are plugin type strings.
  //  * Values are plugin objects
  //    * Passed in from `registerPlugin()`.
  var plugins = {};

  // `resources`
  //
  //  * Keys: resource id.
  //  * Values: resources (not proxies, the real thing)
  var resources = {};

  // `proxiesByType`
  //
  //  * Keys: plugin types
  //  * Values: arrays of all resource proxy objects 
  //    created for the type.
  var proxiesByType = {};
        
  var indexProxy = function(proxy){
    console.log(proxy);
    var proxies = proxiesByType[proxy.type];
    if(!proxies)
      proxiesByType[proxy.type] = [proxy];
    else
      proxies.push(proxy);
  };

  var createResourceProxy = function(resource, id, type){
    var properties = {
      id:{
        value: id,
        writable: false
      },
      type:{
        value: type,
        writable: false
      }
    };
    _(_(resource).keys()).each(function(property){
      if(_(resource).has(property)){
        properties[property] = {
          set: function(value){
            ash.set(id, property, value);
            proxy.trigger('change');
            proxy.trigger('change:'+property, value);
          },
          get: function(){
            return resource[property];
          }
        };
      }
    });
    var proxy = Object.create({}, properties);
    _(proxy).extend(Backbone.Events);
    return proxy;
  };

  // ## Public API
  var ash = {
    // `ash.registerPlugin(plugin)` Registers an ASH plugin, which is
    // an object that manages the lifecycle of a certain type of
    // ASH resources.
    //
    // The `plugin` argument should have the following properties:
    //
    //  * `plugin.type` A string identifying the type of ASH resource
    //     this plugin can create and manage;
    //  * `plugin.create(id)` A factory function that creates an ASH
    //     resource with the given id.
    //  * `plugin.destroy(id)` A function that cleans up all resources
    //     associated with a previously created ASH resource with the 
    //     given id.
    //  * `plugin.set(id, property, value)`
    registerPlugin: function(plugin){
      plugins[plugin.type] = plugin;
    },
    createResource: function(type, callback){
      server.genResourceId(function(id){
        var resource = plugins[type].create(id);
        resources[id] = resource;
        var proxy = createResourceProxy(resource, id, type);
        indexProxy(proxy);
        callback(proxy);
      });
    },
    set: function(id, property, value){
      if(!currentTransaction){
        currentTransaction = ashTransaction.create();
        // The JS event loop is used to delay execution.
        //
        //  * So multiple sequential calls to `ash.set()`
        //    or `ash.unset()` are bundled into a single 
        //    transaction.
        setTimeout(function(){
          commit(currentTransaction);
          currentTransaction = undefined;
        }, 0);
      }
      currentTransaction.set(id, property, value);
    },
    list: function(type){
      return proxiesByType[type] || [];
    },
    useDummyServer: function(){
      setServer(ashServer.dummy);
      return ashServer.dummy;
    },
    enableLogging: function(){
      log = true;
    }
  };
  return ash;
});

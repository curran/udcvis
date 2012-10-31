// The client-side server API that ASH uses.
define(['lib/backbone','udcvis/queue'],
    function(Backbone, queue){
  //  * `server.commit(actions)` Sends an ASH 
  //     transaction to the server.
  return {
    dummy: (function(){
      var clientId = 1;
      var q = queue.create();
      var resourceIdCounter = 1;
      var txLog = [];
      var server = _.extend({
        commit: function(transaction, callback){
          transaction.clientId = clientId;
          txLog.push(transaction);
          q.enqueue(transaction);
          setTimeout(function(){
            //  * `server.on('execute', function(transaction){})`
            //    This syntax sets up a callback function to execute
            //    when an `execute` message is received from the server.
            server.trigger('execute', q.dequeue());
          }, 500);
        },
        genResourceId: function(callback){
          callback(resourceIdCounter++);
        },
        txLog: txLog
      }, Backbone.Events);
      return server;
    })()
  };
});

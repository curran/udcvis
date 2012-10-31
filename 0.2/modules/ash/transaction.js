// ### ASH Internal Transaction API
// Internally, ASH deals with transactions using the following API:
define([], function(){
  var txIdCounter = 0;
  // `transaction.create()` Creates a transaction object, 
  //  which has the following properties:
  return {
    create: function(){
      var actions = [];
      var _tx = {
        id: txIdCounter++,
        set: function(resource, property, value){
          var action = {
            type: "set",
            resource: resource,
            property: property,
            value: value
          };
          // If setting a value that has already
          // been set in this transaction,
          for(var i = 0; i < actions.length; i++)
            if(actions[i].resource === resource)
              if(actions[i].property === property){
                // * Replace the old action with the new one.
                actions[i] = action;
                return;
              }
          // * Otherwise add the action to the list.
          actions.push(action);
        },
        actions: actions,
        equals: function(tx){
          return (tx.id === _tx.id)
              && (tx.clientId === _tx.clientId);
        }
      };
      return _tx;
    }
  }
});

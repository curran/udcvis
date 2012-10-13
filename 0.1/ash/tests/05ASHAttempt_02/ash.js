var ASH = (function() {
  // private members
  
  var resourceIdCounter = 0;
  
  var plugins = {}; // keys = type ids, values = resource factories
  
  var resourceTypes = {}; // keys = resource ids, values = type ids
  
  var resources = {}; // keys = resource ids, values = objects with set(property,value) and unset(property)

  function privateMethod () {
    // ...
  }

  return { // public interface
    registerPlugin: function (plugin) {
      plugins[plugin.type] = plugin;
    },
    genResourceId: function(){
      return (resourceIdCounter++).toString();
    },
    set: function (resource, property, value) {
      if(property == ASH.TYPE){
        var type = value;
        resourceTypes[resource] = type;
        resources[resource] = plugins[type].create(resource);
      }
      else
        resources[resource].set(property,value);
    },
    unset: function (resource, property) {
      if(property == ASH.TYPE){
        plugins[resourceTypes[resource]].delete(resource);
      }
    },
    TYPE : "type"
  };
})();

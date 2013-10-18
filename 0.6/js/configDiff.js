define(['underscore'], function (_) {
  return function(oldConfig, newConfig) {
    var oldAliases = _.keys(oldConfig),
        newAliases = _.keys(newConfig),
        addedAliases = _.difference(newAliases, oldAliases),
        persistentAliases = _.intersection(newAliases, oldAliases),
        actions = [];

    addedAliases.forEach(function (alias) {
      var allProperties = newConfig[alias],
          moduleName = allProperties.module,
          properties = _.omit(allProperties, 'module');

      actions.push({
        type: 'add',
        args: [alias, moduleName]
      });

      _.pairs(properties).forEach(function (pair) {
        var key = pair[0],
            value = pair[1];
        actions.push({
          type: 'set',
          args: [alias, key, value]
        });
      });
    });

    persistentAliases.forEach(function (alias) {
      var newProperties = newConfig[alias],
          oldProperties = oldConfig[alias];
      _.keys(newProperties).forEach(function (key) {
        var newValue = JSON.stringify(newProperties[key]),
            oldValue = JSON.stringify(oldProperties[key]);
        if(newValue !== oldValue) {
          actions.push({
            type: 'set',
            args: [alias, key, newValue]
          });
        }
      });
    });

    return actions;
  }
});

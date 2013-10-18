define([], function () {
  var createAction = {
    'add': function (alias, moduleName) {
      return {
        type: 'add',
        args: [alias, moduleName]
      };
    },
    'remove': function (alias) {
      return {
        type: 'remove',
        args: [alias]
      };
    },
    'set': function (alias, property, value) {
      return {
        type: 'set',
        args: [alias, property, value]
      };
    },
    'unset': function (alias, property) {
      return {
        type: 'unset',
        args: [alias, property]
      };
    }
  };
  return createAction;
});

define(['underscore', 'backbone', 'createAction'], function (_, Backbone, createAction) {
  return function constructor() {
    var state = {},
        config = {},
        execute = {
          'add': function (alias, moduleName) {
            state[alias] = {'module': moduleName};
            return createAction['remove'](alias);
          },
          'remove': function (alias) {
            var moduleName = state[alias].moduleName;
            delete state[alias];
            return createAction['add'](alias, moduleName);
          },
          'set': function (alias, property, value) {
            var oldValue = state[alias][property];

            state[alias][property] = value;

            if (oldValue === undefined){
              return createAction['unset'](alias, property);
            } else {
              return createAction['set'](alias, property, oldValue);
            }
          }
        };

    _.extend(state, Backbone.Events);

    state.transition = function (actions) {
      var undo = actions.map(function (action) {
        return execute[action.type].apply(null, action.args);
      }).reverse();
      state.trigger('transition', {
        do: actions,
        undo: undo
      });
    }

    state.serialize = function () {
      return JSON.stringify(state);
    };

    return state;
  }

});

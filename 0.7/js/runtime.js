define(['async'], function (async) {

  function getModule(moduleName, callback) {
    require(['../modules/' + moduleName], callback);
  }

  return function constructor(state){
    var runtime = {},
        components = {},
        execute = {
          'add': function (alias, moduleName, callback) {
            getModule(moduleName, function (module) {
              components[alias] = module();
              callback();
            });
          },
          'remove': function (alias, callback) {
            var component = components[alias];
            if (component.destroy) {
              component.destroy();
            }
            delete components[alias];
            callback();
          },
          'set': function (alias, property, value, callback) {
            components[alias].set(property, value);
            callback();
          }
        },
        actionQueue = async.queue(function (action, callback) {
          var args = action.args.concat([callback]);
          execute[action.type].apply(null, args);
        });

    state.on('transition', function (transition) {
      actionQueue.push(transition.do);
    });
  };
});

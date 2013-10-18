/**
 * This module manages an application state and changes to it.
 *
 * The structure of an application state is a two-level JavaScript Object that
 * defines a collection of running components each having properties speficied.
 * In Java the structure could be expressed as Map<String, Map<String, String>>.
 * The keys of the first level are called "aliases", as they provide 
 * identifiers for loaded components. The values mapped from those aliases are 
 * key-value mappings that specify property values for the component.
 *
 * The "module" property within component configurations is a special property
 * that defines the name used to load the module that creates the component.
 * The module name is passed into the asynchronous `getModule` function.
 *
 * Curran Kelleher 10/17/2013
 */
define(['backbone', 'async', 'configDiff'], function (Backbone, async, configDiff) {
  return {
    create: function (getModule) {

      /**
       * `components` contains the running components.
       * Keys are aliases, values are objects returned by component
       * factory methods.
       */
      var components = {},

          // `app` contains the exported application state API.
          app = {},

          // `config` contains the state configuration object.
          config = {},

          // `actionQueue` is an asynchronous queue that executes
          // action objects (see configDiff.js).
          actionQueue = async.queue(function (action, callback) {
            if (action.type === 'add') {
              app.add.apply(null, action.args.concat([callback]));
            } else {
              app[action.type].apply(null, action.args);
              callback();
            }
          }, 1);

      /**
       * There are four actions that modify the application state:
       *
       *  * `add` adds a component to the configuration. To instantiate
       *    an added component, an alias and module name are required.
       *    The provided module name becomes the value of the "module"
       *    property, and is passed into the `getModule` function to 
       *    dynamically load the module. The module is expected to be a 
       *    factory for components with a factory method called `create` 
       *    that takes the app state as an argument.
       */
      app.add = function (alias, moduleName, callback) {
        getModule(moduleName, function (module) {
          components[alias] = module.create(app);
          config[alias] = {module: moduleName};
          callback();
        });
      };

      /**
       *  * `remove` (the inverse of `add`) removes a component from the
       *    configuration. The alias is used to specify which component to
       *    remove.  When this operation takes place, the `destroy()` method is
       *    called on the component, which should free all resources used by 
       *    the component.
       */
      app.remove = function (alias) {
        var component = components[alias];
        if (component.destroy) {
          component.destroy();
        }
        delete components[alias];
        delete config[alias];
      };

      /**
       *  * `set` sets a property of a given component. This action causes
       *    a getter-setter function to be invoked on the component with the
       *    given alias. `property` is the name of the getter-setter function,
       *    and `value` is the value passed into the function.
       */
      app.set = function (alias, property, value) {
        components[alias][property](value);
        config[alias][property] = value;
      };

      /**
       *  * `unset` (the inverse of `set`) sets a property of a given component
       *    to be its original default value, and removes the property-value 
       *    pair from the application state.
       */
      app.unset = function (alias, key) {
        //TODO handle this
        delete config[alias][property];
      };

      app.setConfig = function (newConfig) {
        var actions = configDiff(config, newConfig);
        actionQueue.push(actions);
      }

      return app;
    }
  };
});

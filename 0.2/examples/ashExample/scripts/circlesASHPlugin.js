define(['udcvis/ash', 'underscore'], function(ash, _){
  var circles = {};
  var CIRCLE_TYPE = 'circle';

  var defaultCircle = {
    x: 0, y:0, radius: 10
  };

  ash.registerPlugin({
    type: CIRCLE_TYPE,
    create: function(id){
      return circles[id] = _.clone(defaultCircle);
    },
    destroy: function(id){
      delete(circles[id]);
    }
  });
  
  return Object.create({},{
    type: {
      value: CIRCLE_TYPE,
      writable: false,
      configurable: false
    }
  });
});

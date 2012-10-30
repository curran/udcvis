define(["udcvis/ash", 'underscore'], function(ash, _) {
  function createCirclesPlugin(){
    var defaultCircle = {
      x: 0, y:0, radius: 10
    };
    function createCircle(id){
      var circle = _.clone(defaultCircle);
      circle.exports = Object.create({}, {
        x:{
          set: function(value){
            console.log("id = "+id);
            ash.set(id, 'x', value);
          },
          get: function(){
            return circle.x;
          }
        },
        y:{
          set: function(value){
            ash.set(id, 'y', value);
          },
          get: function(){
            return circle.y;
          }
        },
        radius:{
          set: function(value){
            ash.set(id, 'radius', value);
          },
          get: function(){
            return circle.radius;
          }
        }
      });
      return circle;
    }
    var circles = {};
    return {
      type: 'circle',
      create: function(id){
        var circle = createCircle(id);
        //circle.exports.x = 5;
        circles[id] = circle;
        return circle.exports;
      },
      destroy: function(id){
        delete(circles[id]);
      },
      set: function(id, property, value){
        console.log([id,property,value]);
        circles[id][property] = value;
      }
    };
  }

  var circlesPlugin = createCirclesPlugin();
  ash.registerPlugin(circlesPlugin);
  describe("ASH", function() {
    it("should be able to create resources", function(){
      ash.createResource(circlesPlugin.type, function(circle){
        expect(circle.x).toEqual(0);
        expect(circle.y).toEqual(0);
        expect(circle.radius).toEqual(10);

        circle.x = 50;
        expect(circle.x).toEqual(50);
      });
    });
  });
});

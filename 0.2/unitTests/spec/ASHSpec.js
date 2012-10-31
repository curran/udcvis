define(["udcvis/ash", 'underscore'], function(ash, _) {
  function createCirclesPlugin(){
    var defaultCircle = {
      x: 0, y: 0, radius: 10
    };
    function createCircle(){
      var circle = _.clone(defaultCircle);
      return circle;
    }
    var circles = {};
    return {
      type: 'circle',
      create: function(id){
        return circles[id] = createCircle();
      },
      destroy: function(id){
        delete(circles[id]);
      }
    };
  }

  ash.enableLogging();

  var dummyServer = ash.useDummyServer();

  var circlesPlugin = createCirclesPlugin();
  ash.registerPlugin(circlesPlugin);
  describe("ASH", function() {
    var circle;
    it("should be able to create resources", function(){
      var circleCreated = false;
      runs(function(){
        ash.createResource(circlesPlugin.type, function(resource){
          circle = resource;
          expect(circle.id).toEqual(1);
          expect(circle.x).toEqual(0);
          expect(circle.y).toEqual(0);
          expect(circle.radius).toEqual(10);
        });
      });
      waitsFor(function() {
        return circle;
      }, "Resource creation never occurred", 1000);
    });
    it("should be able to set resource properties", function(){
      circle.x = 50;
      // Test that the change does not take place immediately
      expect(circle.x).toEqual(0);
      // Allow the transaction to execute on 
      // the event loop...
      var txChecked = false;
      runs(function(){
        setTimeout(function(){
          // Test that the change does take place eventually
          expect(circle.x).toEqual(50);

          expect(dummyServer.txLog.length).toEqual(1);
          var tx = dummyServer.txLog[0];
          expect(tx.actions.length).toEqual(1);
          var action = tx.actions[0];
          expect(action.resource).toEqual(circle.id);
          expect(action.property).toEqual('x');
          expect(action.value).toEqual(50);
          txChecked = true;
        }, 0);
      });
      waitsFor(function(){
        return txChecked;
      }, "Transaction never checked.", 1000);
    });
    it("should collapse redundant set actions", function(){
      var txChecked = false;
      runs(function(){
        circle.y = 1000;
        circle.y = 100;
        circle.y = 10;
        setTimeout(function(){
          expect(dummyServer.txLog.length).toEqual(2);
          var tx = dummyServer.txLog[1];
          expect(tx.actions.length).toEqual(1);
          var action = tx.actions[0];
          expect(action.resource).toEqual(circle.id);
          expect(action.property).toEqual('y');
          expect(action.value).toEqual(10);
          txChecked = true;
        }, 0);
      });
      waitsFor(function(){
        return txChecked;
      }, "Transaction never checked.", 1000);
    });
  });
});

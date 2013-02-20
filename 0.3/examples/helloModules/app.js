require(["jquery", "underscore", "backbone", "async", 
         "collections/sorted-set", "myModule"],
        function($, _, Backbone, async, 
                 SortedSet, myModule) {
  var log = function(str){
    console.log(str);
    document.write(str+"<br>");
  };
  $(function() {
    log("jQuery is go");
    console.log(_);
    _.each(["go"], function(elem){
      log("Underscore is "+elem);
      var o = {};
      _.extend(o, Backbone.Events);
      o.on("change", function(msg) {
        log("Backbone is "+msg);
        async.nextTick(function(){
          log("async is go");

          var set = new SortedSet();
          set.add(1);

          set.toArray().sort(function () {
            return Math.random() - .5;
          }).forEach(function (value) {
            log("collections is go");
            myModule.speak(log);
          });
        });
      });
      o.trigger("change", "go");
    });
  });
});

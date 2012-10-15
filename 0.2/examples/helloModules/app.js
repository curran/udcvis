require(["jquery", "underscore", "backbone", "async"],
        function($, _, Backbone, async) {
  var log = function(str){
    console.log(str);
    document.write(str+"<br>");
  };
  $(function() {
    log("jQuery is go");
    _.each(["go"], function(elem){
      log("Underscore is "+elem);
      var o = {};
      _.extend(o, Backbone.Events);
      o.on("change", function(msg) {
        log("Backbone is "+msg);
        async.nextTick(function(){
          log("async is go");
        });
      });
      o.trigger("change", "go");
    });
  });
});

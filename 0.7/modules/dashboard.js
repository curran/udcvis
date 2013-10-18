define(['backbone'], function (Backbone) {
  return function constructor() {
    console.log('dashboard created');
    var dashboard = new Backbone.Model({
      divId: 'dashboard',
      layout: {}
    });
    dashboard.on('change:layout', function () {
      var layout = JSON.stringify(dashboard.get('layout'));
      console.log('layout changed to ' + layout);
    });
    return dashboard;
  }
});

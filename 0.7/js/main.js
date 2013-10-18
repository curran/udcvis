/**
 * The entry point for the application state configuration editor tool.
 *
 * This module composes the `editor`, `state`, and `runtime` modules.
 *
 * The initial configuration is taken from 'config.json'.
 *
 * Curran Kelleher 10/17/2013
 */
require(['tests', 'state', 'runtime', 'history', 'editor', 'jquery', 'createAction'], function (tests, State, Runtime, History, Editor, $, createAction) {
  //tests.run();

  var state = State(),
      runtime = Runtime(state);
  
  state.on('transition', function (transition) {
    console.log(JSON.stringify(transition, null, 2));
  });
  state.transition([
    createAction['add']('dashboard', 'dashboard'),
    createAction['set']('dashboard', 'layout', {
      "orientation": "vertical",
      "children": [
        {
          "name": "vis1",
          "size": 3
        },
        {
          "name": "vis2",
          "size": 1
        }
      ]
    })
  ]);
  state.off('transition');


  //console.log('here');

  //$.getJSON('config.json', function (config) {
  //  editor.setConfig(config);
  //});


});

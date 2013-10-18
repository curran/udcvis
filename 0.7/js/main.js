/**
 * The entry point for the application state configuration editor tool.
 *
 * This module composes the `editor`, `state`, and `runtime` modules.
 *
 * The initial configuration is taken from 'config.json'.
 *
 * Curran Kelleher 10/17/2013
 */
require(['state', 'runtime', 'history', 'editor', 'jquery', 'createAction'], function (State, Runtime, History, Editor, $, createAction) {

  var state = State(),
      runtime = Runtime(state);
      //editor = Editor(state);
  
  state.on('transition', function (transition) {
  });
  state.transition([
    createAction['add']('component1', 'foo'),
    createAction['set']('component1', 'x', 500)
  ]);
  state.off('transition');

  console.log('here');

  //$.getJSON('config.json', function (config) {
  //  editor.setConfig(config);
  //});


});

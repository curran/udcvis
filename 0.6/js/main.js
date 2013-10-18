/**
 * The entry point for the application state configuration editor tool.
 *
 * This module composes the `editor` and `app` modules, which implement the
 * configuration editor and the application state.
 *
 * The initial configuration is taken from 'config.json'.
 *
 * Curran Kelleher 10/17/2013
 */
require(['app', 'editor', 'jquery', 'requireModule'], function (App, Editor, $, requireModule) {
  var app = App.create(requireModule),
      editor = Editor.create('editorDiv', app);

  $.getJSON('config.json', function (config) {
    editor.setConfig(config);
  });
});

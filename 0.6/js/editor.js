define(['codemirror', 'codemirrorJS', 'inlet', 'jquery'], function (CodeMirror, js, Inlet, $) {
  function create(divId, app) {
    var editorDiv = document.getElementById(divId),
        codeMirror = CodeMirror(editorDiv),
        settingText = false;

    codeMirror.setOption('mode', 'javascript');
    codeMirror.setSize('100%', '100%');
    Inlet(codeMirror);

    function updateText(newConfig) {
      var text = JSON.stringify(newConfig, null, 2);
      settingText = true;
      codeMirror.setOption('value', text);
      settingText = false;
    }

    codeMirror.on('change', function () {
      if (!settingText) {
        var newText = codeMirror.getValue(),
            newConfig;
        //try {
          newConfig = JSON.parse(newText);
          app.setConfig(newConfig);
        //} catch (e) {
        //  console.log("JSON Error");
        //}
      }
    });

    return {
      setConfig: function (newConfig) {
        updateText(newConfig);
        app.setConfig(newConfig);
      }
    };
  }
  return { create: create };
});

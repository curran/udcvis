/**
 * Unit tests.
 *
 * Curran Kelleher 10/17/2013
 */
define(['state', 'runtime', 'history', 'createAction'], function (State, Runtime, History, createAction) {
  function assertEqual(actual, expected) {
    if (actual !== expected) {
      throw new Error('got ' + actual + ', expected ' + expected);
    }
  }
  var expectedOutput = {
    "do": [
      {
        "type": "add",
        "args": [
          "component1",
          "foo"
        ]
      },
      {
        "type": "set",
        "args": [
          "component1",
          "x",
          500
        ]
      }
    ],
    "undo": [
      {
        "type": "unset",
        "args": [
          "component1",
          "x"
        ]
      },
      {
        "type": "remove",
        "args": [
          "component1"
        ]
      }
    ]
  };
  function run() {
    var state = State(),
        runtime = Runtime(state);
    
    state.on('transition', function (transition) {
      var actual = JSON.stringify(transition, null, 2),
          expected = JSON.stringify(expectedOutput, null, 2);
      assertEqual(actual, expected);
    });
    state.transition([
      createAction['add']('component1', 'foo'),
      createAction['set']('component1', 'x', 500)
    ]);
    state.off('transition');

    console.log('Unit tests passed');
  }
  return {run: run};
});

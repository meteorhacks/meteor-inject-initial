Tinytest.add(
  'Inject Helpers - _evalToText - function',
  function (test) {
    var func = function(res, html) {
      return res + html;
    };

    var result = Inject._evalToText(func, 'res', 'html');
    test.equal(result, 'reshtml');
  }
);

Tinytest.add(
  'Inject Helpers - _evalToText - text',
  function (test) {
    var result = Inject._evalToText('reshtml');
    test.equal(result, 'reshtml');
  }
);

Tinytest.add(
  'Inject Helpers - _checkForTextOrFunction - function',
  function (test) {
    var result = Inject._checkForTextOrFunction(function() {});
    test.ok();
  }
);

Tinytest.add(
  'Inject Helpers - _checkForTextOrFunction - text',
  function (test) {
    var result = Inject._checkForTextOrFunction('some-text');
    test.ok();
  }
);

Tinytest.add(
  'Inject Helpers - _checkForTextOrFunction - other',
  function (test) {
    try {
      var result = Inject._checkForTextOrFunction({}, 'message');
      test.fail();
    } catch(ex) {
      test.equal(ex.message, 'message');
    }
  }
);

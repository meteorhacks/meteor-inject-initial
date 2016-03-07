// This test assumes Inject._hijackWrite is called inside of a
// a WebApp.connectHandlers.use function (it is).

Tinytest.add(
  'Inject Core - injecting',
  function (test, done) {
    var context = {
      _header: {},
      _hadBody: true
    };

    context.write = function(html) {
      test.equal(html, "<!DOCTYPE html>ABC</html>");
    };

    var htmlText = "<!DOCTYPE html>---</html>"

    Inject.rawModHtmlFuncs = {
      "id1": function(html, res) {
        test.isTrue(res, context);
        test.equal(html, htmlText);
        return html.replace('---', 'ABC');
      }
    }

    Inject._hijackWrite(context);
    context.write(htmlText);

    test.equal(context.iInjected, true);
    Inject.rawModHtmlFuncs = {};
  }
);


/*

We no longer override http.OutgoingMessage.prototype.write; instead
we hijack res.write in connect middleware.

Tinytest.add(
  'Inject Core - injecting',
  function (test, done) {
    var context = {
      _header: {},
      _hadBody: true
    };
    var http = Npm.require('http');
    var originalWrite = http.OutgoingMessage.prototype.write;

    var htmlText = "<!DOCTYPE html>---</html>"

    Inject.rawModHtmlFuncs = {
      "id1": function(html, res) {
        test.isTrue(res, context);
        test.equal(html, htmlText);
        return html.replace('---', 'ABC');
      }
    }

    originalWrite.call(context, htmlText);
    test.equal(context.iInjected, true);
    Inject.rawModHtmlFuncs = {};
  }
);

*/
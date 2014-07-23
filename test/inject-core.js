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

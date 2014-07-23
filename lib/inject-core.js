// Hijack core node API and attach data to the response dynamically
// We are simply using this hack because, there is no way to alter
// Meteor's html content on the server side

var http = Npm.require('http');

var originalWrite = http.OutgoingMessage.prototype.write;
http.OutgoingMessage.prototype.write = function(chunk, encoding) {
  //prevent hijacking other http requests
  if(!this.iInjected &&
    encoding === undefined && /^<!DOCTYPE html>/.test(chunk)) {
    chunk = chunk.toString();

    for (id in Inject.rawModHtmlFuncs) {
      chunk = Inject.rawModHtmlFuncs[id](chunk, this);
      if (!_.isString(chunk)) {
        throw new Error('Inject func id "' + id + '" must return HTML, not '
          + typeof(chunk) + '\n' + JSON.stringify(chunk, null, 2));
      }
    }


    this.iInjected = true;
  }

  originalWrite.call(this, chunk, encoding);
};

//meteor algorithm to check if this is a meteor serving http request or not
Inject.appUrl = function(url) {
  if (url === '/favicon.ico' || url === '/robots.txt')
    return false;

  // NOTE: app.manifest is not a web standard like favicon.ico and
  // robots.txt. It is a file id we have chosen to use for HTML5
  // appcache URLs. It is included here to prevent using an appcache
  // then removing it from poisoning an app permanently. Eventually,
  // once we have server side routing, this won't be needed as
  // unknown URLs with return a 404 automatically.
  if (url === '/app.manifest')
    return false;

  // Avoid serving app HTML for declared routes such as /sockjs/.
  if (typeof(RoutePolicy) != 'undefined' && RoutePolicy.classify(url))
    return false;

  // we currently return app HTML on all URLs by default
  return true;
};

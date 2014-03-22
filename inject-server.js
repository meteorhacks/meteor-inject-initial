Inject = {

  // Wrapper for injectMeta() which will JSON.stringify obj, and parse with Inject.getObj()
  obj: function(name, obj) {
    this.meta(name, JSON.stringify(obj));
  },
  objList: {},

  // Inserts a META called `name`, whose `content` can be retrieved with Inject.getMeta()
  meta: function(name, content) {
    if (!_.isString(content))
      throw new Error('Inject.meta(name, content) expects `content` to be a String');
    this.rawHead("<meta name='" + name.replace("'", '&apos;')
      + "' content='" + content.replace("'", '&apos;') + "'>");
  },
  metaList: {},

  rawHead: function(text) {
    this.rawHeads.push(text);
  },
  rawHeads: [],

  rawBody: function(text) {
    this.rawBodies.push(text);
  },
  rawBodies: [],

  // The callback receives the entire HTML page and must return a modified version
  rawModHtml: function(func) {
    this.rawModHtmlFuncs.push(func);
  },
  rawModHtmlFuncs: [ ],


  /* -- Below code is all internal */

  injectHeads: function(html) {
    var injectHtml = '';
    for (var i=0; i < Inject.rawHeads.length; i++)
      injectHtml = '  ' + Inject.rawHeads[i] + '\n';
    return html.replace('<head>', '<head>\n' + injectHtml + '\n');
  },
  injectBodies: function(html) {

  }


};

Inject.rawModHtml(Inject.injectHeads);


/*
 * All this code is below adapted from Fast Render by Arunoda Susiripala
 * https://github.com/arunoda/meteor-fast-render/blob/master/lib/server/inject.js
 *
 */

//When a HTTP Request comes, we need to figure out is it a proper request
//then get some query data
//then hijack html return by meteor
//code below, does that in abstract way

var http = Npm.require('http');

var originalWrite = http.OutgoingMessage.prototype.write;
http.OutgoingMessage.prototype.write = function(chunk, encoding) {
  //prevent hijacking other http requests
  if(!this.iInjected && 
    encoding === undefined && /<!DOCTYPE html>/.test(chunk)) {

    for (var i=0; i < Inject.rawModHtmlFuncs.length; i++)
      chunk = Inject.rawModHtmlFuncs[i](chunk);

    this.iInjected = true;
  }

  originalWrite.call(this, chunk, encoding);
};

//meteor algorithm to check if this is a meteor serving http request or not
//add routepolicy package to the fast-render
function appUrl(url) {
  if (url === '/favicon.ico' || url === '/robots.txt')
    return false;

  // NOTE: app.manifest is not a web standard like favicon.ico and
  // robots.txt. It is a file name we have chosen to use for HTML5
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

Inject = {

  // Wrapper for injectMeta() which will EJSON.stringify obj, and parse with Inject.getObj()
  obj: function(id, data, res) {
  	if (!(_.isObject(data) || _.isFunction(data)))
      throw new Erorr('Inject.obj(id, data [,res]) expects `data` to be an Object or Function');

    if (res)
    	this.resAssign(res, 'objList', id, data);
    else
    	this.objList[id] = data;
  },
  objList: {},

  // Inserts a META called `id`, whose `content` can be retrieved with Inject.getMeta()
  meta: function(id, data, res) {
  	if (!(_.isString(data) || _.isFunction(data)))
      throw new Erorr('Inject.meta(id, data [,res]) expects `data` to be an String or Function');

    if (res)
    	this.resAssign(res, 'metaList', id, data);
    else
    	this.metaList[id] = data;
  },
  metaList: {},

  rawHead: function(id, textOrFunc, res) {
    if (res)
      this.resAssign(res, 'rawHeads', id, textOrFunc);
    else
      this.rawHeads[id] = textOrFunc;
  },
  rawHeads: {},

  rawBody: function(id, textOrFunc, res) {
    if (res)
      this.resPush(res, 'rawBodies', id, textOrFunc);
    else
	  this.rawBodies[id] = text;
  },
  rawBodies: {},

  // The callback receives the entire HTML page and must return a modified version
  rawModHtml: function(id, func) {
  	if (!_.isFunction(func))
			throw new Error('Inject func id "' + id + '" should be a function, not '
				+ typeof(func));
    this.rawModHtmlFuncs[id] = func;
  },
  rawModHtmlFuncs: {},

  /* -- Below code is all internal */

  injectObjects: function(html, res) {
  	var objs = _.extend({}, Inject.objList, res.Inject && res.Inject.objList);
  	if (_.isEmpty(objs))
  		return html;

  	var obj, injectHtml = '';
  	for (id in objs) {
  		obj = _.isFunction(objs[id]) ? objs[id](res) : objs[id];
  		injectHtml += "  <script id='" + id.replace("'", '&apos;')
        + "' type='application/ejson'>" + EJSON.stringify(obj) 
        + "</script>";
  	}

    return html.replace('<head>', '<head>\n' + injectHtml + '\n');
  },

  injectMeta: function(html, res) {
  	var metas = _.extend({}, Inject.metaList, res.Inject && res.Inject.metaList);
  	if (_.isEmpty(metas))
  		return html;

  	var meta, injectHtml = '';
  	for (id in metas) {
  		meta = _.isFunction(metas[id]) ? metas[id](res) : metas[id];
  		injectHtml += "  <meta id='" + id.replace("'", '&apos;')
      	+ "' content='" + meta.replace("'", '&apos;') + "'>", res;
  	}

    return html.replace('<head>', '<head>\n' + injectHtml + '\n');
  },

  injectHeads: function(html, res) {
    var heads = _.extend({}, Inject.rawHeads, res.Inject && res.Inject.rawHeads);
    if (_.isEmpty(heads))
    	return html;

    var injectHtml = '';
    for (id in heads)
      injectHtml = '  ' + heads[id] + '\n';

    return html.replace('<head>', '<head>\n' + injectHtml + '\n');
  },
  injectBodies: function(html, res) {
    var bodies = _.extend({}, Inject.rawBodies, res.Inject && res.Inject.rawBodies);
    if (_.isEmpty(bodies))
    	return html;

    var injectHtml = '';
    for (id in bodies)
      injectHtml = '  ' + bodies[id] + '\n';

    return html.replace('<body>', '<body>\n' + injectHtml + '\n');
  },

  // ensure object exists and store there
  resAssign: function(res, key, id, value) {
    if (!res.Inject)
      res.Inject = {};
    if (!res.Inject[key])
      res.Inject[key] = {};
    res.Inject[key][id] = value;
  }

};

Inject.rawModHtml('injectHeads', Inject.injectHeads);
Inject.rawModHtml('injectBodies', Inject.injectBodies);
Inject.rawModHtml('injectObjects', Inject.injectObjects);

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

    for (id in Inject.rawModHtmlFuncs) {
      chunk = Inject.rawModHtmlFuncs[id](chunk, this);
      if (!_.isString(chunk))
      	throw new Error('Inject func id "' + id + '" must return HTML, not '
      		+ typeof(chunk));
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

Inject = {
  // stores in a script type=application/ejson tag, accessed with Injected.obj('id')
  obj: function(id, data, res) {
    this._checkForObjOrFunction(data,
      'Inject.obj(id, data [,res]) expects `data` to be an Object or Function');

    if (res) {
      this._resAssign(res, 'objList', id, data);
    } else {
      this.objList[id] = data;
    }
  },
  objList: {},

  // Inserts a META called `id`, whose `content` can be accessed with Injected.meta()
  meta: function(id, data, res) {
    this._checkForTextOrFunction(data,
      'Inject.meta(id, data [,res]) expects `data` to be an String or Function');

    if (res) {
      this._resAssign(res, 'metaList', id, data);
    } else {
      this.metaList[id] = data;
    }
  },
  metaList: {},

  rawHead: function(id, textOrFunc, res) {
    this._checkForTextOrFunction(textOrFunc,
      'Inject.rawHead(id, content [,res]) expects `content` to be an String or Function');

    if (res) {
      this._resAssign(res, 'rawHeads', id, textOrFunc);
    } else {
      this.rawHeads[id] = textOrFunc;
    }
  },
  rawHeads: {},

  rawBody: function(id, textOrFunc, res) {
    this._checkForTextOrFunction(textOrFunc,
      'Inject.rawBody(id, content [,res]) expects `content` to be an String or Function');

    if (res) {
      this._resAssign(res, 'rawBodies', id, textOrFunc);
    } else {
      this.rawBodies[id] = textOrFunc;
    }
  },
  rawBodies: {},

  // The callback receives the entire HTML page and must return a modified version
  rawModHtml: function(id, func) {
    if (!_.isFunction(func)) {
      var message = 'Inject func id "' + id + '" should be a function, not ' + typeof(func);
      throw new Error(message);
    }

    this.rawModHtmlFuncs[id] = func;
  },
  rawModHtmlFuncs: {},

  _injectObjects: function(html, res) {
    var objs = _.extend({}, Inject.objList, res.Inject && res.Inject.objList);
    if (_.isEmpty(objs)) {
      return html;
    }

    var obj, injectHtml = '';
    for (id in objs) {
      obj = _.isFunction(objs[id]) ? objs[id](res) : objs[id];
      injectHtml += "  <script id='" + id.replace("'", '&apos;')
        + "' type='application/ejson'>" + EJSON.stringify(obj)
        + "</script>\n";
    }

    return html.replace('<head>', '<head>\n' + injectHtml);
  },

  _injectMeta: function(html, res) {
    var metas = _.extend({}, Inject.metaList, res.Inject && res.Inject.metaList);
    if (_.isEmpty(metas))
      return html;

    var injectHtml = '';
    for (id in metas) {
      var meta = this._evalToText(metas[id], res, html);
      injectHtml += "  <meta id='" + id.replace("'", '&apos;')
        + "' content='" + meta.replace("'", '&apos;') + "'>\n", res;
    }

    return html.replace('<head>', '<head>\n' + injectHtml);
  },

  _injectHeads: function(html, res) {
    var heads = _.extend({}, Inject.rawHeads, res.Inject && res.Inject.rawHeads);
    if (_.isEmpty(heads))
      return html;

    var injectHtml = '';
    for (id in heads) {
      var head = this._evalToText(heads[id], res, html);
      injectHtml += '  ' + head + '\n';
    }

    return html.replace('<head>', '<head>\n' + injectHtml);
  },

  _injectBodies: function(html, res) {
    var bodies = _.extend({}, Inject.rawBodies, res.Inject && res.Inject.rawBodies);
    if (_.isEmpty(bodies))
      return html;

    var injectHtml = '';
    for (id in bodies) {
      var body = this._evalToText(bodies[id], res, html);
      injectHtml += '  ' + body + '\n';
    }

    return html.replace('<body>', '<body>\n' + injectHtml);
  },

  // ensure object exists and store there
  _resAssign: function(res, key, id, value) {
    if (!res.Inject)
      res.Inject = {};
    if (!res.Inject[key])
      res.Inject[key] = {};
    res.Inject[key][id] = value;
  },

  _checkForTextOrFunction: function (arg, message) {
    if(!(_.isString(arg) || _.isFunction(arg))) {
      throw new Error(message);
    }
  },

  _checkForObjOrFunction: function (arg, message) {
    if(!(_.isObject(arg) || _.isFunction(arg))) {
      throw new Error(message);
    }
  },

  // we don't handle errors here. Let them to handle in a higher level
  _evalToText: function(textOrFunc, res, html) {
    if(_.isFunction(textOrFunc)) {
      return textOrFunc(res, html);
    } else {
      return textOrFunc;
    }
  }
};

Inject.rawModHtml('injectHeads', Inject._injectHeads.bind(Inject));
Inject.rawModHtml('injectMeta', Inject._injectMeta.bind(Inject));
Inject.rawModHtml('injectBodies', Inject._injectBodies.bind(Inject));
Inject.rawModHtml('injectObjects', Inject._injectObjects.bind(Inject));

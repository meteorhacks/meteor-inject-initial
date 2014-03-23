Inject = {

	getObj: function(name) {
		var json = this.metas[name];
		return json ? EJSON.parse(json) : undefined;
	},

	getMeta: function(name) {
		return this.metas[name];
	},

	/* internal methods */

	parseMetas: function() {
		var metaEls = document.getElementsByTagName('meta');
		for (var i=0; i < metaEls.length; i++)
			this.metas[ metaEls[i].getAttribute('name') ]
				= metaEls[i].getAttribute('content');
	},
	metas: {}
}

Inject.parseMetas();

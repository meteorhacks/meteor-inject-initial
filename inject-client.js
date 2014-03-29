Injected = {

	obj: function(name) {
		var json = document.getElementById(name);
		// Apparently .text doesn't work on some IE's.
		return json ? EJSON.parse(json.innerHTML) : undefined;
	},

	meta: function(name) {
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

Injected.parseMetas();

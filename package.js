Package.describe({
    summary: "Allow injection of arbitrary data to initial Meteor HTML page"
});

Npm.depends({
  "connect": "2.12.0"
});

Package.on_use(function (api) {
	api.use('routepolicy', 'server');
	api.use(['ejson', 'underscore'], ['client','server']);

	api.add_files('inject-server.js', 'server');
	api.add_files('inject-client.js', 'client');

	api.export('Inject', 'server');
	api.export('Injected', 'client');
});

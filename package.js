Package.describe({
    summary: "Allow injection of arbitrary data to initial Meteor HTML page"
});

Npm.depends({
  "connect": "2.12.0"
});

Package.on_use(function (api) {
	api.use('ejson', ['client','server']);
	api.add_files('inject-server.js', 'server');
	api.add_files('inject-client.js', 'client');
	api.export('Inject', ['client', 'server']);
});

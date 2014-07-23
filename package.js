Package.describe({
    summary: "Allow injection of arbitrary data to initial Meteor HTML page"
});

Npm.depends({
  "connect": "2.12.0"
});

Package.on_use(function (api) {
  configurePackage(api);
	api.export('Inject', 'server');
	api.export(['Injected', 'Inject'], 'client');
});

Package.on_test(function(api) {
  configurePackage(api);
  api.use('tinytest', 'server');
  api.add_files('test/inject-helpers.js');
  api.add_files('test/inject-public-api.js');
  api.add_files('test/inject-internal-api.js');
});

function configurePackage(api) {
  api.use('routepolicy', 'server');
  api.use(['ejson', 'underscore'], ['client','server']);

  api.add_files('lib/inject-server.js', 'server');
  api.add_files('lib/inject-core.js', 'server');
  api.add_files('lib/inject-client.js', 'client');
}

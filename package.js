Package.describe({
  summary: "Allow injection of arbitrary data to initial Meteor HTML page",
  version: "1.0.5",
  git: "https://github.com/meteorhacks/meteor-inject-initial.git",
  name: "meteorhacks:inject-initial"
});

Npm.depends({
  "connect": "2.12.0"
});

Package.onUse(function (api) {
  configurePackage(api);
	api.export('Inject', 'server');
	api.export(['Injected', 'Inject'], 'client');
});

Package.onTest(function(api) {
  configurePackage(api);
  api.use('tinytest', ['client', 'server']);

  api.addFiles('test/inject-helpers.js', 'server');
  api.addFiles('test/inject-public-api.js', 'server');
  api.addFiles('test/inject-internal-api.js', 'server');
  api.addFiles('test/inject-core.js', 'server');

  api.addFiles('test/injected-public-api.js', ['server', 'client']);
});

function configurePackage(api) {
  if(api.versionsFrom) {
    api.versionsFrom('METEOR@1.0');
  }
  
  api.use(['routepolicy', 'webapp'], 'server');
  api.use(['ejson', 'underscore'], ['client','server']);

  api.addFiles('lib/inject-server.js', 'server');
  api.addFiles('lib/inject-core.js', 'server');
  api.addFiles('lib/inject-client.js', 'client');
}

Package.describe({
  summary: "Deprecated.  Use meteorhacks:inject-initial instead.",
  version: "1.0.2",
  git: "https://github.com/meteorhacks/meteor-inject-initial.git",
  name: "gadicohen:inject-initial"
});

Package.on_use(function (api) {
  api.use('meteorhacks:inject-initial@1.0.2');
  api.imply('meteorhacks:inject-initial');

  // XXX COMPAT WITH PACKAGES BUILT FOR 0.9.0.
  //
  // (in particular, packages that have a weak dependency on this
  // package, since then exported symbols live on the
  // `Package[gadicohen:inject-initial]` object)
  api.export('Inject', 'server');
  api.export(['Injected', 'Inject'], 'client');
});

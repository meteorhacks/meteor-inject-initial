# inject-initial

API to modify the initial HTML sent by Meteor to the client.  An abstraction
of the approach first used by Arunoda Susiripala in [fast-render](https://atmosphere.meteor.com/package/fast-render).

**Preview release** but is already being used in a number of projects.

Released under the MIT license (see the [LICENSE](LICENSE) file).

## How, when, why, etc?

This script is targetted at advanced smart package developers.  Sometimes we
want to pass data with the original HTML request to make the site available
quicker.  Note, if you're just wanting to accelerate data that is made
available via publish/subscribe functions, use [fast-render](https://atmosphere.meteor.com/package/fast-render).

Put `api.use('inject-initial', ['client', 'server']);` in `package.js`.
The injected data is (in the higher level methods) inserted at the top
of the HEAD element, and BEFORE any other scripts are called.  Thus,
you can access this data when your script is loaded, without needing
to wait for anything or use any callbacks (like a return from a
`Meteor.call()` to get initial data).

## API (from highest to lowest level)

Common arguments:

* **id**: Each method expects a unique `id`.  This is used both to give you
useful output in error handling, and to allow you to override/replace functions
in time.  E.g. instead of having a function executed on every connect that
retrieves data, simply call the same method with the same id every time the
data changes (using `observeChanges` on a server-only collection, or whatever).

* **data**: The data parameter can either be a value, or a function.  If
a function, it will be called when serving the page to generate appropriate
data.  It doesn't make sense to use a function in conjunction with a `res`
argument (see below), but we won't stop you for now.

* **res** is the optional final argument.  If ommitted,
the data will be injected on every HTTP request.  If present, the data will
be specific for (and used only on) that http connection resource (set it
up with a regular connectHandler).

Methods:

* `Inject.obj(id, objOrFunc, [res])` on server, accessible via
`Injected.obj(id)` on the client.  Obj
of course may contain data only, and no references (to functions, other objects,
etc). Stored in EJSON in a
`&lt;script id="id" type="application/ejson">&lt;</script>`
tag in the HEAD; this allows it to work even if
`browserPolicy.content.disallowInlineScripts()` has been called.  Note that `id`
must be unique in the entire DOM!  e.g.

```js
if (Meteor.isServer)
  Inject.obj('myData', myData);

// always available immediately
if (Meteor.isClient)
  var myData = Injected.obj('myData');
```

* `Inject.meta(id, textOrFunc, [res])`, accessible via `Injected.meta(id)`
on client.  This is plain text that will be stored in a META tag in the HEAD.

* `Inject.rawHead(id, textOrFunc, [res])`.  `text` will be inserted in the HTML HEAD.

* `Inject.rawBody(id, textOrFunc, [res])`.  `text` will be inserted in the HTML BODY.

* `Inject.rawModHtml(id, func)`.  At injection time, calls `func(html, res)` with
the full page HTML which it expects to be returned, in full, after modification.
`res` is the current http connection response request.
e.g.

```js
Inject.rawModHtml('doSomething', function(html) {
	return html.replace(/blah/, 'something');
});
```

* `Inject.appUrl(url)`.  A copy of Meteor's internal appUrl() method to see
if a resource is should be served the initial HTML page.

**Example of a "per-request" handler:**

```js
if (Meteor.isServer) {
  if (!Package.appcache)
  WebApp.connectHandlers.use(function(req, res, next) {
    if(Inject.appUrl(req.url)) {
      Inject.obj('myData', makeDataFor(req), res);
    }
    next();
  });
}
	
if (Meteor.isClient) {
  // available immediately
  var myData = Injected.getObj('myData');
}
```

## App Cache

In general, you probably don't want to pass any information if appcache
is enabled, since you'll never be able to refresh it until you update
your app again and force a HCP.  However, we'll leave these in your hands
to decide... maybe that behvaviour is ok.  But consider including
appcache as a weak dependency, checking for `Package.appcache`, and
avoiding injecting when present (instead use whatever method you used
previously to pass data to the client).

## Security

This script is very useful for passing general info on the initial request,
and fast-render is very useful for passing authenticated publication info,
with the additional security checks in place.

To that end, if you are attempting to use this script to pass priviledged
information to the client, be aware of the kinds of issues pointed out
by Emily Stark
[here](https://groups.google.com/d/msg/meteor-talk/1Fg4rNk9JZM/ELX3672QsrEJ)
and take the necessary precautions in the callbacks you pass to
inject-initial.

## Roadmap

* Should we have functions like `isInjectable()` to check if appcache is
loaded, and what else?

* Should we have an Inject.script(), which is inserted inline if possible
(i.e. if appcache disabled and disallowInlineScripts not set), otherwise,
automatically calls (as a 1st script in the head) another page served by
the package, which includes the script (great for appcache but slows down
page load otherwise?).

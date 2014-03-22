# inject-initial

API to modify the initial HTML sent by Meteor to the client.  An abstraction
of the approach first used by Arunoda Susiripala in [fast-render](https://atmosphere.meteor.com/package/fast-render).

## How, when, why, etc?

This script is targetted at advanced smart package developers.  Sometimes we
want to pass data with the original HTML request to make the site available
quicker.  Note, if you're just wanting to "accelerate" data that is made
available anyway via publish/subscribe functions, use [fast-render](https://atmosphere.meteor.com/package/fast-render).

Put `api.use('inject-initial', ['client', 'server']);` in `package.js`.
The injected data is (in the higher level methods) inserted at the top
of the HEAD element, and BEFORE any other scripts are called.  Thus,
you can access this data when your script is loaded, without needing
to wait for anything or use any callbacks.

## API (from highest to lowest level)

With the functions below, `res` is the optional final argument.  If ommitted,
the data will be injected on every HTTP request.  If present, the data will
be specific for (and used only on) that http connection resource.

* `Inject.obj(name, obj, [res])` let's you use `Inject.getObj(name)`.  Obj of course 
contain data only, and not any references (to functions, other objects, etc).
Stored in JSON in a META tag in the HEAD; this allows it to work even if
`browserPolicy.content.disallowInlineScripts()` has been called.

* `Inject.meta(name, content, [res])` let's you use `Inject.getMeta(name)`.  This
is plain text that will be stored in a META tag in the HEAD.

* `Inject.rawHead(text, [res])`.  `text` will be inserted in the HTML HEAD.

* `Inject.rawBody(text, [res])`.  `text` will be inserted in the HTML BODY.

* `Inject.rawModHtml(func)`.  At injection time, calls `func(html, res)` with
the full page HTML which it expects to be returned, in full, after modification.
`res` is the current http connection resource.
e.g.

```js
Inject.rawModHtml(function(html) {
	return html.replace(/blah/, 'something');
});
```

* `Inject.appUrl(url)`.  A copy of Meteor's internal appUrl() method to see
if a resource is should be served the initial HTML page.

## Example

```js
if (Meteor.isServer) {
  if (!Package.appcache)
  WebApp.connectHandlers.use(function(req, res, next) {
    if(Inject.appUrl(req.url)) {
      Inject.obj('myData', makeData(), res);
    }
    next();
  });
}
	
if (Meteor.isClient) {
  // available immediately
  var myData = Inject.getObj('myData');
}
```

## Roadmap

* Should we have functions like `isInjectable()` to check if appcache is
loaded, and what else?

* Should we have an Inject.script(), which is inserted inline if possible
(i.e. if appcache disabled and disallowInlineScripts not set), otherwise,
automatically calls (as a 1st script in the head) another page served by
the package, which includes the script (great for appcache but slows down
page load otherwise?).

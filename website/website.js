if (Meteor.isClient) {
  console.log(Injected.obj('cow'));

  Template.hello.greeting = function () {
    return "Welcome to website.";
  };

  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Inject.obj('cow', {goes:'moo'});
  Inject.rawModHtml('moo', function(html) {
  	return { a: 1};
  });

  Meteor.startup(function () {
    // code to run on server at startup
  });
}

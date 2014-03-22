if (Meteor.isClient) {
  console.log(Inject.getObj('cow'));

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

  Meteor.startup(function () {
    // code to run on server at startup
  });
}

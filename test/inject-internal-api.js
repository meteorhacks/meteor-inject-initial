Tinytest.add(
  'Inject Internal Apis - _injectHeads',
  function (test) {
    function func() {};
    Inject.rawHeads = {
      "id1": "one",
      "id2": "two"
    };

    var res = {
      Inject: {
        rawHeads: {
          "id3": "three",
          "id4": "four"
        }
      }
    };

    var newHtml = Inject._injectHeads("<head></head>", res);
    test.equal(newHtml, "<head>\none\ntwo\nthree\nfour\n</head>")
  }
);

Tinytest.add(
  'Inject Internal Apis - _injectBodies',
  function (test) {
    function func() {};
    Inject.rawBodies = {
      "id1": "one",
      "id2": "two"
    };

    var res = {
      Inject: {
        rawBodies: {
          "id3": "three",
          "id4": "four"
        }
      }
    };

    var newHtml = Inject._injectBodies("<body></body>", res);
    test.equal(newHtml, "<body>\none\ntwo\nthree\nfour\n</body>")
  }
);

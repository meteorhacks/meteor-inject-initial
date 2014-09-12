Tinytest.add(
  'Inject Internal Apis - _injectHeads',
  function (test) {
    function func() {};
    Inject.rawHeads = {
      "id1": "one",
      "id2": "two$$"
    };

    var res = {
      Inject: {
        rawHeads: {
          "id3": "three",
          "id4": "four$$"
        }
      }
    };

    var newHtml = Inject._injectHeads("<head></head>", res);
    test.equal(newHtml, "<head>\none\ntwo$$\nthree\nfour$$\n</head>")
  }
);

Tinytest.add(
  'Inject Internal Apis - _injectBodies',
  function (test) {
    function func() {};
    Inject.rawBodies = {
      "id1": "one",
      "id2": "two$$"
    };

    var res = {
      Inject: {
        rawBodies: {
          "id3": "three",
          "id4": "four$$"
        }
      }
    };

    var newHtml = Inject._injectBodies("<body></body>", res);
    test.equal(newHtml, "<body>\none\ntwo$$\nthree\nfour$$\n</body>")
  }
);

Tinytest.add(
  'Inject Internal Apis - _injectObjects',
  function (test) {
    function func() {};
    Inject.objList = {
      "id1": { value: 1 },
      "id2": { value: "two$$" }
    };

    var res = {
      Inject: {
        objList: {
          "id3": { value: "three$$" },
          "id4": { value: 4 }
        }
      }
    };

    var newHtml = Inject._injectObjects("<head></head>", res);
    test.equal(newHtml, "<head>\n"
      + "  <script id='id1' type='application/ejson'>{\"value\":1}</script>\n"
      + "  <script id='id2' type='application/ejson'>{\"value\":\"two$$\"}</script>\n"
      + "  <script id='id3' type='application/ejson'>{\"value\":\"three$$\"}</script>\n"
      + "  <script id='id4' type='application/ejson'>{\"value\":4}</script>\n"
      + "</head>");
  }
);

Tinytest.add(
  'Inject Internal Apis - _injectMeta',
  function (test) {
    function func() {};
    Inject.metaList = {
      "id1": "1",
      "id2": "two$$"
    };

    var res = {
      Inject: {
        metaList: {
          "id3": "three",
          "id4": "four$$"
        }
      }
    };

    var newHtml = Inject._injectMeta("<head></head>", res);
    test.equal(newHtml, "<head>\n"
      + "  <meta id='id1' content='1'>\n"
      + "  <meta id='id2' content='two$$'>\n"
      + "  <meta id='id3' content='three'>\n"
      + "  <meta id='id4' content='four$$'>\n"
      + "</head>");
  }
);

Tinytest.add(
  'Inject Public Apis - rawModHtml - text',
  function (test) {
    function func() {};
    Inject.rawModHtml('id', func);
    test.isTrue(func == Inject.rawModHtmlFuncs['id']);
  }
);

Tinytest.add(
  'Inject Public Apis - obj - without res',
  function (test) {
    var aa = {hello: 10};
    Inject.obj('id1', aa);
    test.equal(aa, Inject.objList['id1']);
  }
);

Tinytest.add(
  'Inject Public Apis - obj - with res',
  function (test) {
    var aa = {hello: 10};
    var res = {};
    Inject.obj('id1', aa, res);
    test.equal(aa, res.Inject.objList['id1']);
  }
);

Tinytest.add(
  'Inject Public Apis - meta - without res',
  function (test) {
    var aa = 'text';
    Inject.meta('id1', aa);
    test.equal(aa, Inject.metaList['id1']);
  }
);

Tinytest.add(
  'Inject Public Apis - meta - with res',
  function (test) {
    var aa = 'text';
    var res = {};
    Inject.meta('id1', aa, res);
    test.equal(aa, res.Inject.metaList['id1']);
  }
);

Tinytest.add(
  'Inject Public Apis - rawHead - without res',
  function (test) {
    var aa = 'text';
    Inject.rawHead('id1', aa);
    test.equal(aa, Inject.rawHeads['id1']);
  }
);

Tinytest.add(
  'Inject Public Apis - rawHead - with res',
  function (test) {
    var aa = 'text';
    var res = {};
    Inject.rawHead('id1', aa, res);
    test.equal(aa, res.Inject.rawHeads['id1']);
  }
);

Tinytest.add(
  'Inject Public Apis - rawBody - without res',
  function (test) {
    var aa = 'text';
    Inject.rawBody('id1', aa);
    test.equal(aa, Inject.rawBodies['id1']);
  }
);

Tinytest.add(
  'Inject Public Apis - rawBody - with res',
  function (test) {
    var aa = 'text';
    var res = {};
    Inject.rawBody('id1', aa, res);
    test.equal(aa, res.Inject.rawBodies['id1']);
  }
);

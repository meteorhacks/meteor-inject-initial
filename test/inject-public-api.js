Tinytest.add(
  'Inject Server - rawModHtml - text',
  function (test) {
    function func() {};
    Inject.rawModHtml('id', func);
    test.isTrue(func == Inject.rawModHtmlFuncs['id']);
  }
);

Tinytest.add(
  'Inject Server - obj - without res',
  function (test) {
    var aa = {hello: 10};
    Inject.obj('id1', aa);
    test.equal(aa, Inject.objList['id1']);
  }
);

Tinytest.add(
  'Inject Server - obj - with res',
  function (test) {
    var aa = {hello: 10};
    var res = {};
    Inject.obj('id1', aa, res);
    test.equal(aa, res.Inject.objList['id1']);
  }
);

Tinytest.add(
  'Inject Server - meta - without res',
  function (test) {
    var aa = 'text';
    Inject.meta('id1', aa);
    test.equal(aa, Inject.metaList['id1']);
  }
);

Tinytest.add(
  'Inject Server - meta - with res',
  function (test) {
    var aa = 'text';
    var res = {};
    Inject.meta('id1', aa, res);
    test.equal(aa, res.Inject.metaList['id1']);
  }
);

Tinytest.add(
  'Inject Server - rawHead - without res',
  function (test) {
    var aa = 'text';
    Inject.rawHead('id1', aa);
    test.equal(aa, Inject.rawHeads['id1']);
  }
);

Tinytest.add(
  'Inject Server - rawHead - with res',
  function (test) {
    var aa = 'text';
    var res = {};
    Inject.rawHead('id1', aa, res);
    test.equal(aa, res.Inject.rawHeads['id1']);
  }
);

Tinytest.add(
  'Inject Server - rawBody - without res',
  function (test) {
    var aa = 'text';
    Inject.rawBody('id1', aa);
    test.equal(aa, Inject.rawBodies['id1']);
  }
);

Tinytest.add(
  'Inject Server - rawBody - with res',
  function (test) {
    var aa = 'text';
    var res = {};
    Inject.rawBody('id1', aa, res);
    test.equal(aa, res.Inject.rawBodies['id1']);
  }
);

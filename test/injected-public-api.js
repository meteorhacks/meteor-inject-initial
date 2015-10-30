/*
 * Tests for client side functions
 */

if (Meteor.isServer) {

  Inject.obj('injected-obj', { value: 'injected-obj-data'} );
  Inject.meta('injected-meta', 'injected-meta-data');
}

if (Meteor.isClient) {

  Tinytest.add(
    'Inject Public Apis - obj - Injected.obj (client-side)',
    function (test) {
      test.equal(Injected.obj('injected-obj'), { value: 'injected-obj-data' });
    }
  );

  Tinytest.add(
    'Inject Public Apis - meta - Injected.meta (client-side)',
    function (test) {
      test.equal(Injected.meta('injected-meta'), 'injected-meta-data');
    }
  );

}


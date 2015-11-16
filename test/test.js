var assert = require('should');
var jsizes = require('../.');
var util = require('util');

// coverage
jsizes.create();

describe('jsizes', function() {
  it('jsizes.create', function() {
    var resizer = jsizes.create({
      x: 0, y: 0,
      width: 100, height: 100,
      anglar: 0
    });
    resizer.resize('nw', [10, 10]);
    console.log(resizer.getRect());
  });
});

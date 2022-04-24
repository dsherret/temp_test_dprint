// Block scoped definitions work poorly for global variables, temporarily enable var
/* eslint-disable no-var */

// this will work in the browser via browserify
declare var assert: typeof _chai.assert;
declare var expect: typeof _chai.expect;
var _chai: typeof import("chai") = require("chai");
globalThis.assert = _chai.assert;
{
  // chai's builtin `assert.isFalse` is featureful but slow - we don't use those features,
  // so we'll just overwrite it as an alterative to migrating a bunch of code off of chai
  assert.isFalse = (expr: any, msg: string) => {
    if (expr !== false) throw new Error(msg);
  };

  const assertDeepImpl = assert.deepEqual;
  assert.deepEqual = (a, b, msg) => {
    if (ts.isArray(a) && ts.isArray(b)) {
      assertDeepImpl(
        arrayExtraKeysObject(a),
        arrayExtraKeysObject(b),
        "Array extra keys differ",
      );
    }
    assertDeepImpl(a, b, msg);

    function arrayExtraKeysObject(a: readonly unknown[]): object {
      const obj: { [key: string]: unknown } = {};
      for (const key in a) {
        if (Number.isNaN(Number(key))) {
          obj[key] = a[key];
        }
      }
      return obj;
    }
  };
}
globalThis.expect = _chai.expect;
/* eslint-enable no-var */
// empty ts namespace so this file is included in the `ts.ts` namespace file generated by the module swapover
// This way, everything that ends up importing `ts` downstream also imports this file and picks up its augmentation
namespace ts {}

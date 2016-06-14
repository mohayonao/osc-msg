"use strict";

const assert = require("power-assert");
const flatten = require("lodash.flatten");
const encode = require("../src/encode");

function _i(value) {
  return Array.from(new Uint8Array(new Int32Array([ value ]).buffer)).reverse();
}

function _f(value) {
  return Array.from(new Uint8Array(new Float32Array([ value ]).buffer)).reverse();
}

function _t(value) {
  return Array.from(new Uint8Array(new Int32Array([ value, 0 ]).buffer)).reverse();
}

function _s(value) {
  const length = Math.ceil((value.length + 1) / 4) * 4;
  const list = new Uint8Array(length);

  for (let i = 0; i < value.length; i++) {
    list[i] = value.charCodeAt(i);
  }

  return [].slice.call(list);
}

function $i(value) {
  return { type: "integer", value: value };
}

function $f(value) {
  return { type: "float", value: value };
}

function $a(value) {
  return { type: "array", value: value };
}

describe("encode(object: object, opts = {}): Buffer", () => {
  it("#bundle{}", () => {
    const object = {
      elements: []
    };
    const result = encode(object);
    const expected = new Buffer(flatten([
      _s("#bundle"), _t(0)
    ]));

    assert.deepEqual(result, expected);
  });
  it("#bundle{ /foo, /bar }", () => {
    const object = {
      timetag: 1,
      elements: [
        { address: "/foo", args: [] },
        { address: "/bar", args: [] }
      ]
    };
    const result = encode(object);
    const expected = new Buffer(flatten([
      _s("#bundle"), _t(1), _i(12), _s("/foo"), _s(","), _i(12), _s("/bar"), _s(",")
    ]));

    assert.deepEqual(result, expected);
  });
  it("#bundle{ /foo /bar #bundle{ /baz /qux } }", () => {
    const object = {
      timetag: 1,
      elements: [
        { address: "/foo", args: [] },
        { address: "/bar", args: [] },
        {
          timetag: 2,
          elements: [
            { address: "/baz", args: [] },
            { address: "/qux", args: [] }
          ]
        }
      ]
    };
    const result = encode(object);
    const expected = new Buffer(flatten([
      _s("#bundle"), _t(1), _i(12), _s("/foo"), _s(","), _i(12), _s("/bar"), _s(","),
      _i(48), _s("#bundle"), _t(2), _i(12), _s("/baz"), _s(","), _i(12), _s("/qux"), _s(",")
    ]));

    assert.deepEqual(result, expected);
  });
  it("/address", () => {
    const object = {
      address: "/address"
    };
    const result = encode(object);
    const expected = new Buffer(flatten([
      _s("/address"), _s(",")
    ]));

    assert.deepEqual(result, expected);
  });
  it("/counter 0 1 2 3", () => {
    const object = {
      address: "/counter",
      args: [ $i(0), $i(1), $i(2), $i(3) ]
    };
    const result = encode(object);
    const expected = new Buffer(flatten([
      _s("/counter"), _s(",iiii"), _i(0), _i(1), _i(2), _i(3)
    ]));

    assert.deepEqual(result, expected);
  });
  it("/matrix [ [ 1. 0. 0. ] [ 0. 1. 0. ] [ 0. 0. 1. ] ]", () => {
    const object = {
      address: "/matrix",
      args: [
        $a([
          $a([ $f(1), $f(0), $f(0) ]),
          $a([ $f(0), $f(1), $f(0) ]),
          $a([ $f(0), $f(0), $f(1) ])
        ])
      ]
    };
    const result = encode(object);
    const expected = new Buffer(flatten([
      _s("/matrix"), _s(",[[fff][fff][fff]]"), _f(1), _f(0), _f(0), _f(0), _f(1), _f(0), _f(0), _f(0), _f(1)
    ]));

    assert.deepEqual(result, expected);
  });
  it("with integer option", () => {
    const object = {
      address: "/matrix",
      args: [
        [
          [ 1, 0, 0 ],
          [ 0, 1, 0 ],
          [ 0, 0, 1 ]
        ]
      ]
    };
    const result = encode(object, { integer: true });
    const expected = new Buffer(flatten([
      _s("/matrix"), _s(",[[iii][iii][iii]]"), _i(1), _i(0), _i(0), _i(0), _i(1), _i(0), _i(0), _i(0), _i(1)
    ]));

    assert.deepEqual(result, expected);
  });
  it("error: invalid data type", () => {
    const object = {
      address: "/invalid-data-type",
      args: [
        { type: "function", value: () => {} }
      ]
    };
    const result = encode(object);

    assert(result.error instanceof Error);
  });
});

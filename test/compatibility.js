"use strict";

const assert = require("power-assert");
const oscmin = require("osc-min");
const flatten = require("lodash.flatten");
const oscmsg = require("../src");

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

describe("compatibility with osc-min", () => {
  it("#bundle{ /foo /bar }", () => {
    const object = {
      timetag: [ 0, 1 ],
      elements: [
        { address: "/foo", args: [] },
        { address: "/bar", args: [] }
      ]
    };
    const buffer = new Buffer(flatten([
      _s("#bundle"), _t(1), _i(12), _s("/foo"), _s(","), _i(12), _s("/bar"), _s(",")
    ]));

    assert.deepEqual(oscmsg.toBuffer(object), oscmin.toBuffer(object));
    assert.deepEqual(oscmsg.fromBuffer(buffer), oscmin.fromBuffer(buffer));
  });
  it("#bundle{ /foo /bar #bundle{ /baz /qux } }", () => {
    const object = {
      timetag: [ 0, 1 ],
      elements: [
        { address: "/foo", args: [] },
        { address: "/bar", args: [] },
        {
          timetag: [ 0, 2 ],
          elements: [
            { address: "/baz", args: [] },
            { address: "/qux", args: [] }
          ]
        }
      ]
    };
    const buffer = new Buffer(flatten([
      _s("#bundle"), _t(1), _i(12), _s("/foo"), _s(","), _i(12), _s("/bar"), _s(","),
      _i(48), _s("#bundle"), _t(2), _i(12), _s("/baz"), _s(","), _i(12), _s("/qux"), _s(",")
    ]));

    assert.deepEqual(oscmsg.toBuffer(object), oscmin.toBuffer(object));
    assert.deepEqual(oscmsg.fromBuffer(buffer), oscmin.fromBuffer(buffer));
  });
  it("/address", () => {
    const object = {
      address: "/address"
    };
    const buffer = new Buffer(flatten([ _s("/address"), _s(",") ]));

    assert.deepEqual(oscmsg.toBuffer(object), oscmin.toBuffer(object));
    assert.deepEqual(oscmsg.fromBuffer(buffer), oscmin.fromBuffer(buffer));
  });
  it("/counter 0 1 2 3", () => {
    const object = {
      address: "/counter",
      args: [ $i(0), $i(1), $i(2), $i(3) ]
    };
    const buffer = new Buffer(flatten([
      _s("/counter"), _s(",iiii"), _i(0), _i(1), _i(2), _i(3)
    ]));

    assert.deepEqual(oscmsg.toBuffer(object), oscmin.toBuffer(object));
    assert.deepEqual(oscmsg.fromBuffer(buffer), oscmin.fromBuffer(buffer));
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
    const buffer = new Buffer(flatten([
      _s("/matrix"), _s(",[[fff][fff][fff]]"), _f(1), _f(0), _f(0), _f(0), _f(1), _f(0), _f(0), _f(0), _f(1)
    ]));

    assert.deepEqual(oscmsg.toBuffer(object), oscmin.toBuffer(object));
    assert.deepEqual(oscmsg.fromBuffer(buffer), oscmin.fromBuffer(buffer));
  });
});

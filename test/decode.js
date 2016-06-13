"use strict";

const assert = require("power-assert");
const flatten = require("lodash.flatten");
const decode = require("../src/decode");

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

describe("decode(buffer: Buffer, opts = {}): object", () => {
  it("#bundle{}", () => {
    const buffer = new Buffer("#bundle");
    const result = decode(buffer);
    const expected = { timetag: 0, elements: [], oscType: "bundle" };

    assert.deepEqual(result, expected);
  });
  it("#bundle{ /foo /bar }", () => {
    const buffer = new Buffer(flatten([
      _s("#bundle"), _t(1), _i(12), _s("/foo"), _s(","), _i(12), _s("/bar"), _s(",")
    ]));
    const result = decode(buffer);

    assert.deepEqual(result, {
      timetag: 1,
      elements: [
        { address: "/foo", args: [], oscType: "message" },
        { address: "/bar", args: [], oscType: "message" }
      ],
      oscType: "bundle"
    });
  });
  it("#bundle{ /foo /bar #bundle{ /baz /qux } }", () => {
    const buffer = new Buffer(flatten([
      _s("#bundle"), _t(1), _i(12), _s("/foo"), _s(","), _i(12), _s("/bar"), _s(","),
      _i(48), _s("#bundle"), _t(2), _i(12), _s("/baz"), _s(","), _i(12), _s("/qux"), _s(",")
    ]));
    const result = decode(buffer);

    assert.deepEqual(result, {
      timetag: 1,
      elements: [
        { address: "/foo", args: [], oscType: "message" },
        { address: "/bar", args: [], oscType: "message" },
        {
          timetag: 2,
          elements: [
            { address: "/baz", args: [], oscType: "message" },
            { address: "/qux", args: [], oscType: "message" }
          ],
          oscType: "bundle"
        }
      ],
      oscType: "bundle"
    });
  });
  it("/address", () => {
    const buffer = new Buffer(flatten([ _s("/address"), _s(",") ]));
    const result = decode(buffer);
    const expected = { address: "/address", args: [], oscType: "message" };

    assert.deepEqual(result, expected);
  });
  it("/counter 0 1 2 3", () => {
    const buffer = new Buffer(flatten([
      _s("/counter"), _s(",iiii"), _i(0), _i(1), _i(2), _i(3)
    ]));
    const result = decode(buffer);

    assert.deepEqual(result, {
      address: "/counter",
      args: [ $i(0), $i(1), $i(2), $i(3) ],
      oscType: "message"
    });
  });
  it("/matrix [ [ 1. 0. 0. ] [ 0. 1. 0. ] [ 0. 0. 1. ] ]", () => {
    const buffer = new Buffer(flatten([
      _s("/matrix"), _s(",[[fff][fff][fff]]"), _f(1), _f(0), _f(0), _f(0), _f(1), _f(0), _f(0), _f(0), _f(1)
    ]));
    const result = decode(buffer);

    assert.deepEqual(result, {
      address: "/matrix",
      args: [
        $a([
          $a([ $f(1), $f(0), $f(0) ]),
          $a([ $f(0), $f(1), $f(0) ]),
          $a([ $f(0), $f(0), $f(1) ])
        ])
      ],
      oscType: "message"
    });
  });
  it("with strip option", () => {
    const buffer = new Buffer(flatten([
      _s("/matrix"), _s(",[[fff][fff][fff]]"), _f(1), _f(0), _f(0), _f(0), _f(1), _f(0), _f(0), _f(0), _f(1)
    ]));
    const result = decode(buffer, { strip: true });

    assert.deepEqual(result, {
      address: "/matrix",
      args: [
        [
          [ 1, 0, 0 ],
          [ 0, 1, 0 ],
          [ 0, 0, 1 ]
        ]
      ],
      oscType: "message"
    });
  });
  it("with strict option", () => {
    const buffer = new Buffer(flatten([
      _s("/not-exists-osc-tag-type-string")
    ]));
    const result = decode(buffer, { strict: true });

    assert(!!result.error);
  });
  it("error: not buffer", () => {
    const result = decode();

    assert(!!result.error);
  });
  it("error: not supported tag", () => {
    const buffer = new Buffer(flatten([
      _s("/not-supported-tag"), _s(",invalid tags"), _i(0)
    ]));
    const result = decode(buffer);

    assert(!!result.error);
  });
  it("error: unexpected ]", () => {
    const buffer = new Buffer(flatten([
      _s("/invalid-data-type"), _s(",]")
    ]));
    const result = decode(buffer);

    assert(result.error instanceof Error);
  });
  it("error: unexpected [", () => {
    const buffer = new Buffer(flatten([
      _s("/invalid-data-type"), _s(",[")
    ]));
    const result = decode(buffer);

    assert(result.error instanceof Error);
  });
  it("error: offset outside", () => {
    const buffer = new Buffer(flatten([
      _s("/offset-outside"), _s(",iiii"), _i(0), _i(1), _i(2)
    ]));
    const result = decode(buffer);

    assert(result.error instanceof Error);
  });
  it("error: #bundle contains error", () => {
    const buffer = new Buffer(flatten([
      _s("#bundle"), _t(1), _i(12), _s("/foo"), _s(",i")
    ]));
    const result = decode(buffer);

    assert(result.error instanceof Error);
  });
  it("error: #bundle offset outside", () => {
    const buffer = new Buffer(flatten([
      _s("#bundle"), _t(1), _i(16), _s("/foo"), _s(",")
    ]));
    const result = decode(buffer);

    assert(result.error instanceof Error);
  });
});

import assert from "power-assert";
import compile from "../src/compile";

function $i(value) {
  return { type: "integer", value: value };
}

function $f(value) {
  return { type: "float", value: value };
}

function $s(value) {
  return { type: "string", value: value };
}

function $T() {
  return { type: "true", value: true };
}

function $F() {
  return { type: "false", value: false };
}

function $N() {
  return { type: "null", value: null };
}

describe("compile(object: object, opts: object): object", () => {
  it("0", () => {
    let data = 0;
    let result = compile(data, {});

    assert.deepEqual(result, {
      address: "",
      types: "f",
      values: [ $f(0) ],
      bufferLength: 12,
      oscType: "message",
      error: null,
    });
  });
  it("[ 1, 2, 3 ]", () => {
    let data = [ $i(1), $i(2), $i(3) ];
    let result = compile(data, {});

    assert.deepEqual(result, {
      address: "",
      types: "[iii]",
      values: [ $i(1), $i(2), $i(3) ],
      bufferLength: 24,
      oscType: "message",
      error: null,
    });
  });
  it("/matrix [ [ 1, 0, 0 ], [ 0, 1, 0 ], [ 0, 0, 1 ] ]", () => {
    let data = {
      address: "/matrix",
      args: [ [ [ 1, 0, 0 ], [ 0, 1, 0 ], [ 0, 0, 1 ] ] ],
    };
    let result = compile(data, {});

    assert.deepEqual(result, {
      address: "/matrix",
      types: "[[fff][fff][fff]]",
      values: [ $f(1), $f(0), $f(0), $f(0), $f(1), $f(0), $f(0), $f(0), $f(1) ],
      bufferLength: 64,
      oscType: "message",
      error: null,
    });
  });
  it("/complex", () => {
    let now = Date.now();
    let data = {
      elements: [
        {
          timetag: now,
          elements: [
            {
              address: "/complex",
              args: [ true, false, null, "xxx" ],
            },
          ],
        },
      ],
    };
    let result = compile(data, {});

    assert.deepEqual(result, {
      timetag: 0,
      elements: [
        {
          timetag: now,
          elements: [
            {
              address: "/complex",
              types: "TFNs",
              values: [ $T(), $F(), $N(), $s("xxx") ],
              bufferLength: 24,
              oscType: "message",
              error: null,
            },
          ],
          bufferLength: 44,
          oscType: "bundle",
          error: null,
        },
      ],
      bufferLength: 64,
      oscType: "bundle",
      error: null,
    });
  });
  it("with integer option", () => {
    let data = {
      address: "/matrix",
      args: [ [ [ 1, 0, 0 ], [ 0, 1, 0 ], [ 0, 0, 1 ] ] ],
    };
    let result = compile(data, { integer: true });

    assert.deepEqual(result, {
      address: "/matrix",
      types: "[[iii][iii][iii]]",
      values: [ $i(1), $i(0), $i(0), $i(0), $i(1), $i(0), $i(0), $i(0), $i(1) ],
      bufferLength: 64,
      oscType: "message",
      error: null,
    });
  });
  it("with strict option", () => {
    let data = {};
    let result = compile(data, { strict: true });

    assert(result.error instanceof Error);
  });
  it("with strict option", () => {
    let data = {
      address: "/strict",
      args: [
        { type: "integer", value: NaN },
      ],
    };
    let result = compile(data, { strict: true });

    assert(result.error instanceof Error);
  });
  it("error: Invalid data", () => {
    let data = {
      elements: [
        {
          address: "/invalid-data",
          args: [
            [ () => {} ],
          ],
        },
      ],
    };
    let result = compile(data, {});

    assert(result.error instanceof Error);
  });
});

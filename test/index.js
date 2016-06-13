"use strict";

const assert = require("power-assert");
const index = require("../src");
const decode = require("../src/decode");
const encode = require("../src/encode");

describe("index", () => {
  it("exports", () => {
    assert(typeof index.decode === "function");
    assert(index.decode === decode);
    assert(typeof index.encode === "function");
    assert(index.encode === encode);
    assert(typeof index.fromBuffer === "function");
    assert(index.fromBuffer === decode);
    assert(typeof index.fromObject === "function");
    assert(index.fromObject === encode);
    assert(typeof index.toBuffer === "function");
    assert(index.toBuffer === encode);
    assert(typeof index.toObject === "function");
    assert(index.toObject === decode);
  });
});

"use strict";

const assert = require("power-assert");
const Writer = require("../src/Writer");
const Reader = require("../src/Reader");
const types = require("../src/Tag").types;
const tags = require("../src/Tag").tags;

describe("Tag", () => {
  let writer, reader;

  beforeEach(() => {
    let buffer = new Buffer(16);

    writer = new Writer(buffer);
    reader = new Reader(buffer);
  });

  describe('["integer"]', () => {
    it("works", () => {
      assert(types["integer"].tag === "i");
      assert(types["integer"].size() === 4);
      assert(types["integer"].validate(0) === true);
      assert(types["integer"].validate(-10) === true);
      assert(types["integer"].validate(1.5) === false);
      assert(types["integer"].validate(Infinity) === false);
      assert(types["integer"].validate(NaN) === false);
      assert(types["integer"].valueOf(0) === 0);
      assert(types["integer"].valueOf(Math.PI) === 3);
      assert(types["integer"].valueOf(Infinity) === 0);
      assert(types["integer"].valueOf("3") === 3);
      assert(types["integer"].valueOf(NaN) === 0);

      types["integer"].write(writer, 1);
      assert(types["integer"].read(reader) === 1);

      assert(tags["i"] === types["integer"]);
    });
  });
  describe('["float"]', () => {
    it("works", () => {
      assert(types["float"].tag === "f");
      assert(types["float"].size() === 4);
      assert(types["float"].validate(0) === true);
      assert(types["float"].validate(-10) === true);
      assert(types["float"].validate(1.5) === true);
      assert(types["float"].validate(Infinity) === true);
      assert(types["float"].validate(NaN) === false);
      assert(types["float"].valueOf(0) === 0);
      assert(types["float"].valueOf(Math.PI) === Math.PI);
      assert(types["float"].valueOf(Infinity) === Infinity);
      assert(types["float"].valueOf("3") === 3);
      assert(types["float"].valueOf(NaN) === 0);

      types["float"].write(writer, 1.234);
      assert(types["float"].read(reader) === Math.fround(1.234));

      assert(tags["f"] === types["float"]);
    });
  });
  describe('["string"]', () => {
    it("works", () => {
      assert(types["string"].tag === "s");
      assert(types["string"].size("foo") === 4);
      assert(types["string"].size("quux") === 8);
      assert(types["string"].validate(0) === false);
      assert(types["string"].validate("0") === true);
      assert(types["string"].valueOf(0) === "0");
      assert(types["string"].valueOf("3") === "3");

      types["string"].write(writer, "foo");
      assert(types["string"].read(reader) === "foo");

      assert(tags["s"] === types["string"]);
    });
  });
  describe('["blob"]', () => {
    it("works", () => {
      assert(types["blob"].tag === "b");
      assert(types["blob"].size(new Buffer(0)) === 4);
      assert(types["blob"].size(new Buffer(6)) === 12);
      assert(types["blob"].size(new Buffer(8)) === 12);
      assert(types["blob"].size(new Uint8Array(0).buffer) === 4);
      assert(types["blob"].size(new Uint8Array(6).buffer) === 12);
      assert(types["blob"].size(new Uint8Array(8).buffer) === 12);
      assert(types["blob"].validate(new Buffer(8)) === true);
      assert(types["blob"].validate(new Uint8Array(8).buffer) === true);
      assert.deepEqual(types["blob"].valueOf([ 0x01, 0x02, 0x03, 0x04 ]), new Buffer([ 0x01, 0x02, 0x03, 0x04 ]));

      types["blob"].write(writer, new Buffer([ 0x01, 0x02, 0x03, 0x04 ]));
      assert.deepEqual(types["blob"].read(reader), new Buffer([ 0x01, 0x02, 0x03, 0x04 ]));

      assert(tags["b"] === types["blob"]);
    });
  });
  describe('["timetag"]', () => {
    it("works", () => {
      let now = Date.now();

      assert(types["timetag"].tag === "t");
      assert(types["timetag"].size() === 8);
      assert(types["timetag"].validate(0) === true);
      assert(types["timetag"].validate(-10) === false);
      assert(types["timetag"].validate(1.5) === false);
      assert(types["timetag"].validate(Infinity) === false);
      assert(types["timetag"].validate(NaN) === false);
      assert(types["timetag"].valueOf(0) === 0);
      assert(types["timetag"].valueOf(Math.PI) === 3);
      assert(types["timetag"].valueOf(Infinity) === Infinity);
      assert(types["timetag"].valueOf("3") === 3);
      assert(types["timetag"].valueOf(NaN) === 0);

      types["timetag"].write(writer, now);
      assert(types["timetag"].read(reader) === now);

      assert(tags["t"] === types["timetag"]);
    });
  });
  describe('["double"]', () => {
    it("works", () => {
      assert(types["double"].tag === "d");
      assert(types["double"].size() === 8);
      assert(types["double"].validate(0) === true);
      assert(types["double"].validate(-10) === true);
      assert(types["double"].validate(1.5) === true);
      assert(types["double"].validate(Infinity) === true);
      assert(types["double"].validate(NaN) === false);
      assert(types["double"].valueOf(0) === 0);
      assert(types["double"].valueOf(Math.PI) === Math.PI);
      assert(types["double"].valueOf(Infinity) === Infinity);
      assert(types["double"].valueOf("3") === 3);
      assert(types["double"].valueOf(NaN) === 0);

      types["double"].write(writer, 1.5);
      assert(types["double"].read(reader) === 1.5);

      assert(tags["d"] === types["double"]);
    });
  });
  describe('["true"]', () => {
    it("works", () => {
      assert(types["true"].tag === "T");
      assert(types["true"].size() === 0);
      assert(types["true"].validate(true) === true);
      assert(types["true"].validate(false) === false);
      assert(types["true"].validate(null) === false);
      assert(types["true"].valueOf() === true);

      types["true"].write(writer, true);
      assert(types["true"].read(reader) === true);

      assert(tags["T"] === types["true"]);
    });
  });
  describe('["false"]', () => {
    it("works", () => {
      assert(types["false"].tag === "F");
      assert(types["false"].size() === 0);
      assert(types["false"].validate(true) === false);
      assert(types["false"].validate(false) === true);
      assert(types["false"].validate(null) === false);
      assert(types["false"].valueOf() === false);

      types["false"].write(writer, false);
      assert(types["false"].read(reader) === false);

      assert(tags["F"] === types["false"]);
    });
  });
  describe('["null"]', () => {
    it("works", () => {
      assert(types["null"].tag === "N");
      assert(types["null"].size() === 0);
      assert(types["null"].validate(true) === false);
      assert(types["null"].validate(false) === false);
      assert(types["null"].validate(null) === true);
      assert(types["null"].valueOf() === null);

      types["null"].write(writer, null);
      assert(types["null"].read(reader) === null);

      assert(tags["N"] === types["null"]);
    });
  });
  describe('["bang"]', () => {
    it("works", () => {
      assert(types["bang"].tag === "I");
      assert(types["bang"].size() === 0);
      assert(types["bang"].validate("bang") === true);
      assert(types["bang"].validate("ding") === false);
      assert(types["bang"].valueOf() === "bang");

      types["bang"].write(writer, "bang");
      assert(types["bang"].read(reader) === "bang");

      assert(tags["I"] === types["bang"]);
    });
  });
});

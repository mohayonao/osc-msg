import assert from "power-assert";
import Writer from "../src/Writer";
import Reader from "../src/Reader";
import { types, tags } from "../src/Tag";

describe("Tag", function() {
  beforeEach(function() {
    let buffer = new Buffer(16);
    this.writer = new Writer(buffer);
    this.reader = new Reader(buffer);
  });

  describe(":integer", function() {
    it("works", function() {
      assert(types.integer.tag === "i");
      assert(types.integer.size() === 4);
      assert(types.integer.validate(1) === true);
      assert(types.integer.validate(1.5) === false);
      assert(types.integer.validate(Infinity) === false);
      assert(types.integer.validate(NaN) === false);
      assert(types.integer.validate(true) === false);
      assert(types.integer.validate(false) === false);
      assert(types.integer.validate(null) === false);
      assert(types.integer.validate("0") === false);

      types.integer.write(this.writer, 1);
      assert(types.integer.read(this.reader) === 1);

      assert(tags.i === "integer");
    });
  });
  describe(":float", function() {
    it("works", function() {
      assert(types.float.tag === "f");
      assert(types.float.size() === 4);
      assert(types.float.validate(1) === true);
      assert(types.float.validate(1.5) === true);
      assert(types.float.validate(Infinity) === true);
      assert(types.float.validate(NaN) === false);
      assert(types.float.validate(true) === false);
      assert(types.float.validate(false) === false);
      assert(types.float.validate(null) === false);
      assert(types.float.validate("0") === false);

      types.float.write(this.writer, 1.234);
      assert(types.float.read(this.reader) === Math.fround(1.234));

      assert(tags.f === "float");
    });
  });
  describe(":string", function() {
    it("works", function() {
      assert(types.string.tag === "s");
      assert(types.string.size("foo") === 4);
      assert(types.string.size("food") === 8);
      assert(types.string.validate(1) === false);
      assert(types.string.validate(1.5) === false);
      assert(types.string.validate(Infinity) === false);
      assert(types.string.validate(NaN) === false);
      assert(types.string.validate(true) === false);
      assert(types.string.validate(false) === false);
      assert(types.string.validate(null) === false);
      assert(types.string.validate("0") === true);

      types.string.write(this.writer, "foo");
      assert(types.string.read(this.reader) === "foo");

      assert(tags.s === "string");
    });
  });
  describe(":blob", function() {
    it("works", function() {
      assert(types.blob.tag === "b");
      assert(types.blob.size(new Buffer(6)) === 12);
      assert(types.blob.size(new Buffer(8)) === 12);
      assert(types.blob.validate(1) === false);
      assert(types.blob.validate(1.5) === false);
      assert(types.blob.validate(Infinity) === false);
      assert(types.blob.validate(NaN) === false);
      assert(types.blob.validate(true) === false);
      assert(types.blob.validate(false) === false);
      assert(types.blob.validate(null) === false);
      assert(types.blob.validate("0") === false);
      assert(types.blob.validate(new Buffer(8)) === true);
      assert(types.blob.validate(new Uint8Array(8).buffer) === true);

      types.blob.write(this.writer, new Buffer([ 0x01, 0x02, 0x03, 0x04 ]));
      assert.deepEqual(types.blob.read(this.reader), new Buffer([ 0x01, 0x02, 0x03, 0x04 ]));

      assert(tags.b === "blob");
    });
  });
  describe(":timetag", function() {
    it("works", function() {
      let now = Date.now();

      assert(types.timetag.tag === "t");
      assert(types.timetag.size() === 8);
      assert(types.timetag.validate(now) === true);
      assert(types.timetag.validate(1.5) === false);
      assert(types.timetag.validate(Infinity) === false);
      assert(types.timetag.validate(NaN) === false);
      assert(types.timetag.validate(true) === false);
      assert(types.timetag.validate(false) === false);
      assert(types.timetag.validate(null) === false);
      assert(types.timetag.validate("0") === false);

      types.timetag.write(this.writer, now);
      assert(types.timetag.read(this.reader) === now);

      assert(tags.t === "timetag");
    });
  });
  describe(":double", function() {
    it("works", function() {
      assert(types.double.tag === "d");
      assert(types.double.size() === 8);
      assert(types.double.validate(1) === true);
      assert(types.double.validate(1.5) === true);
      assert(types.double.validate(Infinity) === true);
      assert(types.double.validate(NaN) === false);
      assert(types.double.validate(true) === false);
      assert(types.double.validate(false) === false);
      assert(types.double.validate(null) === false);
      assert(types.double.validate("0") === false);

      types.double.write(this.writer, 1.5);
      assert(types.double.read(this.reader) === 1.5);

      assert(tags.d === "double");
    });
  });
  describe(":true", function() {
    it("works", function() {
      assert(types.true.tag === "T");
      assert(types.true.size() === 0);
      assert(types.true.validate(1) === false);
      assert(types.true.validate(1.5) === false);
      assert(types.true.validate(Infinity) === false);
      assert(types.true.validate(NaN) === false);
      assert(types.true.validate(true) === true);
      assert(types.true.validate(false) === false);
      assert(types.true.validate(null) === false);
      assert(types.true.validate("0") === false);

      types.true.write(this.writer, true);
      assert(types.true.read(this.reader) === true);

      assert(tags.T === "true");
    });
  });
  describe(":false", function() {
    it("works", function() {
      assert(types.false.tag === "F");
      assert(types.false.size() === 0);
      assert(types.false.validate(1) === false);
      assert(types.false.validate(1.5) === false);
      assert(types.false.validate(Infinity) === false);
      assert(types.false.validate(NaN) === false);
      assert(types.false.validate(true) === false);
      assert(types.false.validate(false) === true);
      assert(types.false.validate(null) === false);
      assert(types.false.validate("0") === false);

      types.false.write(this.writer, false);
      assert(types.false.read(this.reader) === false);

      assert(tags.F === "false");
    });
  });
  describe(":null", function() {
    it("works", function() {
      assert(types.null.tag === "N");
      assert(types.null.size() === 0);
      assert(types.null.validate(1) === false);
      assert(types.null.validate(1.5) === false);
      assert(types.null.validate(Infinity) === false);
      assert(types.null.validate(NaN) === false);
      assert(types.null.validate(true) === false);
      assert(types.null.validate(false) === false);
      assert(types.null.validate(null) === true);
      assert(types.null.validate("0") === false);

      types.null.write(this.writer, null);
      assert(types.null.read(this.reader) === null);

      assert(tags.N === "null");
    });
  });
  describe(":bang", function() {
    it("works", function() {
      assert(types.bang.tag === "I");
      assert(types.bang.size() === 0);
      assert(types.bang.validate(1) === false);
      assert(types.bang.validate(1.5) === false);
      assert(types.bang.validate(Infinity) === false);
      assert(types.bang.validate(NaN) === false);
      assert(types.bang.validate(true) === false);
      assert(types.bang.validate(false) === false);
      assert(types.bang.validate(null) === false);
      assert(types.bang.validate("0") === false);
      assert(types.bang.validate("bang") === true);

      types.bang.write(this.writer, "bang");
      assert(types.bang.read(this.reader) === "bang");

      assert(tags.I === "bang");
    });
  });
});

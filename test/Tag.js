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

      types.integer.write(this.writer, 1);
      assert(types.integer.read(this.reader) === 1);

      assert(tags.i === "integer");
    });
  });
  describe(":float", function() {
    it("works", function() {
      assert(types.float.tag === "f");
      assert(types.float.size() === 4);
      assert(types.float.validate(1.5) === true);

      types.float.write(this.writer, 1.234);
      assert(types.float.read(this.reader) === Math.fround(1.234));

      assert(tags.f === "float");
    });
  });
  describe(":string", function() {
    it("works", function() {
      assert(types.string.tag === "s");
      assert(types.string.size("foo") === 4);
      assert(types.string.size("quux") === 8);
      assert(types.string.validate("bar") === true);

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

      types.timetag.write(this.writer, now);
      assert(types.timetag.read(this.reader) === now);

      assert(tags.t === "timetag");
    });
  });
  describe(":double", function() {
    it("works", function() {
      assert(types.double.tag === "d");
      assert(types.double.size() === 8);
      assert(types.double.validate(1.5) === true);

      types.double.write(this.writer, 1.5);
      assert(types.double.read(this.reader) === 1.5);

      assert(tags.d === "double");
    });
  });
  describe(":true", function() {
    it("works", function() {
      assert(types.true.tag === "T");
      assert(types.true.size() === 0);
      assert(types.true.validate(true) === true);

      types.true.write(this.writer, true);
      assert(types.true.read(this.reader) === true);

      assert(tags.T === "true");
    });
  });
  describe(":false", function() {
    it("works", function() {
      assert(types.false.tag === "F");
      assert(types.false.size() === 0);
      assert(types.false.validate(false) === true);

      types.false.write(this.writer, false);
      assert(types.false.read(this.reader) === false);

      assert(tags.F === "false");
    });
  });
  describe(":null", function() {
    it("works", function() {
      assert(types.null.tag === "N");
      assert(types.null.size() === 0);
      assert(types.null.validate(null) === true);

      types.null.write(this.writer, null);
      assert(types.null.read(this.reader) === null);

      assert(tags.N === "null");
    });
  });
  describe(":bang", function() {
    it("works", function() {
      assert(types.bang.tag === "I");
      assert(types.bang.size() === 0);
      assert(types.bang.validate("bang") === true);

      types.bang.write(this.writer, "bang");
      assert(types.bang.read(this.reader) === "bang");

      assert(tags.I === "bang");
    });
  });
});

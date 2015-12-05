/* eslint-disable no-inline-comments */

import assert from "power-assert";
import Reader from "../src/Reader";

describe("Reader", () => {
  describe("constructor(buffer: Buffer|ArrayBuffer)", () => {
    it("works", () => {
      let reader = new Reader(new Buffer(16));

      assert(reader instanceof Reader);
    });
  });
  describe("#read(length: number): Buffer|ArrayBuffer", () => {
    it("works", () => {
      let reader = new Reader(new Buffer([
        0x00, 0x00, 0x03, 0xe8,
        0xff, 0xff, 0xff, 0xff,
      ]));

      assert.deepEqual(reader.read(5), new Buffer([ 0x00, 0x00, 0x03, 0xe8, 0xff ]));
      assert.deepEqual(reader.read(3), new Buffer([ 0xff, 0xff, 0xff ]));
      assert(reader.hasError() === false);
      assert.deepEqual(reader.read(-1), new Buffer(0));
      assert(reader.hasError() === true);
    });
  });
  describe("#readUInt8(): number", () => {
    it("works", () => {
      let reader = new Reader(new Buffer([
        0x00, 0x00, 0x03, 0xe8,
        0xff, 0xff, 0xff, 0xff,
      ]));

      assert(reader.readUInt8() === 0x00);
      assert(reader.readUInt8() === 0x00);
      assert(reader.readUInt8() === 0x03);
      assert(reader.readUInt8() === 0xe8);
      assert(reader.readUInt8() === 0xff);
      assert(reader.readUInt8() === 0xff);
      assert(reader.readUInt8() === 0xff);
      assert(reader.readUInt8() === 0xff); // EOD
      assert(reader.hasError() === false);
      assert(reader.readUInt8() === 0x00);
      assert(reader.hasError() === true);
    });
  });
  describe("#readInt32(): number", () => {
    it("works", () => {
      let reader = new Reader(new Buffer([
        0x00, 0x00, 0x03, 0xe8, // int32 1000
        0xff, 0xff, 0xff, 0xff, // int32 -1
      ]));

      assert(reader.readInt32() === 1000);
      assert(reader.readInt32() === -1); // EOD
      assert(reader.hasError() === false);
      assert(reader.readInt32() === 0);
      assert(reader.hasError() === true);
    });
  });

  describe("#readUInt32(): number", () => {
    it("works", () => {
      let reader = new Reader(new Buffer([
        0x00, 0x00, 0x03, 0xe8, // uint32 1000
        0xff, 0xff, 0xff, 0xff, // uint32 4294967295
      ]));

      assert(reader.readUInt32() === 1000);
      assert(reader.readUInt32() === 4294967295); // EOD
      assert(reader.hasError() === false);
      assert(reader.readUInt32() === 0);
      assert(reader.hasError() === true);
    });
  });
  describe("#readInt64(): number", () => {
    it("works", () => {
      let reader = new Reader(new Buffer([
        0x00, 0x00, 0x03, 0xe8,
        0xff, 0xff, 0xff, 0xff,
      ]));

      assert(reader.readInt64() === 4299262263295); // EOD
      assert(reader.hasError() === false);
      assert(reader.readInt64() === 0);
      assert(reader.hasError() === true);
    });
  });
  describe("#readFloat32(): number", () => {
    it("works", () => {
      let reader = new Reader(new Buffer([
        0x3f, 0x9d, 0xf3, 0xb6, // float32 1.234
        0x40, 0xb5, 0xb2, 0x2d, // float32 5.678
      ]));

      assert(reader.readFloat32() === 1.2339999675750732);
      assert(reader.readFloat32() === 5.6779999732971190); // EOD
      assert(reader.hasError() === false);
      assert(reader.readFloat32() === 0);
      assert(reader.hasError() === true);
    });
  });

  describe("#readFloat64(): number", () => {
    it("works", () => {
      let reader = new Reader(new Buffer([
        0x3f, 0xf3, 0xc0, 0xca,
        0x2a, 0x5b, 0x1d, 0x5d, // float64 1.2345678
        0x40, 0x22, 0x06, 0x52,
        0x29, 0x98, 0x7f, 0xbe, // float64 9.0123456
      ]));

      assert(reader.readFloat64() === 1.2345678);
      assert(reader.readFloat64() === 9.0123456); // EOD
      assert(reader.hasError() === false);
      assert(reader.readFloat64() === 0);
      assert(reader.hasError() === true);
    });
  });
  describe("#readString(): string", () => {
    it("works", () => {
      let reader = new Reader(new Buffer([
        0x2f, 0x66, 0x6f, 0x6f, // "/foo"
        0x00, 0x00, 0x00, 0x00,
        0x2c, 0x69, 0x69, 0x73, // ",iisff"
        0x66, 0x66, 0x00, 0x00,
      ]));

      assert(reader.readString() === "/foo");
      assert(reader.readString() === ",iisff"); // EOD
      assert(reader.hasError() === false);
      assert(reader.readString() === "");
      assert(reader.hasError() === true);
    });
  });
  describe("#readBlob(): Buffer|ArrayBuffer", () => {
    it("works", () => {
      let reader = new Reader(new Buffer([
        0x00, 0x00, 0x00, 0x06, // size = 6
        0x01, 0x02, 0x03, 0x04, // Buffer([ 0x01, 0x02, 0x03, 0x04, 0x05, 0x06 ])
        0x05, 0x06, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x04, // size = 4
        0x07, 0x08, 0x09, 0x00, // Buffer([ 0x07, 0x08, 0x09, 0x00 ])
        0x00, 0x00, 0x00, 0x08, // size = 8
        0x0a,                   // Buffer([ 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ])
      ]));

      assert.deepEqual(reader.readBlob(), new Buffer([ 0x01, 0x02, 0x03, 0x04, 0x05, 0x06 ]));
      assert.deepEqual(reader.readBlob(), new Buffer([ 0x07, 0x08, 0x09, 0x00 ]));
      assert(reader.hasError() === false);
      assert.deepEqual(reader.readBlob(), new Buffer(0)); // EOD
      assert(reader.hasError() === true);
      assert.deepEqual(reader.readBlob(), new Buffer(0));
    });
  });
  describe("#hasError(): boolean", () => {
    it("works", () => {
      let reader = new Reader(new Buffer(4));

      assert(reader.hasError() === false);

      reader.readUInt32();
      assert(reader.hasError() === false);

      reader.readUInt32();
      assert(reader.hasError() === true);
    });
  });
  describe("#hasNext(): boolean", () => {
    it("works", () => {
      let reader = new Reader(new Buffer(8));

      assert(reader.hasNext() === true);

      reader.readInt32();
      assert(reader.hasNext() === true);

      reader.readInt32();
      assert(reader.hasNext() === false);
    });
  });
});

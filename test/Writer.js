import assert from "power-assert";
import Writer from "../src/Writer";

describe("Writer", function() {
  beforeEach(function() {
    this.buffer = new Uint8Array(32).buffer;
    this.view = new DataView(this.buffer);
  });

  describe("constructor", function() {
    it("(buffer: Buffer|ArrayBuffer)", function() {
      let writer = new Writer(this.buffer);

      assert(writer instanceof Writer);
    });
  });

  describe("#writeUInt8", function() {
    it("(value: number): void", function() {
      let writer = new Writer(this.buffer);

      writer.writeUInt8(0x00);
      writer.writeUInt8(0x00);
      writer.writeUInt8(0x03);
      writer.writeUInt8(0xe8);
      writer.writeUInt8(0xff);
      writer.writeUInt8(0xff);
      writer.writeUInt8(0xff);
      writer.writeUInt8(0xff);

      assert(this.view.getUint8(0) === 0x00);
      assert(this.view.getUint8(1) === 0x00);
      assert(this.view.getUint8(2) === 0x03);
      assert(this.view.getUint8(3) === 0xe8);
      assert(this.view.getUint8(4) === 0xff);
      assert(this.view.getUint8(5) === 0xff);
      assert(this.view.getUint8(6) === 0xff);
      assert(this.view.getUint8(7) === 0xff);
    });
  });

  describe("#writeInt32", function() {
    it("(value: number): void", function() {
      let writer = new Writer(this.buffer);

      writer.writeInt32(1000);
      writer.writeInt32(-1);

      assert(this.view.getInt32(0) === 1000);
      assert(this.view.getInt32(4) === -1);
    });
  });

  describe("#writeUInt32", function() {
    it("(value: number): void", function() {
      let writer = new Writer(this.buffer);

      writer.writeUInt32(1000);
      writer.writeUInt32(4294967295);

      assert(this.view.getUint32(0) === 1000);
      assert(this.view.getUint32(4) === 4294967295);
    });
  });

  describe("#writeFloat32", function() {
    it("(value: number): void", function() {
      let writer = new Writer(this.buffer);

      writer.writeFloat32(1.234);
      writer.writeFloat32(5.678);

      assert(this.view.getFloat32(0) === Math.fround(1.234));
      assert(this.view.getFloat32(4) === Math.fround(5.678));
    });
  });

  describe("#writeFloat64", function() {
    it("(value: number): void", function() {
      let writer = new Writer(this.buffer);

      writer.writeFloat64(1.2345678);
      writer.writeFloat64(9.0123456);

      assert(this.view.getFloat64(0) === 1.2345678);
      assert(this.view.getFloat64(8) === 9.0123456);
    });
  });

  describe("#writeString", function() {
    it("(value: string): void", function() {
      let writer = new Writer(this.buffer);

      writer.writeString("/foo");
      writer.writeString(",iisff");

      assert(this.view.getUint8(0) === 0x2f); // "/foo"
      assert(this.view.getUint8(1) === 0x66);
      assert(this.view.getUint8(2) === 0x6f);
      assert(this.view.getUint8(3) === 0x6f);
      assert(this.view.getUint8(4) === 0x00);
      assert(this.view.getUint8(5) === 0x00);
      assert(this.view.getUint8(6) === 0x00);
      assert(this.view.getUint8(7) === 0x00);

      assert(this.view.getUint8(8) === 0x2c); // ",iisff"
      assert(this.view.getUint8(9) === 0x69);
      assert(this.view.getUint8(10) === 0x69);
      assert(this.view.getUint8(11) === 0x73);
      assert(this.view.getUint8(12) === 0x66);
      assert(this.view.getUint8(13) === 0x66);
      assert(this.view.getUint8(14) === 0x00);
      assert(this.view.getUint8(15) === 0x00);
    });
  });

  describe("#writeBlob", function() {
    it("(value: Buffer|ArrayBuffer): void", function() {
      let writer = new Writer(this.buffer);

      writer.writeBlob(new Buffer([ 0x01, 0x02, 0x03, 0x04, 0x05, 0x06 ]));
      writer.writeBlob(new Buffer([ 0x07, 0x08, 0x09, 0x00 ]));


      assert(this.view.getUint32(0) === 6); // size = 6
      assert(this.view.getUint8(4) === 0x01);
      assert(this.view.getUint8(5) === 0x02);
      assert(this.view.getUint8(6) === 0x03);
      assert(this.view.getUint8(7) === 0x04);
      assert(this.view.getUint8(8) === 0x05);
      assert(this.view.getUint8(9) === 0x06);
      assert(this.view.getUint8(10) === 0x00);
      assert(this.view.getUint8(11) === 0x00);

      assert(this.view.getUint32(12) === 4); // size = 4
      assert(this.view.getUint8(16) === 0x07);
      assert(this.view.getUint8(17) === 0x08);
      assert(this.view.getUint8(18) === 0x09);
      assert(this.view.getUint8(29) === 0x00);
    });
  });

  describe("#hasNext", function() {
    it("(): boolean", function() {
      let writer = new Writer(new Buffer(8));

      assert(writer.hasNext() === true);

      writer.writeInt32(0);
      assert(writer.hasNext() === true);

      writer.writeInt32(0);
      assert(writer.hasNext() === false);
    });
  });

});

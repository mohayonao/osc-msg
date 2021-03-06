"use strict";

const assert = require("power-assert");
const Writer = require("../src/Writer");

describe("Writer", () => {
  describe("constructor(buffer: Buffer|ArrayBuffer)", () => {
    it("works", () => {
      const buffer = new Uint8Array(8).buffer;
      const writer = new Writer(buffer);

      assert(writer instanceof Writer);
    });
  });
  describe("#writeUInt8(value: number): void", () => {
    it("works", () => {
      const buffer = new Uint8Array(8).buffer;
      const writer = new Writer(buffer);

      writer.writeUInt8(0x00);
      writer.writeUInt8(0x00);
      writer.writeUInt8(0x03);
      writer.writeUInt8(0xe8);
      writer.writeUInt8(0xff);
      writer.writeUInt8(0xff);
      writer.writeUInt8(0xff);
      writer.writeUInt8(0xff); // EOD
      assert(writer.hasError() === false);
      writer.writeUInt8(0x00);
      assert(writer.hasError() === true);

      assert(writer.view.getUint8(0) === 0x00);
      assert(writer.view.getUint8(1) === 0x00);
      assert(writer.view.getUint8(2) === 0x03);
      assert(writer.view.getUint8(3) === 0xe8);
      assert(writer.view.getUint8(4) === 0xff);
      assert(writer.view.getUint8(5) === 0xff);
      assert(writer.view.getUint8(6) === 0xff);
      assert(writer.view.getUint8(7) === 0xff);
    });
  });
  describe("#writeInt32(value: number): void", () => {
    it("works", () => {
      const buffer = new Uint8Array(8).buffer;
      const writer = new Writer(buffer);

      writer.writeInt32(1000);
      writer.writeInt32(-1); // EOD
      assert(writer.hasError() === false);
      writer.writeInt32(0);
      assert(writer.hasError() === true);

      assert(writer.view.getInt32(0) === 1000);
      assert(writer.view.getInt32(4) === -1);
    });
  });
  describe("#writeUInt32(value: number): void", () => {
    it("works", () => {
      const buffer = new Uint8Array(8).buffer;
      const writer = new Writer(buffer);

      writer.writeUInt32(1000);
      writer.writeUInt32(4294967295); // EOD
      assert(writer.hasError() === false);
      writer.writeUInt32(0);
      assert(writer.hasError() === true);

      assert(writer.view.getUint32(0) === 1000);
      assert(writer.view.getUint32(4) === 4294967295);
    });
  });
  describe("#writeFloat32(value: number): void", () => {
    it("works", () => {
      const buffer = new Uint8Array(8).buffer;
      const writer = new Writer(buffer);

      writer.writeFloat32(1.234);
      writer.writeFloat32(5.678); // EOD
      assert(writer.hasError() === false);
      writer.writeFloat32(0);
      assert(writer.hasError() === true);

      assert(writer.view.getFloat32(0) === Math.fround(1.234));
      assert(writer.view.getFloat32(4) === Math.fround(5.678));
    });
  });
  describe("#writeFloat64(value: number): void", () => {
    it("works", () => {
      const buffer = new Uint8Array(16).buffer;
      const writer = new Writer(buffer);

      writer.writeFloat64(1.2345678);
      writer.writeFloat64(9.0123456); // EOD
      assert(writer.hasError() === false);
      writer.writeFloat64(0);
      assert(writer.hasError() === true);

      assert(writer.view.getFloat64(0) === 1.2345678);
      assert(writer.view.getFloat64(8) === 9.0123456);
    });
  });
  describe("#writeString(value: string): void", () => {
    it("works", () => {
      const buffer = new Uint8Array(16).buffer;
      const writer = new Writer(buffer);

      writer.writeString("/foo");
      writer.writeString(",iisff");
      assert(writer.hasError() === false);
      writer.writeString("foobar");
      assert(writer.hasError() === true);

      assert(writer.view.getUint8(0) === 0x2f); // "/foo"
      assert(writer.view.getUint8(1) === 0x66);
      assert(writer.view.getUint8(2) === 0x6f);
      assert(writer.view.getUint8(3) === 0x6f);
      assert(writer.view.getUint8(4) === 0x00);
      assert(writer.view.getUint8(5) === 0x00);
      assert(writer.view.getUint8(6) === 0x00);
      assert(writer.view.getUint8(7) === 0x00);

      assert(writer.view.getUint8(8) === 0x2c); // ",iisff"
      assert(writer.view.getUint8(9) === 0x69);
      assert(writer.view.getUint8(10) === 0x69);
      assert(writer.view.getUint8(11) === 0x73);
      assert(writer.view.getUint8(12) === 0x66);
      assert(writer.view.getUint8(13) === 0x66);
      assert(writer.view.getUint8(14) === 0x00);
      assert(writer.view.getUint8(15) === 0x00);
    });
  });
  describe("#writeBlob(value: Buffer|ArrayBuffer): void", () => {
    it("works", () => {
      const buffer = new Uint8Array(32).buffer;
      const writer = new Writer(buffer);

      writer.writeBlob(new Buffer([ 0x01, 0x02, 0x03, 0x04, 0x05, 0x06 ]));
      writer.writeBlob(new Buffer([ 0x07, 0x08, 0x09, 0x00 ])); // EOD
      assert(writer.hasError() === false);
      writer.writeBlob(new Buffer([ 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ]));
      assert(writer.hasError() === true);

      assert(writer.view.getUint32(0) === 6); // size = 6
      assert(writer.view.getUint8(4) === 0x01);
      assert(writer.view.getUint8(5) === 0x02);
      assert(writer.view.getUint8(6) === 0x03);
      assert(writer.view.getUint8(7) === 0x04);
      assert(writer.view.getUint8(8) === 0x05);
      assert(writer.view.getUint8(9) === 0x06);
      assert(writer.view.getUint8(10) === 0x00);
      assert(writer.view.getUint8(11) === 0x00);

      assert(writer.view.getUint32(12) === 4); // size = 4
      assert(writer.view.getUint8(16) === 0x07);
      assert(writer.view.getUint8(17) === 0x08);
      assert(writer.view.getUint8(18) === 0x09);
      assert(writer.view.getUint8(29) === 0x00);
    });
  });
  describe("writeAddress(value: string): void", () => {
    it("works", () => {
      const buffer = new Uint8Array(8).buffer;
      const writer = new Writer(buffer);

      writer.writeString("/foo");
      assert(writer.hasError() === false);
      writer.writeString("/bar");
      assert(writer.hasError() === true);

      assert(writer.view.getUint8(0) === 0x2f); // "/foo"
      assert(writer.view.getUint8(1) === 0x66);
      assert(writer.view.getUint8(2) === 0x6f);
      assert(writer.view.getUint8(3) === 0x6f);
      assert(writer.view.getUint8(4) === 0x00);
      assert(writer.view.getUint8(5) === 0x00);
      assert(writer.view.getUint8(6) === 0x00);
      assert(writer.view.getUint8(7) === 0x00);
    });
  });
  describe("writeAddress(value: number): void", () => {
    // It isn't the OSC spec, but SuperCollider allows numeric address.
    it("works", () => {
      const buffer = new Uint8Array(4).buffer;
      const writer = new Writer(buffer);

      writer.writeAddress(1);
      assert(writer.hasError() === false);
      writer.writeAddress(2);
      assert(writer.hasError() === true);

      assert(writer.view.getUint32(0) === 1);
    });
  });
  describe("writeTimeTag(value: [ hi, lo ]): void", () => {
    it("works", () => {
      const buffer = new Uint8Array(8).buffer;
      const writer = new Writer(buffer);

      writer.writeTimeTag([ 2208988800, 2147483648 ]);
      assert(writer.hasError() === false);
      writer.writeTimeTag([ 2208988800, 0 ]);
      assert(writer.hasError() === true);

      assert(writer.view.getUint32(0) === 2208988800);
      assert(writer.view.getUint32(4) === 2147483648);
    });
  });
  describe("#hasNext(): boolean", () => {
    it("works", () => {
      const buffer = new Uint8Array(4).buffer;
      const writer = new Writer(buffer);

      assert(writer.hasError() === false);

      writer.writeInt32(0);
      assert(writer.hasError() === false);

      writer.writeInt32(0);
      assert(writer.hasError() === true);
    });
  });
  describe("#hasNext(): boolean", () => {
    it("works", () => {
      const buffer = new Uint8Array(8).buffer;
      const writer = new Writer(buffer);

      assert(writer.hasNext() === true);

      writer.writeInt32(0);
      assert(writer.hasNext() === true);

      writer.writeInt32(0);
      assert(writer.hasNext() === false);
    });
  });
});

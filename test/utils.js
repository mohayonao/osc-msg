import assert from "power-assert";
import * as utils from "../src/utils";

let UNDEFINED;

describe("utils", () => {
  describe(".size4(num: number): number", () => {
    it("works", () => {
      assert(utils.size4(0) === 0);
      assert(utils.size4(1) === 4);
      assert(utils.size4(2) === 4);
      assert(utils.size4(3) === 4);
      assert(utils.size4(4) === 4);
      assert(utils.size4(5) === 8);
      assert(utils.size4(6) === 8);
      assert(utils.size4(7) === 8);
      assert(utils.size4(8) === 8);
    });
  });
  describe(".isNone(value: any): boolean", () => {
    it("works", () => {
      assert(utils.isNone(-1) === false);
      assert(utils.isNone(10) === false);
      assert(utils.isNone(4294967295) === false);
      assert(utils.isNone(1.5) === false);
      assert(utils.isNone(Infinity) === false);
      assert(utils.isNone(NaN) === false);
      assert(utils.isNone(true) === false);
      assert(utils.isNone(false) === false);
      assert(utils.isNone(null) === true);
      assert(utils.isNone(UNDEFINED) === true);
      assert(utils.isNone("0") === false);
      assert(utils.isNone(new Buffer(0)) === false);
      assert(utils.isNone(new Uint8Array(0).buffer) === false);
    });
  });
  describe(".isInteger", () => {
    it("(value: any): boolean", () => {
      assert(utils.isInteger(-1) === true);
      assert(utils.isInteger(10) === true);
      assert(utils.isInteger(4294967295) === true);
      assert(utils.isInteger(1.5) === false);
      assert(utils.isInteger(Infinity) === false);
      assert(utils.isInteger(NaN) === false);
      assert(utils.isInteger(true) === false);
      assert(utils.isInteger(false) === false);
      assert(utils.isInteger(null) === false);
      assert(utils.isInteger(UNDEFINED) === false);
      assert(utils.isInteger("0") === false);
      assert(utils.isInteger(new Buffer(0)) === false);
      assert(utils.isInteger(new Uint8Array(0).buffer) === false);
    });
  });
  describe(".isFloat", () => {
    it("(value: any): boolean", () => {
      assert(utils.isFloat(-1) === true);
      assert(utils.isFloat(10) === true);
      assert(utils.isFloat(4294967295) === true);
      assert(utils.isFloat(1.5) === true);
      assert(utils.isFloat(Infinity) === true);
      assert(utils.isFloat(NaN) === false);
      assert(utils.isFloat(true) === false);
      assert(utils.isFloat(false) === false);
      assert(utils.isFloat(null) === false);
      assert(utils.isFloat("0") === false);
      assert(utils.isFloat(UNDEFINED) === false);
      assert(utils.isFloat(new Buffer(0)) === false);
      assert(utils.isFloat(new Uint8Array(0).buffer) === false);
    });
  });
  describe(".isDouble", () => {
    it("(value: any): boolean", () => {
      assert(utils.isDouble(-1) === true);
      assert(utils.isDouble(10) === true);
      assert(utils.isDouble(4294967295) === true);
      assert(utils.isDouble(1.5) === true);
      assert(utils.isDouble(Infinity) === true);
      assert(utils.isDouble(NaN) === false);
      assert(utils.isDouble(true) === false);
      assert(utils.isDouble(false) === false);
      assert(utils.isDouble(null) === false);
      assert(utils.isDouble("0") === false);
      assert(utils.isDouble(UNDEFINED) === false);
      assert(utils.isDouble(new Buffer(0)) === false);
      assert(utils.isDouble(new Uint8Array(0).buffer) === false);
    });
  });
  describe(".isTimetag", () => {
    it("(value: any): boolean", () => {
      assert(utils.isTimetag(-1) === false);
      assert(utils.isTimetag(10) === true);
      assert(utils.isTimetag(4294967295) === true);
      assert(utils.isTimetag(1.5) === false);
      assert(utils.isTimetag(Infinity) === false);
      assert(utils.isTimetag(NaN) === false);
      assert(utils.isTimetag(true) === false);
      assert(utils.isTimetag(false) === false);
      assert(utils.isTimetag(null) === false);
      assert(utils.isTimetag("0") === false);
      assert(utils.isTimetag(UNDEFINED) === false);
      assert(utils.isTimetag(new Buffer(0)) === false);
      assert(utils.isTimetag(new Uint8Array(0).buffer) === false);
    });
  });
  describe(".isString", () => {
    it("(value: any): boolean", () => {
      assert(utils.isString(-1) === false);
      assert(utils.isString(10) === false);
      assert(utils.isString(4294967295) === false);
      assert(utils.isString(1.5) === false);
      assert(utils.isString(Infinity) === false);
      assert(utils.isString(NaN) === false);
      assert(utils.isString(true) === false);
      assert(utils.isString(false) === false);
      assert(utils.isString(null) === false);
      assert(utils.isString("0") === true);
      assert(utils.isString(UNDEFINED) === false);
      assert(utils.isString(new Buffer(0)) === false);
      assert(utils.isString(new Uint8Array(0).buffer) === false);
    });
  });
  describe(".isBlob", () => {
    it("(value: any): boolean", () => {
      assert(utils.isBlob(-1) === false);
      assert(utils.isBlob(10) === false);
      assert(utils.isBlob(4294967295) === false);
      assert(utils.isBlob(1.5) === false);
      assert(utils.isBlob(Infinity) === false);
      assert(utils.isBlob(NaN) === false);
      assert(utils.isBlob(true) === false);
      assert(utils.isBlob(false) === false);
      assert(utils.isBlob(null) === false);
      assert(utils.isBlob(UNDEFINED) === false);
      assert(utils.isBlob("0") === false);
      assert(utils.isBlob(new Buffer(0)) === true);
      assert(utils.isBlob(new Uint8Array(0).buffer) === true);
    });
  });
  describe(".toString(value: any): string", () => {
    it("works", () => {
      assert(utils.toString(null) === "");
      assert(utils.toString(UNDEFINED) === "");
      assert(utils.toString(100) === "100");
      assert(utils.toString("0") === "0");
    });
  });
  describe(".toArray(value: any): any[]", () => {
    it("works", () => {
      assert.deepEqual(utils.toArray(null), []);
      assert.deepEqual(utils.toArray(UNDEFINED), []);
      assert.deepEqual(utils.toArray(100), [ 100 ]);
      assert.deepEqual(utils.toArray([ 100, 200, 300 ]), [ 100, 200, 300 ]);
    });
  });
  describe(".toBlob(value: any): Buffer", () => {
    it("works", () => {
      let blob = new Buffer([ 0x62, 0x6c, 0x6f, 0x62 ]);

      assert(utils.toBlob(blob) === blob);
      assert(utils.toBlob([ 0x62, 0x6c, 0x6f, 0x62 ]) instanceof Buffer);
      assert.deepEqual(utils.toBlob([ 0x62, 0x6c, 0x6f, 0x62 ]), blob);
      assert(utils.toBlob("blob") instanceof Buffer);
      assert.deepEqual(utils.toBlob("blob"), blob);
      assert(utils.toBlob(4) instanceof Buffer);
      assert(utils.toBlob(4).length === 4);
      assert(utils.toBlob(null) instanceof Buffer);
    });
  });
});

import assert from "power-assert";
import * as util from "../src/util";

describe("util", function() {
  describe(".size4", function() {
    it("(num: number): number", function() {
      assert(util.size4(0) === 0);
      assert(util.size4(1) === 4);
      assert(util.size4(2) === 4);
      assert(util.size4(3) === 4);
      assert(util.size4(4) === 4);
      assert(util.size4(5) === 8);
      assert(util.size4(6) === 8);
      assert(util.size4(7) === 8);
      assert(util.size4(8) === 8);
    });
  });

  describe(".isInteger", function() {
    it("(value: any): boolean", function() {
      assert(util.isInteger(-1) === true);
      assert(util.isInteger(10) === true);
      assert(util.isInteger(4294967295) === true);
      assert(util.isInteger(1.5) === false);
      assert(util.isInteger(Infinity) === false);
      assert(util.isInteger(NaN) === false);
      assert(util.isInteger(true) === false);
      assert(util.isInteger(false) === false);
      assert(util.isInteger(null) === false);
      assert(util.isInteger("0") === false);
      assert(util.isInteger(new Buffer(0)) === false);
      assert(util.isInteger(new Uint8Array(0).buffer) === false);
    });
  });

  describe(".isFloat", function() {
    it("(value: any): boolean", function() {
      assert(util.isFloat(-1) === true);
      assert(util.isFloat(10) === true);
      assert(util.isFloat(4294967295) === true);
      assert(util.isFloat(1.5) === true);
      assert(util.isFloat(Infinity) === true);
      assert(util.isFloat(NaN) === false);
      assert(util.isFloat(true) === false);
      assert(util.isFloat(false) === false);
      assert(util.isFloat(null) === false);
      assert(util.isFloat("0") === false);
      assert(util.isFloat(new Buffer(0)) === false);
      assert(util.isFloat(new Uint8Array(0).buffer) === false);
    });
  });

  describe(".isString", function() {
    it("(value: any): boolean", function() {
      assert(util.isString(-1) === false);
      assert(util.isString(10) === false);
      assert(util.isString(4294967295) === false);
      assert(util.isString(1.5) === false);
      assert(util.isString(Infinity) === false);
      assert(util.isString(NaN) === false);
      assert(util.isString(true) === false);
      assert(util.isString(false) === false);
      assert(util.isString(null) === false);
      assert(util.isString("0") === true);
      assert(util.isString(new Buffer(0)) === false);
      assert(util.isString(new Uint8Array(0).buffer) === false);
    });
  });

  describe(".isBlob", function() {
    it("(value: any): boolean", function() {
      assert(util.isBlob(-1) === false);
      assert(util.isBlob(10) === false);
      assert(util.isBlob(4294967295) === false);
      assert(util.isBlob(1.5) === false);
      assert(util.isBlob(Infinity) === false);
      assert(util.isBlob(NaN) === false);
      assert(util.isBlob(true) === false);
      assert(util.isBlob(false) === false);
      assert(util.isBlob(null) === false);
      assert(util.isBlob("0") === false);
      assert(util.isBlob(new Buffer(0)) === true);
      assert(util.isBlob(new Uint8Array(0).buffer) === true);
    });
  });

  describe(".isTimetag", function() {
    it("(value: any): boolean", function() {
      assert(util.isTimetag(-1) === false);
      assert(util.isTimetag(10) === true);
      assert(util.isTimetag(4294967295) === true);
      assert(util.isTimetag(1.5) === false);
      assert(util.isTimetag(Infinity) === false);
      assert(util.isTimetag(NaN) === false);
      assert(util.isTimetag(true) === false);
      assert(util.isTimetag(false) === false);
      assert(util.isTimetag(null) === false);
      assert(util.isTimetag("0") === false);
      assert(util.isTimetag(new Buffer(0)) === false);
      assert(util.isTimetag(new Uint8Array(0).buffer) === false);
    });
  });

  describe(".isDouble", function() {
    it("(value: any): boolean", function() {
      assert(util.isDouble(-1) === true);
      assert(util.isDouble(10) === true);
      assert(util.isDouble(4294967295) === true);
      assert(util.isDouble(1.5) === true);
      assert(util.isDouble(Infinity) === true);
      assert(util.isDouble(NaN) === false);
      assert(util.isDouble(true) === false);
      assert(util.isDouble(false) === false);
      assert(util.isDouble(null) === false);
      assert(util.isDouble("0") === false);
      assert(util.isDouble(new Buffer(0)) === false);
      assert(util.isDouble(new Uint8Array(0).buffer) === false);
    });
  });
});

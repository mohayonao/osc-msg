import assert from "power-assert";
import oscmin from "osc-min";
import oscmsg from "../src/";
import { OSCMessage, OSCBundle } from "../src";

describe("osc-msg", function() {
  describe(".OSCMessage", function() {
    it("constructor of OSCMessage", function() {
      let msg = new oscmsg.OSCMessage();

      assert(msg instanceof OSCMessage);
    });
  });

  describe(".OSCBundle", function() {
    it("constructor of OSCMessage", function() {
      let msg = new oscmsg.OSCBundle();

      assert(msg instanceof OSCBundle);
    });
  });

  describe(".fromBuffer", function() {
    it("(buffer: Buffer): object <OSCMessage>", function() {
      let buffer = oscmin.toBuffer({
        address: "/foo",
      });
      let msg = oscmsg.fromBuffer(buffer);

      assert.deepEqual(msg, {
        address: "/foo",
        args: [],
        oscType: "message",
      });
    });
    it("(buffer: Buffer): object <OSCBundle>", function() {
      let buffer = oscmin.toBuffer({
        timetag: 12345,
      });
      let msg = oscmsg.fromBuffer(buffer);

      assert.deepEqual(msg, {
        timetag: 12345,
        elements: [],
        oscType: "bundle",
      });
    });
    it("(buffer: ArrayBuffer): object <OSCMessage>", function() {
      let buffer = new Uint8Array(oscmin.toBuffer({
        address: "/foo",
      })).buffer;
      let msg = oscmsg.fromBuffer(buffer);

      assert.deepEqual(msg, {
        address: "/foo",
        args: [],
        oscType: "message",
      });
    });
    it("(buffer: ArrayBuffer): object <OSCBundle>", function() {
      let buffer = new Uint8Array(oscmin.toBuffer({
        timetag: 12345,
      })).buffer;
      let msg = oscmsg.fromBuffer(buffer);

      assert.deepEqual(msg, {
        timetag: 12345,
        elements: [],
        oscType: "bundle",
      });
    });
  });

  describe(".toBuffer", function() {
    it("(obj: object <OSCMessage>): Buffer|ArrayBuffer", function() {
      let obj = {
        address: "/foo",
      };
      let buffer = oscmsg.toBuffer(obj);

      assert.deepEqual(buffer, oscmin.toBuffer(obj));
    });
    it("(obj: object <OSCBundle): Buffer|ArrayBuffer", function() {
      let obj = {
        timetag: 12345,
      };
      let buffer = oscmsg.toBuffer(obj);

      assert.deepEqual(buffer, oscmin.toBuffer(obj));
    });
  });
});

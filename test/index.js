import assert from "power-assert";
import oscmin from "osc-min";
import oscmsg from "../src/";
import { OSCMessage, OSCBundle } from "../src";

describe("osc-msg", function() {
  describe(".OSCMessage", () => {
    it("constructor of OSCMessage", () => {
      let msg = new oscmsg.OSCMessage();

      assert(msg instanceof OSCMessage);
    });
  });

  describe(".OSCBundle", () => {
    it("constructor of OSCMessage", () => {
      let msg = new oscmsg.OSCBundle();

      assert(msg instanceof OSCBundle);
    });
  });

  describe(".fromBuffer", () => {
    it("(buffer: Buffer): object <OSCMessage>", () => {
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
    it("(buffer: Buffer): object <OSCBundle>", () => {
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
    it("(buffer: ArrayBuffer): object <OSCMessage>", () => {
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
    it("(buffer: ArrayBuffer): object <OSCBundle>", () => {
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

  describe(".toBuffer", () => {
    it("(obj: object <OSCMessage>): Buffer|ArrayBuffer", () => {
      let obj = {
        address: "/foo",
      };
      let buffer = oscmsg.toBuffer(obj);

      assert.deepEqual(buffer, oscmin.toBuffer(obj));
    });
    it("(obj: object <OSCBundle): Buffer|ArrayBuffer", () => {
      let obj = {
        timetag: 12345,
      };
      let buffer = oscmsg.toBuffer(obj);

      assert.deepEqual(buffer, oscmin.toBuffer(obj));
    });
  });
});

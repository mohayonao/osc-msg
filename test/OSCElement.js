import assert from "power-assert";
import oscmin from "osc-min";
import OSCElement from "../src/OSCElement";
import OSCMessage from "../src/OSCMessage";
import OSCBundle from "../src/OSCBundle";

describe("OSCElement", function() {
  describe(".fromObject", function() {
    it("(): OSCMessage", function() {
      let msg = OSCElement.fromObject();

      assert(msg instanceof OSCMessage);
      assert.deepEqual(msg.toObject(), {
        address: "",
        args: [],
        oscType: "message",
      });
    });
    it("(obj: string): OSCMessage", function() {
      let msg = OSCElement.fromObject("/foo");

      assert(msg instanceof OSCMessage);
      assert.deepEqual(msg.toObject(), {
        address: "/foo",
        args: [],
        oscType: "message",
      });
    });
    it("(obj: { address: string }): OSCMessage", function() {
      let msg = OSCElement.fromObject({
        address: "/foo",
      });

      assert(msg instanceof OSCMessage);
      assert.deepEqual(msg.toObject(), {
        address: "/foo",
        args: [],
        oscType: "message",
      });
    });
    it("(obj: {}): OSCMessage", function() {
      let msg = OSCElement.fromObject({});

      assert(msg instanceof OSCMessage);
      assert.deepEqual(msg.toObject(), {
        address: "",
        args: [],
        oscType: "message",
      });
    });
    it("(obj: { timetag: number }): OSCBundle", function() {
      let msg = OSCElement.fromObject({
        timetag: 12345,
      });

      assert(msg instanceof OSCBundle);
      assert.deepEqual(msg.toObject(), {
        timetag: 12345,
        elements: [],
        oscType: "bundle",
      });
    });
  });

  describe(".fromBuffer", function() {
    it("(): OSCMessage", function() {
      let msg = OSCElement.fromBuffer();

      assert(msg instanceof OSCMessage);
      assert.deepEqual(msg.toObject(), {
        address: "",
        args: [],
        oscType: "message",
      });
    });
    it("(buffer: Buffer|ArrayBuffer): OSCMessage", function() {
      let buffer = oscmin.toBuffer({ address: "/foo" });
      let msg = OSCElement.fromBuffer(buffer);

      assert(msg instanceof OSCMessage);
      assert.deepEqual(msg.toObject(), {
        address: "/foo",
        args: [],
        oscType: "message",
      });
    });
    it("(buffer: Buffer|ArrayBuffer): OSCBundle", function() {
      let buffer = oscmin.toBuffer({ timetag: 12345 });
      let msg = OSCElement.fromBuffer(buffer);

      assert(msg instanceof OSCBundle);
      assert.deepEqual(msg.toObject(), {
        timetag: 12345,
        elements: [],
        oscType: "bundle",
      });
    });
  });
});

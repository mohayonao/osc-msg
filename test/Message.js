import assert from "power-assert";
import OSCMin from "osc-min";
import Message from "../src/Message";

describe("Message", function() {
  describe("constructor", function() {
    it("(address = '', args = [])", function() {
      let msg = new Message();

      assert(msg instanceof Message);
    });
  });

  describe(".fromObject", function() {
    it("(obj: object): Message", function() {
      let msg = Message.fromObject({
        address: "/foo",
        args: [ 1, "bar" ],
      });

      assert(msg instanceof Message);
      assert(msg.toObject(), {
        address: "/foo",
        args: [
          { type: "float", value: 1 },
          { type: "string", value: "bar" },
        ],
        oscType: "message",
      });
    });
    it("(obj: string): Message", function() {
      let msg = Message.fromObject("/foo");

      assert(msg instanceof Message);
      assert(msg.toObject(), {
        address: "/foo",
        args: [],
        oscType: "message",
      });
    });
  });

  describe(".fromBuffer", function() {
    it("(buffer: Buffer|ArrayBuffer): Message", function() {
      let expected = {
        address: "/foo",
        args: [
          { type: "float", value: 1 },
          { type: "true", value: true },
          { type: "array", value:
            [
              { type: "integer", value: 1 },
              { type: "bang", value: "bang" },
            ],
          },
        ],
        oscType: "message",
      };
      let compatible = OSCMin.toBuffer(expected);
      let msg = Message.fromBuffer(compatible);

      assert(msg instanceof Message);
      assert.deepEqual(msg.toObject(), expected);
    });
  });

  describe("#address", function() {
    it("get/set: string", function() {
      let msg = new Message("/foo");

      assert(msg.address === "/foo");

      msg.address = "/bar";
      assert(msg.address === "/bar");

      assert.throws(() => {
        msg.address = 1000;
      }, (e) => {
        return e instanceof Error && e.message === "address must be string";
      });
    });
  });

  describe("#types", function() {
    it("get: string", function() {
      let msg = new Message();

      assert(msg.types === ",");

      msg.add(1, true, false, "string", null);

      assert(msg.types === ",fTFsN");
    });
  });

  describe("#size", function() {
    it("get: number", function() {
      let msg = new Message("/foo");

      assert(msg.size === 12);

      msg.address = "/foobarqux";
      assert(msg.size === 16);

      msg.add(1);
      assert(msg.size === 20);

      msg.add(true);
      assert(msg.size === 20);
    });
  });

  describe("#add", function() {
    it("(...values: object): self", function() {
      let msg = new Message();

      msg.add(1);
      msg.add(true, false, null);
      msg.add({ type: "integer", value: 1 });
      msg.add([
        { type: "string", value: "foo" },
        { type: "string", value: "bar" },
      ]);
      msg.add({ type: "bang", value: "bang" });

      assert(msg.types === ",fTFNi[ss]I");

      assert.throws(() => {
        msg.add({ type: "undefined", value: undefined });
      }, (e) => {
        return e instanceof Error && e.message === "Unsupport type: undefined";
      });

      assert.throws(() => {
        msg.add({ type: "array", value: 10 });
      }, (e) => {
        return e instanceof Error && e.message === "Required 'array', but got 10";
      });

      assert.throws(() => {
        msg.add({ type: "integer", value: 1.5 });
      }, (e) => {
        return e instanceof Error && e.message === "Required 'integer', but got 1.5";
      });
    });
  });

  describe("#clear", function() {
    it("(): self", function() {
      let msg = new Message("/foo", [
        { type: "integer", value: 1 },
      ]);

      assert(msg.address === "/foo");
      assert(msg.types === ",i");
      assert(msg.size === 16);

      msg.clear();

      assert(msg.address === "");
      assert(msg.types === ",");
      assert(msg.size === 8);
    });
  });

  describe("#clone", function() {
    it("(): Message", function() {
      let msg1 = new Message("/foo", [
        { type: "integer", value: 1 },
      ]);
      let msg2 = msg1.clone();

      assert(msg1 !== msg2);

      msg2.add(false);

      assert(msg1.types === ",i");
      assert(msg2.types === ",iF");
    });
  });

  describe("#toObject", function() {
    it("(): object", function() {
      let msg = new Message("/foo");

      msg.add(1, true, [
        { type: "integer", value: 1 },
        { type: "bang", value: "bang" },
      ]);

      let actual = msg.toObject();
      let expected = {
        address: "/foo",
        args: [
          { type: "float", value: 1 },
          { type: "true", value: true },
          { type: "array", value:
            [
              { type: "integer", value: 1 },
              { type: "bang", value: "bang" },
            ],
          },
        ],
        oscType: "message",
      };
      let compatible = OSCMin.fromBuffer(OSCMin.toBuffer(expected));

      assert.deepEqual(actual, expected);
      assert.deepEqual(actual, compatible);
    });
  });

  describe("#toBuffer", function() {
    it("(): Buffer|ArrayBuffer", function() {
      let msg = new Message("/foo");

      msg.add(1, true, [
        { type: "integer", value: 1 },
        { type: "bang", value: "bang" },
      ]);

      let actual = msg.toBuffer();
      let compatible = OSCMin.toBuffer(msg.toObject());

      assert.deepEqual(actual, compatible);
    });
  });

});

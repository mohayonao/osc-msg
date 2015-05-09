import assert from "power-assert";
import oscmin from "osc-min";
import OSCMessage from "../src/OSCMessage";

describe("OSCMessage", function() {
  describe("constructor", function() {
    it("(address = '', args = [])", function() {
      let msg = new OSCMessage();

      assert(msg instanceof OSCMessage);
    });
  });

  describe(".fromObject", function() {
    it("(obj: object <OSCMessage>): OSCMessage", function() {
      let msg = OSCMessage.fromObject({
        address: "/foo",
        args: [ 1, "foo!" ],
      });

      assert(msg instanceof OSCMessage);
      assert(msg.toObject(), {
        address: "/foo",
        args: [
          { type: "float", value: 1 },
          { type: "string", value: "bar" },
        ],
        oscType: "message",
      });
    });
    it("(obj: string): OSCMessage", function() {
      let msg = OSCMessage.fromObject("/foo");

      assert(msg instanceof OSCMessage);
      assert(msg.toObject(), {
        address: "/foo",
        args: [],
        oscType: "message",
      });
    });
    it("(obj: object <empy>): OSCMessage", function() {
      let msg = OSCMessage.fromObject({});

      assert(msg instanceof OSCMessage);
      assert.deepEqual(msg.toObject(), {
        address: "",
        args: [],
        oscType: "message",
      });
    });
    it("(obj: !object): OSCMessage", function() {
      let msg = OSCMessage.fromObject(0);

      assert(msg instanceof OSCMessage);
      assert.deepEqual(msg.toObject(), {
        address: "",
        args: [],
        oscType: "message",
      });
    });
  });

  describe(".fromBuffer", function() {
    it("(buffer: Buffer|ArrayBuffer <args>): OSCMessage", function() {
      let data = {
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

      let buffer = oscmin.toBuffer(data);
      let msg = OSCMessage.fromBuffer(buffer);

      assert(msg instanceof OSCMessage);
      assert.deepEqual(msg.toObject(), data);
    });
    it("(buffer: Buffer|ArryBuffer <address>): OSCMessage", function() {
      let msg = OSCMessage.fromBuffer(new Buffer("/foo"));

      assert(msg instanceof OSCMessage);
      assert.deepEqual(msg.toObject(), {
        address: "/foo",
        args: [],
        oscType: "message",
      });
    });
    it("(buffer: Buffer|ArryBuffer <empty>): OSCMessage", function() {
      let msg = OSCMessage.fromBuffer(new Buffer(0));

      assert(msg instanceof OSCMessage);
      assert.deepEqual(msg.toObject(), {
        address: "",
        args: [],
        oscType: "message",
      });
    });
    it("(buffer: !(Buffer|ArrayBuffer)): OSCMessage", function() {
      let msg = OSCMessage.fromBuffer(0);

      assert(msg instanceof OSCMessage);
      assert.deepEqual(msg.toObject(), {
        address: "",
        args: [],
        oscType: "message",
      });
    });
    it("(buffer: Buffer|ArrayBuffer <invalid tag>) throws Error", function() {
      assert.throws(() => {
        OSCMessage.fromBuffer(new Buffer("/fo\0,*"));
      }, (e) => {
        return e instanceof Error && e.message === "Not supported tag '*'";
      });

      assert.throws(() => {
        OSCMessage.fromBuffer(new Buffer("/fo\0,]"));
      }, (e) => {
        return e instanceof Error && e.message === "Unexpected token ']'";
      });

      assert.throws(() => {
        OSCMessage.fromBuffer(new Buffer("/fo\0,["));
      }, (e) => {
        return e instanceof Error && e.message === "Unexpected token '['";
      });
    });
  });

  describe("#oscType", function() {
    it("get: string", function() {
      let msg = new OSCMessage();

      assert(msg.oscType === "message");
    });
  });

  describe("#address", function() {
    it("get/set: string", function() {
      let msg = new OSCMessage("/foo");

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
      let msg = new OSCMessage();

      assert(msg.types === ",");

      msg.add(1, "string", true, false, null);

      assert(msg.types === ",fsTFN");
    });
  });

  describe("#size", function() {
    it("get: number", function() {
      let msg = new OSCMessage("/foo");

      assert(msg.size === 12);
      assert(msg.size === oscmin.toBuffer(msg.toObject()).length);

      msg.address = "/foobarqux";
      assert(msg.size === 16);
      assert(msg.size === oscmin.toBuffer(msg.toObject()).length);

      msg.add(1);
      assert(msg.size === 20);
      assert(msg.size === oscmin.toBuffer(msg.toObject()).length);

      msg.add(true);
      assert(msg.size === 20);
      assert(msg.size === oscmin.toBuffer(msg.toObject()).length);
    });
  });

  describe("#add", function() {
    it("(...values: object): self", function() {
      let msg = new OSCMessage();

      msg.add(1, true, false, null,
        { type: "integer", value: 1 }, [
          { type: "string", value: "foo" },
          { type: "string", value: "bar" },
        ],
        { type: "bang", value: "bang" }
      );

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
      let msg = new OSCMessage("/foo", [ 1 ]);

      msg.clear();

      assert(msg.address === "");
      assert(msg.types === ",");
      assert(msg.size === 8);
    });
  });

  describe("#clone", function() {
    it("(): OSCMessage", function() {
      let msg1 = new OSCMessage("/foo", [
        { type: "integer", value: 1 },
      ]);
      let msg2 = msg1.clone();

      assert(msg1 !== msg2);
      assert.deepEqual(msg1.toObject(), msg2.toObject());
    });
  });

  describe("#toObject", function() {
    it("(): object <OSCMessage>", function() {
      let msg = new OSCMessage("/foo", [ 1 ]);
      let obj = msg.toObject();

      assert(obj instanceof Object);
      assert(typeof obj.address === "string");
      assert(Array.isArray(obj.args));
      assert(obj.oscType === "message");
      assert(!obj.hasOwnProperty("error"));
    });
    it("(): object <OSCMessage:error>", function() {
      let msg = OSCMessage.fromBuffer(new Buffer("/foo\0\0\0\0,i"));
      let obj = msg.toObject();

      assert(obj instanceof Object);
      assert(typeof obj.address === "string");
      assert(Array.isArray(obj.args));
      assert(obj.oscType === "message");
      assert(obj.error === true);
    });
  });

  describe("#toBuffer", function() {
    it("(): Buffer|ArrayBuffer <OSCMessage>", function() {
      let msg = new OSCMessage("/foo", [ 1 ]);

      assert(msg.toBuffer() instanceof Buffer);
    });
  });

  describe("osc-min compatible", function() {
    it("empty message", function() {
      let msg = new OSCMessage();
      let buffer = msg.toBuffer();

      assert(msg.toObject(), oscmin.fromBuffer(buffer));
      assert(msg.toBuffer(), oscmin.toBuffer(msg.toObject()));
    });
    it("contains args", function() {
      let msg = new OSCMessage("/foo", [ 1, "foo!", true, false, null ]);
      let buffer = msg.toBuffer();

      assert(msg.toObject(), oscmin.fromBuffer(buffer));
      assert(msg.toBuffer(), oscmin.toBuffer(msg.toObject()));
    });
  });

});

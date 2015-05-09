import assert from "power-assert";
import oscmin from "osc-min";
import OSCMessage from "../src/OSCMessage";
import OSCBundle from "../src/OSCBundle";

const timetag = Date.now();

describe("OSCBundle", function() {
  describe("constructor", function() {
    let bundle = new OSCBundle();

    assert(bundle instanceof OSCBundle);
  });

  describe(".fromObject", function() {
    it("(obj: object <OSCBundle>): OSCBundle", function() {
      let bundle = OSCBundle.fromObject({
        timetag: 1,
        elements: [
          {
            address: "/foo",
            args: [ 1, "foo!" ],
          },
        ],
      });

      assert(bundle instanceof OSCBundle);
      assert.deepEqual(bundle.toObject(), {
        timetag: 1,
        elements: [
          {
            address: "/foo",
            args: [
              { type: "float", value: 1 },
              { type: "string", value: "foo!" },
            ],
            oscType: "message",
          },
        ],
        oscType: "bundle",
      });
    });
    it("(obj: object <empty>): OSCBundle", function() {
      let bundle = OSCBundle.fromObject({});

      assert(bundle instanceof OSCBundle);
      assert.deepEqual(bundle.toObject(), {
        timetag: 0,
        elements: [],
        oscType: "bundle",
      });
    });
    it("(obj: !object): OSCBundle", function() {
      let bundle = OSCBundle.fromObject(0);

      assert(bundle instanceof OSCBundle);
      assert.deepEqual(bundle.toObject(), {
        timetag: 0,
        elements: [],
        oscType: "bundle",
      });
    });
  });

  describe(".fromBuffer", function() {
    it("(buffer: Buffer|ArrayBuffer <elements>): OSCBundle", function() {
      let data = {
        timetag: 1,
        elements: [
          {
            address: "/foo",
            args: [
              { type: "integer", value: 1 },
            ],
            oscType: "message",
          },
          {
            timetag: 2,
            elements: [
              {
                address: "/bar",
                args: [
                  { type: "float", value: 2 },
                ],
                oscType: "message",
              },
            ],
            oscType: "bundle",
          },
        ],
        oscType: "bundle",
      };
      let buffer = oscmin.toBuffer(data);
      let bundle = OSCBundle.fromBuffer(buffer);

      assert(bundle instanceof OSCBundle);
      assert.deepEqual(bundle.toObject(), data);
    });
    it("(buffer: Buffer|ArrayBuffer <timetag>): OSCBundle", function() {
      let data = {
        timetag: timetag,
        elements: [],
        oscType: "bundle",
      };
      let buffer = oscmin.toBuffer(data);
      let bundle = OSCBundle.fromBuffer(buffer);

      assert(bundle instanceof OSCBundle);
      assert.deepEqual(bundle.toObject(), data);
    });
    it("(buffer: Buffer|ArrayBuffer <empty>): OSCBundle", function() {
      let bundle = OSCBundle.fromBuffer(new Buffer(0));

      assert(bundle instanceof OSCBundle);
      assert.deepEqual(bundle.toObject(), {
        timetag: 0,
        elements: [],
        oscType: "bundle",
      });
    });
    it("(buffer: !(Buffer|ArrayBuffer)): OSCBundle", function() {
      let bundle = OSCBundle.fromBuffer(0);

      assert(bundle instanceof OSCBundle);
      assert.deepEqual(bundle.toObject(), {
        timetag: 0,
        elements: [],
        oscType: "bundle",
      });
    });
  });

  describe("#oscType", function() {
    it("get: string", function() {
      let bundle = new OSCBundle();

      assert(bundle.oscType === "bundle");
    });
  });

  describe("#timetag", function() {
    it("get/set: number", function() {
      let bundle = new OSCBundle(12345);

      assert(bundle.timetag === 12345);

      bundle.timetag = 67890;
      assert(bundle.timetag === 67890);

      assert.throws(() => {
        bundle.timetag = "12345";
      }, (e) => {
        return e instanceof Error && e.message === "timetag must be an integer";
      });
    });
  });

  describe("#size", function() {
    it("get: number", function() {
      let bundle = new OSCBundle();

      assert(bundle.size === 16);

      bundle.add(new OSCMessage());

      assert(bundle.size === 28);
    });
  });

  describe("#add", function() {
    it("(...values: object): self", function() {
      let bundle = new OSCBundle();

      assert.deepEqual(bundle.toObject(), {
        timetag: 0,
        elements: [],
        oscType: "bundle",
      });

      bundle.add(new OSCMessage("/foo", [ 1 ]), {
        address: "/bar",
        args: [ 2 ],
      }, "/baz");

      assert.deepEqual(bundle.toObject(), {
        timetag: 0,
        elements: [
          {
            address: "/foo",
            args: [
              { type: "float", value: 1 },
            ],
            oscType: "message",
          },
          {
            address: "/bar",
            args: [
              { type: "float", value: 2 },
            ],
            oscType: "message",
          },
          {
            address: "/baz",
            args: [
            ],
            oscType: "message",
          },
        ],
        oscType: "bundle",
      });

      bundle.add(new OSCBundle(1, [
        new OSCMessage("/qux", [ 3 ]),
      ]), {
        timetag: 2,
        elements: [
          {
            address: "/quux",
            args: [ 4 ],
          },
        ],
      });

      assert.deepEqual(bundle.toObject(), {
        timetag: 0,
        elements: [
          {
            address: "/foo",
            args: [
              { type: "float", value: 1 },
            ],
            oscType: "message",
          },
          {
            address: "/bar",
            args: [
              { type: "float", value: 2 },
            ],
            oscType: "message",
          },
          {
            address: "/baz",
            args: [
            ],
            oscType: "message",
          },
          {
            timetag: 1,
            elements: [
              {
                address: "/qux",
                args: [
                  { type: "float", value: 3 },
                ],
                oscType: "message",
              },
            ],
            oscType: "bundle",
          },
          {
            timetag: 2,
            elements: [
              {
                address: "/quux",
                args: [
                  { type: "float", value: 4 },
                ],
                oscType: "message",
              },
            ],
            oscType: "bundle",
          },
        ],
        oscType: "bundle",
      });

      assert.throws(() => {
        bundle.add(null);
      }, (e) => {
        return e instanceof Error && e.message === "element must be a OSCMessage or OSCBundle";
      });
    });
  });

  describe("#clear", function() {
    it("(): self", function() {
      let bundle = new OSCBundle(timetag, [ "/foo" ]);

      bundle.clear();

      assert(bundle.size === 16);
      assert.deepEqual(bundle.toObject(), {
        timetag: 0,
        elements: [],
        oscType: "bundle",
      });
    });
  });

  describe("#clone", function() {
    it("(): OSCBundle", function() {
      let bundle1 = new OSCBundle(timetag, [ "/foo" ]);
      let bundle2 = bundle1.clone();

      assert(bundle1 !== bundle2);
      assert.deepEqual(bundle1.toObject(), bundle2.toObject());
    });
  });

  describe("#toObject", function() {
    it("(): object <OSCBundle>", function() {
      let bundle = new OSCBundle(timetag, [ "/foo" ]);
      let obj = bundle.toObject();

      assert(obj instanceof Object);
      assert(typeof obj.timetag === "number");
      assert(Array.isArray(obj.elements));
      assert(obj.oscType === "bundle");
      assert(!obj.hasOwnProperty("error"));
    });
    it("(): object <OSCBundle:error>", function() {
      let bundle = OSCBundle.fromBuffer(new Buffer("#bundle\0"));
      let obj = bundle.toObject();

      assert(obj instanceof Object);
      assert(typeof obj.timetag === "number");
      assert(Array.isArray(obj.elements));
      assert(obj.oscType === "bundle");
      assert(obj.error === true);
    });
  });

  describe("#toBuffer", function() {
    it("(): Buffer|ArrayBuffer <OSCBundle>", function() {
      let bundle = new OSCBundle(timetag, [ "/foo" ]);

      assert(bundle.toBuffer() instanceof Buffer);
    });
  });

  describe("osc-min compatible", function() {
    it("empty bundle", function() {
      let bundle = new OSCBundle();
      let buffer = bundle.toBuffer();

      assert(bundle.toObject(), oscmin.fromBuffer(buffer));
      assert(bundle.toBuffer(), oscmin.toBuffer(bundle.toObject()));
    });
    it("contains messages", function() {
      let bundle = new OSCBundle(timetag, [
        new OSCMessage("/foo", [ 1, 2, "foo!" ]),
        new OSCMessage("/bar", [ 3, 4, "bar!" ]),
      ]);
      let buffer = bundle.toBuffer();

      assert(bundle.toObject(), oscmin.fromBuffer(buffer));
      assert(bundle.toBuffer(), oscmin.toBuffer(bundle.toObject()));
    });
    it("contains bundle", function() {
      let bundle = new OSCBundle(timetag, [
        new OSCBundle(timetag, [
          new OSCMessage("/foo", [ 1, 2, "foo!" ]),
          new OSCMessage("/bar", [ 3, 4, "bar!" ]),
        ]),
        new OSCBundle(timetag, [
          new OSCMessage("/qux", [ 5, 6, "qux!" ]),
        ]),
      ]);
      let buffer = bundle.toBuffer();

      assert(bundle.toObject(), oscmin.fromBuffer(buffer));
      assert(bundle.toBuffer(), oscmin.toBuffer(bundle.toObject()));
    });
  });

});

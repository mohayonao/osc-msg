import assert from "power-assert";
import OSCMin from "osc-min";
import OSCMsg from "../src/";

const SILENT_WAV = [
  0x52, 0x49, 0x46, 0x46, // "RIFF"
  0x2c, 0x00, 0x00, 0x00, // file size
  0x57, 0x41, 0x56, 0x45, // "WAVE"
  0x66, 0x6d, 0x74, 0x20, // "fmt "
  0x10, 0x00, 0x00, 0x00, // 16bit
  0x01, 0x00, 0x02, 0x00, // stereo
  0x44, 0xac, 0x00, 0x00, // 44.1kHz
  0x10, 0xb1, 0x02, 0x00, // data speed
  0x04, 0x00, 0x10, 0x00, // block size, bit/sample
  0x64, 0x61, 0x74, 0x61, // "data"
  0x08, 0x00, 0x00, 0x00, // data size
  0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00,
];

describe("OSCMsg", function() {
  let msg = {
    address: "/address",
    args: [
      { type: "timetag", value: Date.now() },
      { type: "array", value:
        [
          { type: "integer", value: 1000 },
          { type: "float", value: 440 },
          { type: "string", value: "foobar" },
          { type: "blob", value: new Buffer(SILENT_WAV) },
        ],
      },
      { type: "true", value: true },
      { type: "false", value: false },
      { type: "null", value: null },
    ],
    oscType: "message",
  };

  describe(".fromBuffer", function() {
    it("(buffer: Buffer|ArrayBuffer): object", function() {
      let buffer = OSCMin.toBuffer(msg);
      let actual = OSCMsg.fromBuffer(buffer);

      assert.deepEqual(actual, msg);
    });
  });

  describe(".toBuffer", function() {
    it("(object: object): Buffer|ArrayBuffer", function() {
      let actual = OSCMsg.toBuffer(msg);
      let expected = OSCMin.toBuffer(msg);

      assert.deepEqual(actual, expected);
    });
  });
});

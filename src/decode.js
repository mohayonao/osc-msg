"use strict";

const Reader = require("./Reader");
const Tag = require("./Tag");
const utils = require("./utils");

function decode(buffer, opts) {
  opts = opts || {};

  if (!utils.isBlob(buffer)) {
    return { error: new TypeError("invalid Buffer for OSCMessage") };
  }

  const reader = new Reader(buffer);

  if (reader.readString() === "#bundle") {
    return decodeBundle(buffer, opts);
  }

  return decodeMessage(buffer, opts);
}

function decodeBundle(buffer, opts) {
  const reader = new Reader(buffer);

  // read '#bundle'
  reader.readString();

  const timetag = reader.readInt64();
  const elements = [];
  const oscType = "bundle";

  let error = null;

  while (reader.hasNext()) {
    const length = reader.readUInt32();
    const buffer = reader.read(length);
    const msg = decode(buffer, opts);

    if (msg.error) {
      error = msg.error;
    }

    elements.push(msg);

    if (reader.hasError()) {
      error = new RangeError("Offset is outside the bounds of the DataView");
    }

    if (error !== null) {
      break;
    }
  }

  const bundle = { timetag, elements, oscType };

  if (error) {
    bundle.error = error;
  }

  return bundle;
}

function decodeMessage(buffer, opts) {
  const reader = new Reader(buffer);
  const address = reader.readString();
  const tags = reader.readString();
  const oscType = "message";

  let args = [];
  let error = null;

  if (tags[0] === ",") {
    const stack = [];

    for (let i = 1; i < tags.length; i++) {
      const tag = tags[i];

      switch (tag) {
      case "[":
        stack.push(args);
        args = [];
        break;
      case "]":
        if (stack.length !== 0) {
          const pop = stack.pop();

          if (opts.strip) {
            pop.push(args);
          } else {
            pop.push({ type: "array", value: args });
          }

          args = pop;
        } else {
          error = new TypeError("Unexpected token ']'");
        }
        break;
      default:
        if (Tag.tags.hasOwnProperty(tag)) {
          if (opts.strip) {
            args.push(Tag.tags[tag].read(reader));
          } else {
            args.push({ type: Tag.tags[tag].type, value: Tag.tags[tag].read(reader) });
          }
        } else {
          error = new TypeError(`Not supported tag '${tag}'`);
        }
      }

      if (reader.hasError()) {
        error = new RangeError("Offset is outside the bounds of the DataView");
      }

      if (error !== null) {
        break;
      }
    }

    if (error === null && stack.length !== 0) {
      error = new TypeError("Unexpected token '['");
    }
  } else if (opts.strict) {
    error = new TypeError("Missing OSC Type Tag String");
  }

  const msg = { address, args, oscType };

  if (error) {
    msg.error = error;
  }

  return msg;
}

module.exports = decode;

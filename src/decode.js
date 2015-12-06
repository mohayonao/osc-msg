import Reader from "./Reader";
import Tag from "./Tag";
import * as utils from "./utils";

export default function decode(buffer, opts = {}) {
  if (!utils.isBlob(buffer)) {
    return { error: new TypeError("invalid Buffer for OSCMessage") };
  }

  let reader = new Reader(buffer);

  if (reader.readString() === "#bundle") {
    return decodeBundle(buffer, opts);
  }

  return decodeMessage(buffer, opts);
}

function decodeBundle(buffer, opts) {
  let reader = new Reader(buffer);

  // read '#bundle'
  reader.readString();

  let timetag = reader.readInt64();
  let elements = [];
  let oscType = "bundle";
  let error = null;

  while (reader.hasNext()) {
    let length = reader.readUInt32();
    let buffer = reader.read(length);
    let msg = decode(buffer, opts);

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

  let bundle = { timetag, elements, oscType };

  if (error) {
    bundle.error = error;
  }

  return bundle;
}

function decodeMessage(buffer, opts) {
  let reader = new Reader(buffer);
  let address = reader.readString();
  let tags = reader.readString();
  let args = [];
  let oscType = "message";
  let error = null;

  if (tags[0] === ",") {
    let stack = [];

    for (let i = 1; i < tags.length; i++) {
      let tag = tags[i];

      switch (tag) {
      case "[":
        stack.push(args);
        args = [];
        break;
      case "]":
        if (stack.length !== 0) {
          let pop = stack.pop();

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

  let msg = { address, args, oscType };

  if (error) {
    msg.error = error;
  }

  return msg;
}

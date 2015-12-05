import { Buffer2 } from "dataview2";
import compile from "./compile";
import Writer from "./Writer";
import Tag from "./Tag";

export default function encode(object, opts = {}) {
  object = compile(object, opts);

  let bufferLength = object.bufferLength;
  let buffer = new Buffer2(bufferLength);
  let writer = new Writer(buffer);

  if (object.oscType === "bundle") {
    encodeBundle(writer, object);
  } else {
    encodeMessage(writer, object);
  }

  if (object.error) {
    buffer.error = object.error;
  }

  return buffer;
}

function encodeBundle(writer, object) {
  writer.writeString("#bundle");
  writer.writeInt64(object.timetag);

  object.elements.forEach((element) => {
    writer.writeUInt32(element.bufferLength);

    if (element.oscType === "bundle") {
      encodeBundle(writer, element);
    } else {
      encodeMessage(writer, element);
    }
  });
}

function encodeMessage(writer, object) {
  writer.writeString(object.address);
  writer.writeString("," + object.types);

  object.values.forEach(({ type, value }) => {
    Tag.types[type].write(writer, value);
  });
}

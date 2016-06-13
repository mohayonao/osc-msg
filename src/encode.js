"use strict";

const Buffer2 = require("dataview2").Buffer2;
const compile = require("./compile");
const Writer = require("./Writer");
const Tag = require("./Tag");

function encode(object, opts) {
  opts = opts || {};
  object = compile(object, opts);

  const bufferLength = object.bufferLength;
  const buffer = new Buffer2(bufferLength);
  const writer = new Writer(buffer);

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

  object.values.forEach((items) => {
    Tag.types[items.type].write(writer, items.value);
  });
}

module.exports = encode;

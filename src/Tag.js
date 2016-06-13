"use strict";

const utils = require("./utils");

let types = {}, tags = {};

[
  {
    type: "integer",
    tag: "i",
    size: () => 4,
    validate: utils.isInteger,
    valueOf: value => +value|0,
    write(writer, value) {
      writer.writeInt32(value);
    },
    read: reader => reader.readInt32(),
  },
  {
    type: "float",
    tag: "f",
    size: () => 4,
    validate: utils.isFloat,
    valueOf: value => +value || 0,
    write(writer, value) {
      writer.writeFloat32(value);
    },
    read: reader => reader.readFloat32(),
  },
  {
    type: "string",
    tag: "s",
    size: value => utils.size4(value.length + 1),
    validate: utils.isString,
    valueOf: value => "" + value,
    write(writer, value) {
      writer.writeString(value);
    },
    read: reader => reader.readString(),
  },
  {
    type: "blob",
    tag: "b",
    size: value => 4 + utils.size4(value.byteLength || value.length),
    validate: utils.isBlob,
    valueOf: value => utils.toBlob(value),
    write(writer, value) {
      writer.writeBlob(value);
    },
    read: reader => reader.readBlob(),
  },
  {
    type: "timetag",
    tag: "t",
    size: () => 8,
    validate: utils.isTimetag,
    valueOf: value => Math.floor(+value) || 0,
    write(writer, value) {
      writer.writeInt64(value);
    },
    read: reader => reader.readInt64(),
  },
  {
    type: "double",
    tag: "d",
    size: () => 8,
    validate: utils.isDouble,
    valueOf: value => +value || 0,
    write(writer, value) {
      writer.writeFloat64(value);
    },
    read: reader => reader.readFloat64(),
  },
  {
    type: "true",
    tag: "T",
    size: () => 0,
    validate: value => value === true,
    valueOf: () => true,
    write: () => {},
    read: () => true,
  },
  {
    type: "false",
    tag: "F",
    size: () => 0,
    validate: value => value === false,
    valueOf: () => false,
    write: () => {},
    read: () => false,
  },
  {
    type: "null",
    tag: "N",
    size: () => 0,
    validate: value => value === null,
    valueOf: () => null,
    write: () => {},
    read: () => null,
  },
  {
    type: "bang",
    tag: "I",
    size: () => 0,
    validate: value => value === "bang",
    valueOf: () => "bang",
    write: () => {},
    read: () => "bang",
  },
].forEach((params) => {
  types[params.type] = params;
  tags[params.tag] = params;
});

module.exports = { types, tags };

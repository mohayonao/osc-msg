import * as util from "./util";

export let types = {
  integer: {
    tag: "i",
    size: () => 4,
    validate: value => (value|0) === value,
    write(writer, value) {
      writer.writeInt32(value);
    },
    read: reader => reader.readInt32(),
  },
  float: {
    tag: "f",
    size: () => 4,
    validate: value => value === value && typeof value === "number",
    write(writer, value) {
      writer.writeFloat32(value);
    },
    read: reader => reader.readFloat32(),
  },
  string: {
    tag: "s",
    size: value => util.size4(value.length + 1),
    validate: value => typeof value === "string",
    write(writer, value) {
      writer.writeString(value);
    },
    read: reader => reader.readString(),
  },
  blob: {
    tag: "b",
    size: value => 4 + util.size4(value.length || value.byteLength),
    validate: value => (value instanceof ArrayBuffer) || (value instanceof global.Buffer),
    write(writer, value) {
      writer.writeBlob(value);
    },
    read: reader => reader.readBlob(),
  },
  timetag: {
    tag: "t",
    size: () => 8,
    validate: value => typeof value === "number" && isFinite(+value) && Math.floor(value) === value,
    write(writer, value) {
      writer.writeInt64(value);
    },
    read: reader => reader.readInt64(),
  },
  double: {
    tag: "d",
    size: () => 8,
    validate: value => value === value && typeof value === "number",
    write(writer, value) {
      writer.writeFloat64(value);
    },
    read: reader => reader.readFloat64(),
  },
  true: {
    tag: "T",
    size: () => 0,
    validate: value => value === true,
    write: () => {},
    read: () => true,
  },
  false: {
    tag: "F",
    size: () => 0,
    validate: value => value === false,
    write: () => {},
    read: () => false,
  },
  null: {
    tag: "N",
    size: () => 0,
    validate: value => value === null,
    write: () => {},
    read: () => null,
  },
  bang: {
    tag: "I",
    size: () => 0,
    validate: value => value === "bang",
    write: () => {},
    read: () => "bang",
  },
};

export let tags = {};

Object.keys(types).forEach((key) => {
  tags[types[key].tag] = key;
});

import * as util from "./util";
import * as Tag from "./Tag";
import { Buffer2 } from "dataview2";
import Reader from "./Reader";
import Writer from "./Writer";
import OSCElement from "./OSCElement";

export default class OSCMessage extends OSCElement {
  constructor(address = "", args = []) {
    super();

    this._.types = ",";
    this._.args = [];
    this._.size = 0;

    this.address = address;
    this.add(...args);
  }

  static fromObject(obj) {
    if (typeof obj === "string") {
      obj = { address: obj };
    } else if (obj == null || typeof obj !== "object") {
      obj = {};
    }
    return new OSCMessage(obj.address, obj.args);
  }

  static fromBuffer(buffer) {
    if (!util.isBlob(buffer)) {
      return new OSCMessage();
    }

    let reader = new Reader(buffer);
    let address = reader.readString();
    let tags = reader.readString();

    if (tags[0] !== ",") {
      return new OSCMessage(address);
    }

    let args = [];
    let stack = [];

    for (let i = 1; i < tags.length; i++) {
      let tag = tags[i];
      if (tag === "[") {
        stack.push(args);
        args = [];
      } else if (tag === "]") {
        if (stack.length < 1) {
          throw new Error("Unexpected token ']'");
        }
        let pop = stack.pop();
        pop.push({ type: "array", value: args });
        args = pop;
      } else {
        let type = Tag.tags[tag];
        if (!Tag.types.hasOwnProperty(type)) {
          throw new Error(`Not supported tag '${tag}'`);
        }
        args.push({ type, value: Tag.types[type].read(reader) });
      }
    }

    if (stack.length !== 0) {
      throw new Error("Unexpected token '['");
    }

    return new OSCMessage(address, args);
  }

  get oscType() {
    return "message";
  }

  get address() {
    return this._.address;
  }

  set address(value) {
    if (typeof value !== "string") {
      throw new Error("address must be string");
    }
    this._.address = value;
  }

  get types() {
    return this._.types;
  }

  get size() {
    let result = 0;

    result += util.size4(this._.address.length + 1);
    result += util.size4(this._.types.length + 1);
    result += this._.size;

    return result;
  }

  add(...values) {
    values.forEach((obj) => {
      if (obj === null || typeof obj !== "object") {
        obj = this._convert(obj);
      } else if (Array.isArray(obj)) {
        obj = { type: "array", value: obj };
      }

      let { type, value } = obj;

      if (type === "array") {
        if (!Array.isArray(value)) {
          throw new Error(`Required '${type}', but got ${value}`);
        }

        this._.types += "[";

        value.forEach((value) => {
          this.add(value);
        });

        this._.types += "]";
      } else {
        if (!Tag.types.hasOwnProperty(type)) {
          throw new Error(`Unsupport type: ${type}`);
        }

        if (!Tag.types[type].validate(value)) {
          throw new Error(`Required '${type}', but got ${value}`);
        }

        this._.types += Tag.types[type].tag;
        this._.args.push({ type, value });
        this._.size += Tag.types[type].size(value);
      }
    });

    return this;
  }

  clear() {
    this._.address = "";
    this._.types = ",";
    this._.args = [];
    this._.size = 0;

    return this;
  }

  clone() {
    return new OSCMessage(this.address, this._.args.map((obj) => {
      return { type: obj.type, value: obj.value };
    }));
  }

  toObject() {
    let objArgs = [];
    let args = this._.args.slice();
    let types = this.types.slice(1).split("");
    let stack = [];

    for (let i = 0; i < types.length; i++) {
      let tag = types[i];
      if (tag === "[") {
        stack.push(objArgs);
        objArgs = [];
      } else if (tag === "]") {
        let pop = stack.pop();
        pop.push({ type: "array", value: objArgs });
        objArgs = pop;
      } else {
        objArgs.push(args.shift());
      }
    }

    return {
      address: this.address,
      args: objArgs,
      oscType: this.oscType,
    };
  }

  toBuffer() {
    let buffer = new Buffer2(this.size);

    this._writeTo(new Writer(buffer));

    return buffer;
  }

  // private methods
  _convert(value) {
    switch (typeof value) {
      case "number":
        return { type: "float", value: value };
      case "string":
        return { type: "string", value: value };
      case "boolean":
        if (value) {
          return { type: "true", value: true };
        }
        return { type: "false", value: false };
    }
    return { type: "null", value: null };
  }

  _writeTo(writer) {
    writer.writeString(this.address);
    writer.writeString(this.types);

    this._.args.forEach((arg) => {
      Tag.types[arg.type].write(writer, arg.value);
    });
  }
}

OSCElement.OSCMessage = OSCMessage;

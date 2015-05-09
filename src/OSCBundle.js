import * as util from "./util";
import { Buffer2 } from "dataview2";
import Reader from "./Reader";
import Writer from "./Writer";
import OSCElement from "./OSCElement";

export default class OSCBundle extends OSCElement {
  constructor(timetag = 0, elements = []) {
    super();

    this._.timetag = 0;
    this._.elements = [];
    this._.hasError = false;

    this.timetag = timetag;
    this.add(...elements);
  }

  static fromObject(obj) {
    if (obj == null || typeof obj !== "object") {
      obj = {};
    }
    return new OSCBundle(obj.timetag, obj.elements);
  }

  static fromBuffer(buffer) {
    if (!util.isBlob(buffer)) {
      return new OSCBundle();
    }

    let reader = new Reader(buffer);
    let header = reader.readString();

    if (header !== "#bundle") {
      return new OSCBundle();
    }

    let timetag = reader.readInt64();
    let elements = [];

    while (reader.hasNext()) {
      let length = reader.readUInt32();
      let buffer = reader.read(length);

      elements.push(OSCElement.fromBuffer(buffer));
    }

    let bundle = new OSCBundle(timetag, elements);

    bundle._.hasError = reader.hasError();

    return bundle;
  }

  get oscType() {
    return "bundle";
  }

  get timetag() {
    return this._.timetag;
  }

  set timetag(value) {
    if (!util.isTimetag(value)) {
      throw new Error("timetag must be an integer");
    }
    this._.timetag = value;
  }

  get size() {
    let result = 0;

    result += 8; // "#bundle_"
    result += 8; // timetag
    result += this._.elements.length * 4;
    result += this._.elements.reduce((a, b) => a + b.size, 0);

    return result;
  }

  add(...elements) {
    elements.forEach((element) => {
      if (element instanceof OSCElement) {
        this._.elements.push(element);
      } else if (element && (typeof element === "object" || typeof element === "string")) {
        this._.elements.push(OSCElement.fromObject(element));
      } else {
        throw new Error("element must be a OSCMessage or OSCBundle");
      }
    });

    return this;
  }

  clear() {
    this._.timetag = 0;
    this._.elements = [];

    return this;
  }

  clone() {
    return new OSCBundle(this.timetag, this._.elements.map(element => element.clone()));
  }

  toObject() {
    let obj = {
      timetag: this.timetag,
      elements: this._.elements.map(element => element.toObject()),
      oscType: this.oscType,
    };

    if (this._.hasError) {
      obj.error = true;
    }

    return obj;
  }

  toBuffer() {
    let buffer = new Buffer2(this.size);

    this._writeTo(new Writer(buffer));

    return buffer;
  }

  // private methods
  _writeTo(writer) {
    writer.writeString("#bundle");
    writer.writeInt64(this.timetag);
    this._.elements.forEach((element) => {
      writer.writeUInt32(element.size);
      element._writeTo(writer);
    });
  }
}

OSCElement.OSCBundle = OSCBundle;

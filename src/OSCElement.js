import * as util from "./util";
import Reader from "./Reader";

export default class OSCElement {
  constructor() {
    Object.defineProperty(this, "_", {
      value: {},
    });
  }

  static fromObject(obj) {
    if (typeof obj === "string") {
      obj = { address: obj };
    } else if (obj == null || typeof obj !== "object") {
      obj = { address: "" };
    }

    if (typeof obj.timetag === "number") {
      return OSCElement.OSCBundle.fromObject(obj);
    }

    return OSCElement.OSCMessage.fromObject(obj);
  }

  static fromBuffer(buffer) {
    if (!util.isBlob(buffer)) {
      return new OSCElement.OSCMessage();
    }

    let reader = new Reader(buffer);

    if (reader.readString() === "#bundle") {
      return OSCElement.OSCBundle.fromBuffer(buffer);
    }

    return OSCElement.OSCMessage.fromBuffer(buffer);
  }
}

// assign later
OSCElement.OSCMessage = null;
OSCElement.OSCBundle = null;

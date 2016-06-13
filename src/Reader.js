"use strict";

const DataView2 = require("dataview2").DataView2;
const Buffer2 = require("dataview2").Buffer2;

const TWO_TO_THE_32 = Math.pow(2, 32);

class Reader {
  constructor(buffer) {
    this.view = new DataView2(buffer);

    this._index = 0;
    this._hasError = false;
  }

  read(length) {
    length >>>= 0;

    if (this._index + length <= this.view.byteLength) {
      let buffer = new Buffer2(length);
      let view = new DataView2(buffer);

      for (let i = 0; i < length; i++) {
        view.setUint8(i, this.readUInt8());
      }

      return buffer;
    }

    this._index += length;
    this._hasError = true;

    return new Buffer2(0);
  }

  readUInt8() {
    this._index += 1;

    if (this._index <= this.view.byteLength) {
      return this.view.getUint8(this._index - 1);
    }

    this._hasError = true;

    return 0;
  }

  readInt32() {
    this._index += 4;

    if (this._index <= this.view.byteLength) {
      return this.view.getInt32(this._index - 4);
    }

    this._hasError = true;

    return 0;
  }

  readUInt32() {
    this._index += 4;

    if (this._index <= this.view.byteLength) {
      return this.view.getUint32(this._index - 4);
    }

    this._hasError = true;

    return 0;
  }

  readInt64() {
    let hi = this.readUInt32();
    let lo = this.readUInt32();

    return hi * TWO_TO_THE_32 + lo;
  }

  readFloat32() {
    this._index += 4;

    if (this._index <= this.view.byteLength) {
      return this.view.getFloat32(this._index - 4);
    }

    this._hasError = true;

    return 0;
  }

  readFloat64() {
    this._index += 8;

    if (this._index <= this.view.byteLength) {
      return this.view.getFloat64(this._index - 8);
    }

    this._hasError = true;

    return 0;
  }

  readString() {
    let result = "";
    let charCode;

    if (this.hasNext()) {
      while (this.hasNext() && (charCode = this.readUInt8()) !== 0x00) {
        result += String.fromCharCode(charCode);
      }
      this._align();
    } else {
      this._hasError = true;
    }

    return result;
  }

  readBlob() {
    let length = this.readUInt32();
    let buffer = this.read(length);

    this._align();

    return buffer;
  }

  hasError() {
    return this._hasError;
  }

  hasNext() {
    return this._index < this.view.byteLength;
  }

  _align() {
    while (this.hasNext() && this._index % 4 !== 0 && this.view.getUint8(this._index) === 0x00) {
      this._index += 1;
    }
  }
}

module.exports = Reader;

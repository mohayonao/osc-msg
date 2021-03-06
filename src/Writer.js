"use strict";

const DataView2 = require("dataview2").DataView2;

class Writer {
  constructor(buffer) {
    this.view = new DataView2(buffer);

    this._index = 0;
    this._hasError = false;
  }

  writeUInt8(value) {
    this._index += 1;

    if (this._index <= this.view.byteLength) {
      this.view.setUint8(this._index - 1, value);
    } else {
      this._hasError = true;
    }
  }

  writeInt32(value) {
    this._index += 4;

    if (this._index <= this.view.byteLength) {
      this.view.setInt32(this._index - 4, value);
    } else {
      this._hasError = true;
    }
  }

  writeUInt32(value) {
    this._index += 4;

    if (this._index <= this.view.byteLength) {
      this.view.setUint32(this._index - 4, value);
    } else {
      this._hasError = true;
    }
  }

  writeFloat32(value) {
    this._index += 4;

    if (this._index <= this.view.byteLength) {
      this.view.setFloat32(this._index - 4, value);
    } else {
      this._hasError = true;
    }
  }

  writeFloat64(value) {
    this._index += 8;

    if (this._index <= this.view.byteLength) {
      this.view.setFloat64(this._index - 8, value);
    } else {
      this._hasError = true;
    }
  }

  writeString(value) {
    for (let i = 0; i < value.length; i++) {
      this.writeUInt8(value.charCodeAt(i));
    }

    this.writeUInt8(0);
    this._align();
  }

  writeBlob(value) {
    const view = new DataView2(value);
    const length = view.byteLength;

    this.writeUInt32(length);

    for (let i = 0; i < length; i++) {
      this.writeUInt8(view.getUint8(i));
    }

    this._align();
  }

  writeAddress(value) {
    if (typeof value === "number") {
      this.writeUInt32(value);
    } else {
      this.writeString("" + value);
    }
  }

  writeTimeTag([ hi, lo ]) {
    this.writeUInt32(hi);
    this.writeUInt32(lo);
  }

  writeRawData(buffer, length) {
    if (this._index + length <= this.view.byteLength) {
      for (let i = 0; i < length; i++) {
        this.view.setUint8(this._index++, buffer[i]);
      }
    } else {
      this._hasError = true;
    }
  }

  hasError() {
    return this._hasError;
  }

  hasNext() {
    return this._index < this.view.byteLength;
  }

  _align() {
    while (this._index % 4 !== 0) {
      this.writeUInt8(0x00);
    }
  }
}

module.exports = Writer;

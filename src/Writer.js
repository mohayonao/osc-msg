import { DataView2 } from "dataview2";

const TWO_TO_THE_32 = Math.pow(2, 32);

export default class Writer {
  constructor(buffer) {
    this.view = new DataView2(buffer);
    this.index = 0;
    this.error = false;
  }

  writeUInt8(value) {
    this.index += 1;
    if (this.view.byteLength < this.index) {
      this.error = true;
      return;
    }
    this.view.setUint8(this.index - 1, value);
  }

  writeInt32(value) {
    this.index += 4;
    if (this.view.byteLength < this.index) {
      this.error = true;
      return;
    }
    this.view.setInt32(this.index - 4, value);
  }

  writeUInt32(value) {
    this.index += 4;
    if (this.view.byteLength < this.index) {
      this.error = true;
      return;
    }
    this.view.setUint32(this.index - 4, value);
  }

  writeInt64(value) {
    let hi = (value / TWO_TO_THE_32) >>> 0;
    let lo = value >>> 0;

    this.writeUInt32(hi);
    this.writeUInt32(lo);
  }

  writeFloat32(value) {
    this.index += 4;
    if (this.view.byteLength < this.index) {
      this.error = true;
      return;
    }
    this.view.setFloat32(this.index - 4, value);
  }

  writeFloat64(value) {
    this.index += 8;
    if (this.view.byteLength < this.index) {
      this.error = true;
      return;
    }
    this.view.setFloat64(this.index - 8, value);
  }

  writeString(value) {
    for (let i = 0; i < value.length; i++) {
      this.writeUInt8(value.charCodeAt(i));
    }

    this.writeUInt8(0);
    this.align();
  }

  writeBlob(value) {
    let view = new DataView2(value);
    let length = view.byteLength;

    this.writeUInt32(length);

    for (let i = 0; i < length; i++) {
      this.writeUInt8(view.getUint8(i));
    }

    this.align();
  }

  hasError() {
    return this.error;
  }

  hasNext() {
    return this.index < this.view.byteLength;
  }

  align() {
    while (this.index % 4 !== 0) {
      this.writeUInt8(0x00);
    }
  }
}

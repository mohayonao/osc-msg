import { DataView2 } from "dataview2";

const TWO_TO_THE_32 = Math.pow(2, 32);

export default class Writer {
  constructor(buffer) {
    this.view = new DataView2(buffer);
    this.index = 0;
  }

  writeUInt8(value) {
    this.view.setUint8(this.index, value);
    this.index += 1;
  }

  writeInt32(value) {
    this.view.setInt32(this.index, value);
    this.index += 4;
  }

  writeUInt32(value) {
    this.view.setUint32(this.index, value);
    this.index += 4;
  }

  writeInt64(value) {
    let hi = (value / TWO_TO_THE_32) >>> 0;
    let lo = value >>> 0;

    this.view.setUint32(this.index + 0, hi);
    this.view.setUint32(this.index + 4, lo);
    this.index += 8;
  }

  writeFloat32(value) {
    this.view.setFloat32(this.index, value);
    this.index += 4;
  }

  writeFloat64(value) {
    this.view.setFloat64(this.index, value);
    this.index += 8;
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

  hasNext() {
    return this.index < this.view.byteLength;
  }

  align() {
    while (this.index % 4 !== 0) {
      this.view.setUint8(this.index, 0);
      this.index += 1;
    }
  }
}

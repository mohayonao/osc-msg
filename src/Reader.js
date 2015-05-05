import { DataView2, Buffer2 } from "dataview2";

const TWO_TO_THE_32 = Math.pow(2, 32);

export default class Reader {
  constructor(buffer) {
    this.data = new DataView2(buffer);
    this.index = 0;
  }

  read(length) {
    let buffer = new Buffer2(length);
    let view = new DataView2(buffer);

    for (let i = 0; i < length; i++) {
      view.setUint8(i, this.readUInt8());
    }

    return buffer;
  }

  readUInt8() {
    this.index += 1;
    return this.data.getUint8(this.index - 1);
  }

  readInt32() {
    this.index += 4;
    return this.data.getInt32(this.index - 4);
  }

  readUInt32() {
    this.index += 4;
    return this.data.getUint32(this.index - 4);
  }

  readInt64() {
    let hi = this.readUInt32();
    let lo = this.readUInt32();
    return hi * TWO_TO_THE_32 + lo;
  }

  readFloat32() {
    this.index += 4;
    return this.data.getFloat32(this.index - 4);
  }

  readFloat64() {
    this.index += 8;
    return this.data.getFloat64(this.index - 8);
  }

  readString() {
    let result = "";
    let charCode;

    while (this.hasNext() && (charCode = this.readUInt8()) !== 0x00) {
      result += String.fromCharCode(charCode);
    }
    this.align();

    return result;
  }

  readBlob() {
    let length = this.readUInt32();
    let buffer = this.read(length);

    this.align();

    return buffer;
  }

  hasNext() {
    return this.index < this.data.byteLength;
  }

  align() {
    while (this.hasNext() && this.index % 4 !== 0 && this.data.getUint8(this.index) === 0x00) {
      this.index += 1;
    }
  }
}

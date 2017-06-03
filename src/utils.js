"use strict";

const DataView2 = require("dataview2").DataView2;
const Buffer2 = require("dataview2").Buffer2;

function size4(num) {
  return Math.ceil((num|0) / 4) << 2;
}

function isNone(value) {
  return typeof value === "undefined" || value === null;
}

function isInteger(value) {
  return Math.floor(value) === value && value % 1 === 0;
}

function isFloat(value) {
  return !isNaN(value) && typeof value === "number";
}

function isDouble(value) {
  return !isNaN(value) && typeof value === "number";
}

function isTimeTag(value) {
  if (Array.isArray(value)) {
    return value.length === 2 && isInteger(value[0]) && isInteger(value[1]);
  }
  if (value instanceof Date) {
    return true;
  }
  return typeof value === "number" && value >= 0 && value % 1 === 0;
}

function isString(value) {
  return typeof value === "string";
}

function isBlob(value) {
  return (value instanceof ArrayBuffer) || (value instanceof global.Buffer);
}

function toString(value) {
  if (isNone(value)) {
    return "";
  }
  return "" + value;
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (isNone(value)) {
    return [];
  }
  return [ value ];
}

function toBlob(value) {
  if (isBlob(value)) {
    return value;
  }

  if (Array.isArray(value)) {
    const view = new DataView2(new Buffer2(value.length));

    for (let i = 0; i < value.length; i++) {
      view.setUint8(i, value[i]);
    }

    return view.buffer;
  }

  if (typeof value === "string") {
    const view = new DataView2(new Buffer2(value.length));

    for (let i = 0; i < value.length; i++) {
      view.setUint8(i, value.charCodeAt(i));
    }

    return view.buffer;
  }

  if (typeof value === "number") {
    return new Buffer2(+value|0);
  }

  return new Buffer2(0);
}

function toAddress(value) {
  if (typeof value === "number") {
    return value >>> 0;
  }
  return toString(value);
}

function toTimeTag(value) {
  if (Array.isArray(value)) {
    return toTimeTagFromArray(value);
  }
  if (value instanceof Date) {
    return toTimeTagFromDate(value);
  }
  return toTimeTagFromNumber(value);
}

function toTimeTagFromArray([ hi, lo ]) {
  hi >>>= 0;
  lo >>>= 0;

  return [ hi, lo ];
}

function toTimeTagFromDate(value) {
  const time = (value / 1000) + 2208988800;
  const hi = time >>> 0;
  const lo = ((time - hi) * 4294967296) >>> 0;

  return [ hi, lo ];
}

function toTimeTagFromNumber(value) {
  const hi = (value / 4294967296) >>> 0;
  const lo = (value % 4294967296) >>> 0;

  return [ hi, lo ];
}

module.exports = {
  size4, isNone, isInteger, isFloat, isDouble, isTimeTag, isString, isBlob, toString, toArray, toBlob, toAddress, toTimeTag
};

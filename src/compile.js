"use strict";

const Tag = require("./Tag");
const utils = require("./utils");

function compile(object, opts) {
  if (object === null || typeof object !== "object" || Array.isArray(object)) {
    object = { args: [ object ] };
  }

  if (Array.isArray(object.elements) || typeof object.timetag === "number") {
    return compileBundle(object, opts);
  }

  return compileMessage(object, opts);
}

function compileBundle(object, opts) {
  let timetag = Math.floor(object.timetag || 0);
  let elements = utils.toArray(object.elements).map(element => compile(element, opts));
  let bufferLength = 0;
  let error = false;
  let oscType = "bundle";

  // #bundle_
  bufferLength += 8;
  // timetag
  bufferLength += 8;
  // blob size
  bufferLength += elements.length * 4;
  bufferLength += elements.reduce((bufferLength, element) => bufferLength + element.bufferLength, 0);

  error = error || elements.reduce((error, element) => error || element.error, null);

  return { timetag, elements, bufferLength, oscType, error };
}

function compileMessage(object, opts) {
  if (opts.strict && typeof object.address !== "string") {
    return {
      address: "", types: "", values: [], bufferLength: 0, oscType: "message",
      error: new TypeError("OSC Message must contain an address"),
    };
  }

  let address = utils.toString(object.address);
  let args = utils.toArray(object.args).map(value => convertTypedValue(value, opts));
  let items = build(args, opts);
  let types = items.types;
  let values = items.values;
  let bufferLength = items.bufferLength;
  let error = items.error;
  let oscType = "message";

  bufferLength += utils.size4(address.length + 1);
  bufferLength += utils.size4(types.length + 2);

  return { address, types, values, bufferLength, oscType, error };
}

function convertTypedValue(value, opts) {
  if (utils.isNone(value)) {
    return { type: "null", value: null };
  }

  switch (typeof value) {
  case "number":
    if (opts.integer) {
      return { type: "integer", value };
    }
    return { type: "float", value };
  case "string":
    return { type: "string", value };
  case "boolean":
    return { type: value.toString(), value };
  default:
    // do nothing
  }

  if (Array.isArray(value)) {
    return { type: "array", value: value.map(value => convertTypedValue(value, opts)) };
  }

  return value;
}

function build(args, opts) {
  let values = [];
  let types = "";
  let bufferLength = 0;
  let error = null;

  for (let i = 0; i < args.length; i++) {
    let value = args[i];

    if (Tag.types.hasOwnProperty(value.type)) {
      let type = Tag.types[value.type];

      if (opts.strict && !type.validate(value.value)) {
        error = new TypeError(`Invalid date: expected ${value.type}, but got ${JSON.stringify(value)}`);
      }

      value = { type: value.type, value: type.valueOf(value.value) };

      values.push(value);
      types += type.tag;
      bufferLength += type.size(value.value);
    } else if (value.type === "array") {
      let item = build(value.value, opts);

      values.push.apply(values, item.values);
      types += `[${item.types}]`;
      bufferLength += item.bufferLength;
      error = error || item.error;
    } else {
      error = new TypeError(`Invalid data: ${value}`);
    }

    if (error !== null) {
      break;
    }
  }

  return { types, values, bufferLength, error };
}

module.exports = compile;

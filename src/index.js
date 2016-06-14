"use strict";

const decode = require("./decode");
const encode = require("./encode");

module.exports = {
  decode,
  encode,
  fromBuffer: decode,
  fromObject: encode,
  toBuffer: encode,
  toObject: decode
};

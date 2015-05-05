(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var BufferDataView = require("buffer-dataview");

function DataView2(buffer) {
  if (global.Buffer && buffer instanceof global.Buffer) {
    return new BufferDataView(buffer);
  }
  return new DataView(buffer);
}

function Buffer2(n) {
  if (global.Buffer) {
    return new global.Buffer(n);
  }
  return new Uint8Array(n).buffer;
}

module.exports = {
  DataView2: DataView2,
  Buffer2: Buffer2,
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"buffer-dataview":2}],2:[function(require,module,exports){

/**
 * Module exports.
 */

module.exports = DataView;

/**
 * Very minimal `DataView` implementation that wraps (doesn't *copy*)
 * Node.js Buffer instances.
 *
 *  Spec: http://www.khronos.org/registry/typedarray/specs/latest/#8
 *  MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays/DataView
 *
 * @param {Buffer} buffer
 * @param {Number} byteOffset (optional)
 * @param {Number} byteLength (optional)
 * @api public
 */

function DataView (buffer, byteOffset, byteLength) {
  if (!(this instanceof DataView)) throw new TypeError('Constructor DataView requires \'new\'');
  if (!buffer || null == buffer.length) throw new TypeError('First argument to DataView constructor must be a Buffer');
  if (null == byteOffset) byteOffset = 0;
  if (null == byteLength) byteLength = buffer.length;
  this.buffer = buffer;
  this.byteOffset = byteOffset | 0;
  this.byteLength = byteLength | 0;
}

/**
 * "Get" functions.
 */

DataView.prototype.getInt8 = function (byteOffset) {
  if (arguments.length < 1) throw new TypeError('invalid_argument');
  var offset = this.byteOffset + (byteOffset | 0);
  var max = this.byteOffset + this.byteLength - 1;
  if (offset < this.byteOffset || offset > max) {
    throw new RangeError('Offset is outside the bounds of the DataView');
  }
  return this.buffer.readInt8(offset);
};

DataView.prototype.getUint8 = function (byteOffset) {
  if (arguments.length < 1) throw new TypeError('invalid_argument');
  var offset = this.byteOffset + (byteOffset | 0);
  var max = this.byteOffset + this.byteLength - 1;
  if (offset < this.byteOffset || offset > max) {
    throw new RangeError('Offset is outside the bounds of the DataView');
  }
  return this.buffer.readUInt8(offset);
};

DataView.prototype.getInt16 = function (byteOffset, littleEndian) {
  if (arguments.length < 1) throw new TypeError('invalid_argument');
  var offset = this.byteOffset + (byteOffset | 0);
  var max = this.byteOffset + this.byteLength - 1;
  if (offset < this.byteOffset || offset > max) {
    throw new RangeError('Offset is outside the bounds of the DataView');
  }
  if (littleEndian) {
    return this.buffer.readInt16LE(offset);
  } else {
    return this.buffer.readInt16BE(offset);
  }
};

DataView.prototype.getUint16 = function (byteOffset, littleEndian) {
  if (arguments.length < 1) throw new TypeError('invalid_argument');
  var offset = this.byteOffset + (byteOffset | 0);
  var max = this.byteOffset + this.byteLength - 1;
  if (offset < this.byteOffset || offset > max) {
    throw new RangeError('Offset is outside the bounds of the DataView');
  }
  if (littleEndian) {
    return this.buffer.readUInt16LE(offset);
  } else {
    return this.buffer.readUInt16BE(offset);
  }
};

DataView.prototype.getInt32 = function (byteOffset, littleEndian) {
  if (arguments.length < 1) throw new TypeError('invalid_argument');
  var offset = this.byteOffset + (byteOffset | 0);
  var max = this.byteOffset + this.byteLength - 1;
  if (offset < this.byteOffset || offset > max) {
    throw new RangeError('Offset is outside the bounds of the DataView');
  }
  if (littleEndian) {
    return this.buffer.readInt32LE(offset);
  } else {
    return this.buffer.readInt32BE(offset);
  }
};

DataView.prototype.getUint32 = function (byteOffset, littleEndian) {
  if (arguments.length < 1) throw new TypeError('invalid_argument');
  var offset = this.byteOffset + (byteOffset | 0);
  var max = this.byteOffset + this.byteLength - 1;
  if (offset < this.byteOffset || offset > max) {
    throw new RangeError('Offset is outside the bounds of the DataView');
  }
  if (littleEndian) {
    return this.buffer.readUInt32LE(offset);
  } else {
    return this.buffer.readUInt32BE(offset);
  }
};

DataView.prototype.getFloat32 = function (byteOffset, littleEndian) {
  if (arguments.length < 1) throw new TypeError('invalid_argument');
  var offset = this.byteOffset + (byteOffset | 0);
  var max = this.byteOffset + this.byteLength - 1;
  if (offset < this.byteOffset || offset > max) {
    throw new RangeError('Offset is outside the bounds of the DataView');
  }
  if (littleEndian) {
    return this.buffer.readFloatLE(offset);
  } else {
    return this.buffer.readFloatBE(offset);
  }
};

DataView.prototype.getFloat64 = function (byteOffset, littleEndian) {
  if (arguments.length < 1) throw new TypeError('invalid_argument');
  var offset = this.byteOffset + (byteOffset | 0);
  var max = this.byteOffset + this.byteLength - 1;
  if (offset < this.byteOffset || offset > max) {
    throw new RangeError('Offset is outside the bounds of the DataView');
  }
  if (littleEndian) {
    return this.buffer.readDoubleLE(offset);
  } else {
    return this.buffer.readDoubleBE(offset);
  }
};

/**
 * "Set" functions.
 */

DataView.prototype.setInt8 = function (byteOffset, value) {
  if (arguments.length < 2) throw new TypeError('invalid_argument');
  var offset = this.byteOffset + (byteOffset | 0);
  var max = this.byteOffset + this.byteLength - 1;
  if (offset < this.byteOffset || offset > max) {
    throw new RangeError('Offset is outside the bounds of the DataView');
  }
  // wrap the `value` from -128 to 128
  value = ((value + 128) & 255) - 128;
  this.buffer.writeInt8(value, offset);
};

DataView.prototype.setUint8 = function (byteOffset, value) {
  if (arguments.length < 2) throw new TypeError('invalid_argument');
  var offset = this.byteOffset + (byteOffset | 0);
  var max = this.byteOffset + this.byteLength - 1;
  if (offset < this.byteOffset || offset > max) {
    throw new RangeError('Offset is outside the bounds of the DataView');
  }
  // wrap the `value` from 0 to 255
  value = value & 255;
  this.buffer.writeUInt8(value, offset);
};

DataView.prototype.setInt16 = function (byteOffset, value, littleEndian) {
  if (arguments.length < 2) throw new TypeError('invalid_argument');
  var offset = this.byteOffset + (byteOffset | 0);
  var max = this.byteOffset + this.byteLength - 1;
  if (offset < this.byteOffset || offset > max) {
    throw new RangeError('Offset is outside the bounds of the DataView');
  }
  // wrap the `value` from -32768 to 32768
  value = ((value + 32768) & 65535) - 32768;
  if (littleEndian) {
    this.buffer.writeInt16LE(value, offset);
  } else {
    this.buffer.writeInt16BE(value, offset);
  }
};

DataView.prototype.setUint16 = function (byteOffset, value, littleEndian) {
  if (arguments.length < 2) throw new TypeError('invalid_argument');
  var offset = this.byteOffset + (byteOffset | 0);
  var max = this.byteOffset + this.byteLength - 1;
  if (offset < this.byteOffset || offset > max) {
    throw new RangeError('Offset is outside the bounds of the DataView');
  }
  // wrap the `value` from 0 to 65535
  value = value & 65535;
  if (littleEndian) {
    this.buffer.writeUInt16LE(value, offset);
  } else {
    this.buffer.writeUInt16BE(value, offset);
  }
};

DataView.prototype.setInt32 = function (byteOffset, value, littleEndian) {
  if (arguments.length < 2) throw new TypeError('invalid_argument');
  var offset = this.byteOffset + (byteOffset | 0);
  var max = this.byteOffset + this.byteLength - 1;
  if (offset < this.byteOffset || offset > max) {
    throw new RangeError('Offset is outside the bounds of the DataView');
  }
  // wrap the `value` from -2147483648 to 2147483648
  value |= 0;
  if (littleEndian) {
    this.buffer.writeInt32LE(value, offset);
  } else {
    this.buffer.writeInt32BE(value, offset);
  }
};

DataView.prototype.setUint32 = function (byteOffset, value, littleEndian) {
  if (arguments.length < 2) throw new TypeError('invalid_argument');
  var offset = this.byteOffset + (byteOffset | 0);
  var max = this.byteOffset + this.byteLength - 1;
  if (offset < this.byteOffset || offset > max) {
    throw new RangeError('Offset is outside the bounds of the DataView');
  }
  // wrap the `value` from 0 to 4294967295
  value = value >>> 0;
  if (littleEndian) {
    this.buffer.writeUInt32LE(value, offset);
  } else {
    this.buffer.writeUInt32BE(value, offset);
  }
};

DataView.prototype.setFloat32 = function (byteOffset, value, littleEndian) {
  if (arguments.length < 2) throw new TypeError('invalid_argument');
  var offset = this.byteOffset + (byteOffset | 0);
  var max = this.byteOffset + this.byteLength - 1;
  if (offset < this.byteOffset || offset > max) {
    throw new RangeError('Offset is outside the bounds of the DataView');
  }
  if (littleEndian) {
    this.buffer.writeFloatLE(value, offset);
  } else {
    this.buffer.writeFloatBE(value, offset);
  }
};

DataView.prototype.setFloat64 = function (byteOffset, value, littleEndian) {
  if (arguments.length < 2) throw new TypeError('invalid_argument');
  var offset = this.byteOffset + (byteOffset | 0);
  var max = this.byteOffset + this.byteLength - 1;
  if (offset < this.byteOffset || offset > max) {
    throw new RangeError('Offset is outside the bounds of the DataView');
  }
  if (littleEndian) {
    this.buffer.writeDoubleLE(value, offset);
  } else {
    this.buffer.writeDoubleBE(value, offset);
  }
};

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _import = require("./util");

var util = _interopRequireWildcard(_import);

var _import2 = require("./Tag");

var Tag = _interopRequireWildcard(_import2);

var _Buffer2 = require("dataview2");

var _Reader = require("./Reader");

var _Reader2 = _interopRequireDefault(_Reader);

var _Writer = require("./Writer");

var _Writer2 = _interopRequireDefault(_Writer);

var Message = (function () {
  function Message() {
    var address = arguments[0] === undefined ? "" : arguments[0];
    var args = arguments[1] === undefined ? [] : arguments[1];

    _classCallCheck(this, Message);

    this._ = {};
    this._.types = ",";
    this._.args = [];
    this._.size = 0;

    this.address = address;
    this.add.apply(this, _toConsumableArray(args));
  }

  _createClass(Message, [{
    key: "address",
    get: function () {
      return this._.address;
    },
    set: function (value) {
      if (typeof value !== "string") {
        throw new Error("address must be string");
      }
      this._.address = value;
    }
  }, {
    key: "types",
    get: function () {
      return this._.types;
    }
  }, {
    key: "size",
    get: function () {
      var result = 0;

      result += util.size4(this._.address.length + 1);
      result += util.size4(this._.types.length + 1);
      result += this._.size;

      return result;
    }
  }, {
    key: "add",
    value: function add() {
      var _this = this;

      for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
        values[_key] = arguments[_key];
      }

      values.forEach(function (obj) {
        if (obj === null || typeof obj !== "object") {
          obj = _this._convert(obj);
        } else if (Array.isArray(obj)) {
          obj = { type: "array", value: obj };
        }

        var type = obj.type;
        var value = obj.value;

        if (type === "array") {
          if (!Array.isArray(value)) {
            throw new Error("Required '" + type + "', but got " + value);
          }

          _this._.types += "[";

          value.forEach(function (value) {
            _this.add(value);
          });

          _this._.types += "]";
        } else {
          if (!Tag.types.hasOwnProperty(type)) {
            throw new Error("Unsupport type: " + type);
          }

          if (!Tag.types[type].validate(value)) {
            throw new Error("Required '" + type + "', but got " + value);
          }

          _this._.types += Tag.types[type].tag;
          _this._.args.push({ type: type, value: value });
          _this._.size += Tag.types[type].size(value);
        }
      });

      return this;
    }
  }, {
    key: "clear",
    value: function clear() {
      this._.address = "";
      this._.types = ",";
      this._.args = [];
      this._.size = 0;

      return this;
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Message(this.address, this._.args.map(function (obj) {
        return { type: obj.type, value: obj.value };
      }));
    }
  }, {
    key: "toObject",
    value: function toObject() {
      var objArgs = [];
      var args = this._.args.slice();
      var types = this.types.slice(1).split("");
      var stack = [];

      for (var i = 0; i < types.length; i++) {
        var tag = types[i];
        if (tag === "[") {
          stack.push(objArgs);
          objArgs = [];
        } else if (tag === "]") {
          var pop = stack.pop();
          pop.push({ type: "array", value: objArgs });
          objArgs = pop;
        } else {
          objArgs.push(args.shift());
        }
      }

      return {
        address: this.address,
        args: objArgs,
        oscType: "message" };
    }
  }, {
    key: "toBuffer",
    value: function toBuffer() {
      var buffer = new _Buffer2.Buffer2(this.size);
      var writer = new _Writer2["default"](buffer);

      writer.writeString(this.address);
      writer.writeString(this.types);

      this._.args.forEach(function (arg) {
        Tag.types[arg.type].write(writer, arg.value);
      });

      return buffer;
    }
  }, {
    key: "_convert",

    // private methods
    value: function _convert(value) {
      switch (typeof value) {
        case "number":
          return { type: "float", value: value };
        case "string":
          return { type: "string", value: value };
        case "boolean":
          if (value) {
            return { type: "true", value: true };
          }
          return { type: "false", value: false };
      }
      return { type: "null", value: null };
    }
  }], [{
    key: "fromObject",
    value: function fromObject(obj) {
      if (typeof obj === "string") {
        obj = { address: obj };
      }
      return new Message(obj.address, obj.args);
    }
  }, {
    key: "fromBuffer",
    value: function fromBuffer(buffer) {
      var reader = new _Reader2["default"](buffer);
      var address = reader.readString();

      if (!reader.hasNext()) {
        return new Message(address);
      }

      var tags = reader.readString();

      if (tags[0] !== ",") {
        throw new Error("An OSC Type Tag String must start with the character ','");
      }

      var args = [];
      var stack = [];

      for (var i = 1; i < tags.length; i++) {
        var tag = tags[i];
        if (tag === "[") {
          stack.push(args);
          args = [];
        } else if (tag === "]") {
          if (stack.length < 1) {
            throw new Error("Unexpected token ']'");
          }
          var pop = stack.pop();
          pop.push({ type: "array", value: args });
          args = pop;
        } else {
          var type = Tag.tags[tag];
          if (!Tag.types.hasOwnProperty(type)) {
            throw new Error("Not supported argument code '" + type + "'");
          }
          args.push({ type: type, value: Tag.types[type].read(reader) });
        }
      }

      if (stack.length !== 0) {
        throw new Error("Unexpected token '['");
      }

      return new Message(address, args);
    }
  }]);

  return Message;
})();

exports["default"] = Message;
module.exports = exports["default"];

},{"./Reader":4,"./Tag":5,"./Writer":6,"./util":7,"dataview2":1}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _DataView2$Buffer2 = require("dataview2");

var TWO_TO_THE_32 = Math.pow(2, 32);

var Reader = (function () {
  function Reader(buffer) {
    _classCallCheck(this, Reader);

    this.data = new _DataView2$Buffer2.DataView2(buffer);
    this.index = 0;
  }

  _createClass(Reader, [{
    key: "readUInt8",
    value: function readUInt8() {
      this.index += 1;
      return this.data.getUint8(this.index - 1);
    }
  }, {
    key: "readInt32",
    value: function readInt32() {
      this.index += 4;
      return this.data.getInt32(this.index - 4);
    }
  }, {
    key: "readUInt32",
    value: function readUInt32() {
      this.index += 4;
      return this.data.getUint32(this.index - 4);
    }
  }, {
    key: "readInt64",
    value: function readInt64() {
      var hi = this.readUInt32();
      var lo = this.readUInt32();
      return hi * TWO_TO_THE_32 + lo;
    }
  }, {
    key: "readFloat32",
    value: function readFloat32() {
      this.index += 4;
      return this.data.getFloat32(this.index - 4);
    }
  }, {
    key: "readFloat64",
    value: function readFloat64() {
      this.index += 8;
      return this.data.getFloat64(this.index - 8);
    }
  }, {
    key: "readString",
    value: function readString() {
      var result = "";
      var charCode = undefined;

      while ((charCode = this.readUInt8()) !== 0) {
        result += String.fromCharCode(charCode);
      }
      this.align();

      return result;
    }
  }, {
    key: "readBlob",
    value: function readBlob() {
      var length = this.readUInt32();
      var buffer = new _DataView2$Buffer2.Buffer2(length);
      var view = new _DataView2$Buffer2.DataView2(buffer);

      for (var i = 0; i < length; i++) {
        view.setUint8(i, this.readUInt8());
      }
      this.align();

      return buffer;
    }
  }, {
    key: "hasNext",
    value: function hasNext() {
      return this.index < this.data.byteLength;
    }
  }, {
    key: "align",
    value: function align() {
      while (this.hasNext() && this.index % 4 !== 0 && this.data.getUint8(this.index) === 0) {
        this.index += 1;
      }
    }
  }]);

  return Reader;
})();

exports["default"] = Reader;
module.exports = exports["default"];

},{"dataview2":1}],5:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

var _import = require("./util");

var util = _interopRequireWildcard(_import);

var types = {
  integer: {
    tag: "i",
    size: function size() {
      return 4;
    },
    validate: function validate(value) {
      return (value | 0) === value;
    },
    write: function write(writer, value) {
      writer.writeInt32(value);
    },
    read: function read(reader) {
      return reader.readInt32();
    } },
  float: {
    tag: "f",
    size: function size() {
      return 4;
    },
    validate: function validate(value) {
      return value === value && typeof value === "number";
    },
    write: function write(writer, value) {
      writer.writeFloat32(value);
    },
    read: function read(reader) {
      return reader.readFloat32();
    } },
  string: {
    tag: "s",
    size: function size(value) {
      return util.size4(value.length + 1);
    },
    validate: function validate(value) {
      return typeof value === "string";
    },
    write: function write(writer, value) {
      writer.writeString(value);
    },
    read: function read(reader) {
      return reader.readString();
    } },
  blob: {
    tag: "b",
    size: function size(value) {
      return 4 + util.size4(value.length || value.byteLength);
    },
    validate: function validate(value) {
      return value instanceof ArrayBuffer || value instanceof global.Buffer;
    },
    write: function write(writer, value) {
      writer.writeBlob(value);
    },
    read: function read(reader) {
      return reader.readBlob();
    } },
  timetag: {
    tag: "t",
    size: function size() {
      return 8;
    },
    validate: function validate(value) {
      return typeof value === "number" && isFinite(+value) && Math.floor(value) === value;
    },
    write: function write(writer, value) {
      writer.writeInt64(value);
    },
    read: function read(reader) {
      return reader.readInt64();
    } },
  double: {
    tag: "d",
    size: function size() {
      return 8;
    },
    validate: function validate(value) {
      return value === value && typeof value === "number";
    },
    write: function write(writer, value) {
      writer.writeFloat64(value);
    },
    read: function read(reader) {
      return reader.readFloat64();
    } },
  "true": {
    tag: "T",
    size: function size() {
      return 0;
    },
    validate: function validate(value) {
      return value === true;
    },
    write: function write() {},
    read: function read() {
      return true;
    } },
  "false": {
    tag: "F",
    size: function size() {
      return 0;
    },
    validate: function validate(value) {
      return value === false;
    },
    write: function write() {},
    read: function read() {
      return false;
    } },
  "null": {
    tag: "N",
    size: function size() {
      return 0;
    },
    validate: function validate(value) {
      return value === null;
    },
    write: function write() {},
    read: function read() {
      return null;
    } },
  bang: {
    tag: "I",
    size: function size() {
      return 0;
    },
    validate: function validate(value) {
      return value === "bang";
    },
    write: function write() {},
    read: function read() {
      return "bang";
    } } };

exports.types = types;
var tags = {};

exports.tags = tags;
Object.keys(types).forEach(function (key) {
  tags[types[key].tag] = key;
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./util":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _DataView2 = require("dataview2");

var TWO_TO_THE_32 = Math.pow(2, 32);

var Writer = (function () {
  function Writer(buffer) {
    _classCallCheck(this, Writer);

    this.data = new _DataView2.DataView2(buffer);
    this.index = 0;
  }

  _createClass(Writer, [{
    key: "writeUInt8",
    value: function writeUInt8(value) {
      this.data.setUint8(this.index, value);
      this.index += 1;
    }
  }, {
    key: "writeInt32",
    value: function writeInt32(value) {
      this.data.setInt32(this.index, value);
      this.index += 4;
    }
  }, {
    key: "writeUInt32",
    value: function writeUInt32(value) {
      this.data.setUint32(this.index, value);
      this.index += 4;
    }
  }, {
    key: "writeInt64",
    value: function writeInt64(value) {
      var hi = value / TWO_TO_THE_32 >>> 0;
      var lo = value >>> 0;

      this.data.setUint32(this.index + 0, hi);
      this.data.setUint32(this.index + 4, lo);
      this.index += 8;
    }
  }, {
    key: "writeFloat32",
    value: function writeFloat32(value) {
      this.data.setFloat32(this.index, value);
      this.index += 4;
    }
  }, {
    key: "writeFloat64",
    value: function writeFloat64(value) {
      this.data.setFloat64(this.index, value);
      this.index += 8;
    }
  }, {
    key: "writeString",
    value: function writeString(value) {
      for (var i = 0; i < value.length; i++) {
        this.writeUInt8(value.charCodeAt(i));
      }

      this.writeUInt8(0);
      this.align();
    }
  }, {
    key: "writeBlob",
    value: function writeBlob(value) {
      var view = new _DataView2.DataView2(value);
      var length = view.byteLength;

      this.writeUInt32(length);

      for (var i = 0; i < length; i++) {
        this.writeUInt8(view.getUint8(i));
      }

      this.align();
    }
  }, {
    key: "hasNext",
    value: function hasNext() {
      return this.index < this.data.byteLength;
    }
  }, {
    key: "align",
    value: function align() {
      while (this.index % 4 !== 0) {
        this.data.setUint8(this.index, 0);
        this.index += 1;
      }
    }
  }]);

  return Writer;
})();

exports["default"] = Writer;
module.exports = exports["default"];

},{"dataview2":1}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.size4 = size4;

function size4(num) {
  return Math.ceil((num | 0) / 4) << 2;
}

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _Message = require("./Message");

var _Message2 = _interopRequireDefault(_Message);

exports["default"] = {
  Message: _Message2["default"],
  fromBuffer: function fromBuffer(buffer) {
    return _Message2["default"].fromBuffer(buffer).toObject();
  },
  toBuffer: function toBuffer(obj) {
    return _Message2["default"].fromObject(obj).toBuffer();
  } };
module.exports = exports["default"];

},{"./Message":3}]},{},[8]);

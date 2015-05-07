# osc-msg
[![Build Status](http://img.shields.io/travis/mohayonao/osc-msg.svg?style=flat-square)](https://travis-ci.org/mohayonao/osc-msg)
[![NPM Version](http://img.shields.io/npm/v/osc-msg.svg?style=flat-square)](https://www.npmjs.org/package/osc-msg)
[![Bower](http://img.shields.io/bower/v/osc-msg.svg?style=flat-square)](http://bower.io/search/?q=osc-msg)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> Isomorphic Open Sound Control Utilities

## Features
- Works in both Node.js / io.js and browsers

## Installation

npm:

```
npm install osc-msg
```

bower:

```
bower install osc-msg
```

downloads:

- [osc-msg.js](https://raw.githubusercontent.com/mohayonao/osc-msg/master/build/osc-msg.js)
- [osc-msg.min.js](https://raw.githubusercontent.com/mohayonao/osc-msg/master/build/osc-msg.min.js)

## API

_compatible interfaces with [osc-min](https://github.com/russellmcc/node-osc-min)_
- `OscMsg.fromBuffer(buffer: Buffer|ArrayBuffer): object`
- `OscMsg.toBuffer(obj: object): Buffer|ArrayBuffer`

### OSCMessage
- `constructor([ address: string ], [ args: object[] ])`

##### Class methods
- `fromObject(obj: object): OSCMessage`
- `fromBuffer(buffer: Buffer|ArrayBuffer): OSCMessage`

##### Instance attributes
- `address: string`
- `size: number` _readonly_
- `oscType: string` _readonly_

##### Instance methods
- `add(...values: any): self`
- `clear(): self`
- `clone(): OSCMessage`
- `toObject(): object`
- `toBuffer(): Buffer|ArrayBuffer`

### OSCBundle
- `constructor([ timetag: number ], [ elements: any[] ])`

##### Class methods
- `fromObject(obj: object): OSCBundle`
- `fromBuffer(buffer: Buffer|ArrayBuffer): OSCBundle`

##### Instance attributes
- `timetag: number`
- `size: number` _readonly_
- `oscType: sting` _readonly_

##### Instance methods
- `add(...elements: any): self`
- `clear(): self`
- `clone(): OSCBundle`
- `toObject(): object`
- `toBuffer(): Buffer|ArrayBuffer`

## Examples

#### Build OSCMessage

```js
var msg = new OscMsg.OSCMessage("/foo");

// add float
msg.add({ type: "float", value: 1 });
msg.add(2);

// add integer
msg.add({ type: "integer", value: 3 });

// add string
msg.add({ type: "string", value: "bar" });
msg.add("baz");

// convert to object
msg.toObject();
→ {
  address: "/foo",
  args: [
    { type: "float", value: 1 },
    { type: "float", value: 2 },
    { type: "integer", value: 3 },
    { type: "string", value: "bar" },
    { type: "string", value: "baz" },
  ],
  oscType: "message",
};

// convert to buffer
msg.toBuffer();
→ Buffer|ArrayBuffer
```

#### Build Bundle

```js
var bundle = new OscMsg.OSCBundle(12345);

bundle.add(new OscMsg.OSCMessage("/foo", [ 1, 2, 3 ]));

// convert to object
bundle.toObject();
→ {
  timetag: 12345,
  elements: [
    {
      address: "/foo",
      args: [
        { type: "float", value: 1 },
        { type: "float", value: 2 },
        { type: "float", value: 3 },
      ],
      oscType: "message",
    },
  ],
  oscType: "bundle",
}

// convert to buffer
bundle.toBuffer();
→ Buffer|ArrayBuffer
```

## See also
- [The Open Sound Control 1.0 Specification](http://opensoundcontrol.org/spec-1_0)
- [osc-min / Javascript representations of the OSC types](https://github.com/russellmcc/node-osc-min#javascript-representations-of-the-osc-types)

## License
MIT

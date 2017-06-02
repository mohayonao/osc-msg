# osc-msg
[![Build Status](https://img.shields.io/travis/mohayonao/osc-msg.svg?style=flat-square)](https://travis-ci.org/mohayonao/osc-msg)
[![NPM Version](https://img.shields.io/npm/v/osc-msg.svg?style=flat-square)](https://www.npmjs.org/package/osc-msg)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](https://mohayonao.mit-license.org/)

> OSC message decoder/encoder with fault tolerant

## Features
- Not throw an exception if processing with a broken message
- Useful decoding options, `bundle` and `strip`
- Works in both Node.js and browsers

## Installation

npm:

```
npm install osc-msg
```

## API

- `oscmsg.decode(buffer: Buffer, opts={}): object`
  - `opts.strict`: strictly validation mode
  - `opts.strip`: decode into raw values
  - `opts.bundle`: decode as a bundle
  - aliases: `fromBuffer`, `toObject`
- `oscmsg.encode(object: object, opts={}): Buffer`
  - `opts.strict`: strictly validation mode
  - `opts.integer`: use an integer when auto cast
  - aliases: `fromObject`, `toBuffer`

## Examples

decode

```js
const dgram = require("dgram");
const oscmsg = require("osc-msg");

const socket = dgram.createSocket("udp4");

socket.on("message", (buffer) => {
  const bundle = oscmsg.decode(buffer, { strict: true, strip: true, bundle: true });

  if (bundle.error) {
    return;
  }

  bundle.elements.forEach((message) => {
    console.log(JSON.stringify(message));    
  });
});

socket.bind(RECV_PORT);
```

encode

```js
const dgram = require("dgram");
const oscmsg = require("osc-msg");

const message = {
  address: "/foo",
  args: [
    { type: "integer", value: 0 },
    { type: "float", value: 1.5 }
  ]
};
const buffer = oscmsg.encode(message);
const socket = dgram.createSocket("udp4");

socket.send(buffer, 0, buffer.length, SEND_PORT, "127.0.0.1");
```

## Javascript representations of the OSC types

_compatible interfaces with [osc-min](https://github.com/russellmcc/node-osc-min)_

- OSC Message

```js
{
  "address": string,
  "args": [ arg1, arg2, ...argN ],
  "oscType": "message"
}
```

Where args is an array of OSC Arguments. `oscType` is optional. `args` can be a single element.

- OSC Arguments

```js
{ "type": string, "value": any }
```

Where the `type` is one of the following:

  - `string` - string value
  - `float` - numeric value
  - `integer` - numeric value
  - `blob` - Buffer-like value
  - `true` - value is boolean true
  - `false` - value is boolean false
  - `null` - no value
  - `bang` - no value (this is the `I` type tag)
  - `timetag` - [ uint32, uint32 ]
  - `array` - array of OSC Arguments

- OSC Bundle

```js
{
  "timetag": number,
  "elements": [ element1, element2, ...elementN ],
  "oscType": "bundle"
}
```

Where the timetag is a javascript-native numeric value of the timetag, and elements is an array of either an OSC Bundle or an OSC Message The `oscType` field is optional, but is always returned by api functions.

## See also
- [The Open Sound Control 1.0 Specification](https://opensoundcontrol.org/spec-1_0)
- [osc-min / Javascript representations of the OSC types](https://github.com/russellmcc/node-osc-min#javascript-representations-of-the-osc-types)

## License
MIT

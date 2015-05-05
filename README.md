# osc-msg
[![Build Status](http://img.shields.io/travis/mohayonao/osc-msg.svg?style=flat-square)](https://travis-ci.org/mohayonao/osc-msg)
[![NPM Version](http://img.shields.io/npm/v/osc-msg.svg?style=flat-square)](https://www.npmjs.org/package/osc-msg)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> Isomorphic Open Sound Control Utilities

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
- `constructor(address: string, args: object[])`

##### Class methods
- `.fromObject(obj: object): OSCMessage`
- `.fromBuffer(buffer: Buffer|ArrayBuffer): OSCMessage`

##### Instance attributes
- `#oscType: string` _readonly_
- `#address: string`
- `#types: string` _readonly_
- `#size: number` _readonly_

##### Instance methods
- `#add(...values): self`
- `#clear(): self`
- `#clone(): OSCMessage`
- `#toObject(): object`
- `#toBuffer(): Buffer|ArrayBuffer`

### OSCBundle
- `constructor(timetag: number, elements: object[])`

##### Class methods
- `.fromObject(obj: object): OSCBundle`
- `.fromBuffer(buffer: Buffer|ArrayBuffer): OSCBundle`

##### Instance attributes
- `#oscType: sting` _readonly_
- `#timetag: number`
- `#size: number` _readonly_

##### Instance methods
- `#add(...elements): self`
- `#clear(): self`
- `#clone(): OSCBundle`
- `#toObject(): object`
- `#toBuffer(): Buffer|ArrayBuffer`

## License
MIT

"use strict";

var udp = require("dgram");
var OscMsg = require("../");

function Patch(recvPort, sendPort) {
  this.server = udp.createSocket("udp4");
  this.recvPort = recvPort;
  this.sendPort = sendPort;
  this.timerId = 0;
  this.pattern = [
    [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 ],
    [ 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1 ],
  ];

  this.server.bind(this.recvPort);
  this.server.on("message", function(buffer) {
    var msg = OscMsg.OSCMessage.fromBuffer(buffer);

    if (msg.address === "/osc-msg/change/drum") {
      this.changeDrumPattern();
    }
  }.bind(this));
}

Patch.prototype.start = function() {
  if (this.timerId === 0) {
    var index = 0;
    this.timerId = setInterval(function() {
      for (var i = 0; i < this.pattern.length; i++) {
        if (this.pattern[i][index]) {
          var msg = new OscMsg.OSCMessage("/osc-msg/play/drum");

          msg.add({ type: "integer", value: i });
          msg.add({ type: "integer", value: index });

          var buffer = msg.toBuffer(0);

          this.server.send(buffer, 0, buffer.length, this.sendPort, "localhost");
        }
      }
      index = (index + 1) % this.pattern[0].length;
    }.bind(this), 125);
  }

  return this;
};

Patch.prototype.stop = function() {
  if (this.timerId) {
    clearInterval(this.timerId);
    this.timerId = 0;
  }
  return this;
};

Patch.prototype.changeDrumPattern = function() {
  for (var i = 0; i < 8; i++) {
    var a = (Math.random() * this.pattern.length)|0;
    var b = (Math.random() * this.pattern[a].length)|0;
    var c = (Math.random() * 2)|0;

    this.pattern[a][b] = c;
  }

  return this;
};

module.exports = Patch;

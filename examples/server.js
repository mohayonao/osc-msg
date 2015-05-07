"use strict";

var fs = require("fs");
var express = require("express");
var udp = require("dgram");
var http = require("http");
var socketIO = require("socket.io");
var OscMsg = require("../");
var Patch = require("./patch");

var app = express();
var server = http.createServer(app);
var webSocket = socketIO(server);
var oscServer = udp.createSocket("udp4");

var USE_MAXMSP = true;
var SERVER_PORT = process.argv[2] || 8080;
var OSC_RECV_PORT = 7400;
var OSC_SEND_PORT = 7401;

app.use(express.static(__dirname + "/public"));

/**
 * +------------------+           +--------+          +---------+
 * | Max/MSP          | <- udp -> | Server | <- ws -> | Browser |
 * |   udpsend   7400 |           +--------+          +---------+
 * |   udprecive 7401 |
 * +------------------+
 */

app.get("/osc-msg.js", function(req, res) {
  fs.readFile(__dirname + "/../build/osc-msg.js", function(err, result) {
    res.type("js").send(result);
  });
});

server.listen(SERVER_PORT, function() {
  console.log("Listening on port %d", server.address().port);
});

// connect to a browser
webSocket.on("connection", function(socket) {

  socket.on("osc", function(buffer) {
    oscServer.send(buffer, 0, buffer.length, OSC_SEND_PORT, "localhost");
  });

});

// connect to Max/MSP
oscServer.on("message", function(buffer) {
  webSocket.emit("osc", buffer);
  printOSC(">", buffer);
});

oscServer.bind(OSC_RECV_PORT, function() {
  console.log("Listening on port %d (OSC)", oscServer.address().port);
});

function printOSC(cap, buffer) {
  var msg = OscMsg.fromBuffer(buffer);
  console.log(cap, JSON.stringify(msg));
}

if (!USE_MAXMSP) {
  new Patch(OSC_SEND_PORT, OSC_RECV_PORT).start();
}

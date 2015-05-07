var AudioContext = window.AudioContext || window.webkitAudioContext;

window.fetch = window.fetch || function fetch(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    if (/\.(wav|mp3|ogg|aif)$/.test(url)) {
      xhr.responseType = "arraybuffer";
    }
    xhr.onload = function() {
      resolve({
        arrayBuffer: function() {
          return Promise.resolve(xhr.response);
        }
      });
    };
    xhr.onerror = reject;
    xhr.send();
  });
};

window.onload = function() {
  "use strict";

  var audioContext = new AudioContext();
  var socket = io();
  var clips = [];
  var isPlaying = false;
  var VelocityTable = [ 0.8, 0.3, 0.6, 0.3 ];

  [ "bass.wav", "snare.wav", "hihat.wav" ].forEach(function(path, index) {
    fetch("audio/" + path).then(function(result) {
      return result.arrayBuffer();
    }).then(function(buffer) {
      audioContext.decodeAudioData(buffer, function(buffer) {
        clips[index] = buffer;
      });
    });
  });

  function onOSCReceive(buffer) {
    var osc = OscMsg.fromBuffer(buffer);

    if (osc.address === "/osc-msg/play/drum") {
      var clipId = osc.args[0].value;
      var beat = osc.args[1].value;
      var velocity = VelocityTable[beat % VelocityTable.length];

      play(clips[clipId], velocity);
    }

    console.log(JSON.stringify(osc));
  }

  function play(clip, velocity) {
    if (!(clip instanceof AudioBuffer)) {
      return;
    }

    var buf = audioContext.createBufferSource();
    var amp = audioContext.createGain();

    buf.buffer = clip;
    buf.start(audioContext.currentTime);
    buf.onended = function() {
      buf.stop(audioContext.currentTime);
      buf.disconnect();
      amp.disconnect();
    };
    amp.gain.value = velocity;

    buf.connect(amp);
    amp.connect(audioContext.destination);
  }

  function chore() {
    if (!chore.done) {
      var buf = audioContext.createBufferSource();

      buf.start(audioContext.currentTime);
      buf.stop(audioContext.currentTime);
      buf.connect(audioContext.destination);
      buf.disconnect();

      chore.done = true;
    }
  }

  document.getElementById("start").onclick = function(e) {
    isPlaying = !isPlaying;

    if (isPlaying) {
      chore();
      socket.on("osc", onOSCReceive);
      e.target.style.color = "red";
    } else {
      socket.off("osc", onOSCReceive);
      e.target.style.color = "black";
    }
  };

  document.getElementById("change").onclick = function() {
    var msg = OscMsg.toBuffer({
      address: "/osc-msg/change/drum",
      args: [
        { type: "integer", value: (Math.random() * 16)|0 },
        { type: "integer", value: (Math.random() * 16)|0 },
      ],
    });

    socket.emit("osc", msg);
  };
};

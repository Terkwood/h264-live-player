"use strict";

const util = require('util');
const spawn = require('child_process').spawn;
const merge = require('mout/object/merge');

const EventEmitter = require('events');
const Server = require('./_server');


class RpiServer extends Server {

  constructor(server, opts) {
    super(server, merge({
      fps: 12,
    }, opts));

    this.emitter = new EventEmitter();
  }

  get_streamer() {
    return this.streamer;
  }

  get_feed() {
    var msk = "raspivid -t 0 -o - -w %d -h %d -fps %d";
    var cmd = util.format(msk, this.options.width, this.options.height, this.options.fps);
    console.log(cmd);


    this.streamer = spawn('raspivid', ['-t', '0', '-o', '-', '-w', this.options.width, '-h', this.options.height, '-fps', this.options.fps, '-pf', 'baseline']);
    this.streamer.on("exit", function (code) {
      console.log("Failure", code);
    });
    this.emitter.on('socket-closed', function () {
      console.log("kill streamer");
      this.streamer.kill();
    });
    return this.streamer.stdout;
  }

};



module.exports = RpiServer;

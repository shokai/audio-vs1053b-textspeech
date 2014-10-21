'use strict';

var stream = require('stream');
var request = require('request');
var wifi = require('wifi-cc3000');

module.exports = {
  use: function(audio){
    this.audio = audio;
    return this;
  },
  getAudioStream: function(query){
    return request.get({
      uri: 'http://translate.google.com/translate_tts',
      qs: query,
      headers: {
        'User-Agent': 'Safari/1.0'
      }
    });
  },
  speech: function(text, opts, callback){
    if(typeof opts === 'function'){
      callback = opts;
      opts = {tl: 'ja'};
    }
    if(opts == null) opts = { tl: 'ja' };
    if(!wifi.isConnected()){
      if(typeof callback === 'function') callback('wifi is not connected');
      return;
    }
    opts.q = text;
    var buf = new Buffer(10240);
    var offset = 0;
    var ws = stream.Writable({decodeStrings: false});
    ws._write = function(chunk, enc, next){
      if(chunk.length > buf.length - offset){
        return next(new Error('buffer over'));
      }
      buf.write(chunk, offset, buf.length - offset);
      offset += chunk.length;
      return next();
    };
    var req = this.getAudioStream(opts);
    req.pipe(ws);
    var self = this;
    req.on('end', function(){
      self.audio.play(buf, callback);
    });
  }
};

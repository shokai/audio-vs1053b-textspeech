'use strict';

var stream = require('stream');
var request = require('request');
var wifi = require('wifi-cc3000');

var cache = {
  data: {},
  maxSize: 3,
  size: function(){
    return Object.keys(this.data).length;
  },
  set: function(key,value){
    this.data[key] = {value: value, date: Date.now()};
    this.gc();
    return value;
  },
  get: function(key){
    if(this.data.hasOwnProperty(key)) return this.data[key].value;
    return null;
  },
  gc: function(){
    if(this.maxSize >= this.size()) return;
    var self = this;
    var old_key = Object.keys(this.data).sort(function(a,b){
      return self.data[a].date - self.data[b].date;
    })[0];
    this.data[old_key] = null;
  }
};

module.exports = {
  playing: false,
  use: function(audio){
    this.audio = audio;
    return this;
  },
  setCacheSize: function(size){
    cache.maxSize = size;
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
  speech: function(){
    var self = this;
    var text, opts, callback; // arguments
    var args = Array.prototype.slice.call(arguments);
    if(typeof args[args.length-1] === 'function') callback = args.pop();
    text = args.shift();
    opts = args.shift() || {tl: 'ja'};
    opts.q = text;
    if(this.playing){
      if(callback) callback('playing '+this.playing);
      return;
    }
    var cached_mp3;
    if(cached_mp3 = cache.get(text)){
      this.playing = text;
      this.audio.play(cached_mp3, function(err){
        self.playing = false;
        if(callback) callback(err);
      });
      return;
    }
    if(!wifi.isConnected()){
      if(typeof callback === 'function') callback('wifi is not connected');
      return;
    }

    this.playing = text;
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
    req.on('end', function(){
      cache.set(text, buf);
      self.audio.play(buf, function(err){
        self.playing = false;
        if(callback) callback(err);
      });
    });
  }
};

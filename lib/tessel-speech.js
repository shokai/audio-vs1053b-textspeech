(function() {
  'use strict';
  var request, stream;

  stream = require('stream');

  request = require('request');

  module.exports = {
    use: function(audio) {
      this.audio = audio;
      return this;
    },
    getAudioStream: function(query) {
      return request.get({
        uri: 'http://translate.google.com/translate_tts',
        qs: query,
        headers: {
          'User-Agent': 'Safari/1.0'
        }
      });
    },
    speech: function(text, opts, callback) {
      var buf, offset, req, ws;
      if (opts == null) {
        opts = {
          tl: 'ja'
        };
      }
      if (callback == null) {
        callback = function() {};
      }
      if (typeof opts === 'function') {
        callback = opts;
        opts = {
          tl: 'ja'
        };
      }
      opts.q = text;
      buf = new Buffer(10240);
      offset = 0;
      ws = stream.Writable({
        decodeStrings: false
      });
      ws._write = function(chunk, enc, next) {
        if (chunk.length > buf.length - offset) {
          return next(new Error('buffer over'));
        }
        buf.write(chunk, offset, buf.length - offset);
        offset += chunk.length;
        return next();
      };
      req = getAudioStream(opts);
      req.pipe(ws);
      return req.on('end', function() {
        audio.play(buf);
        return callback();
      });
    }
  };

}).call(this);

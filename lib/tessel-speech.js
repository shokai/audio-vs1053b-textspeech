(function() {
  'use strict';
  var getAudioStream, request, say, stream;

  stream = require('stream');

  request = require('request');

  say = function(text, opts) {
    var req;
    if (opts == null) {
      opts = {};
    }
    opts.q = text;
    return req = getAudioStream(opts);
  };

  getAudioStream = function(query) {
    return request.get({
      uri: 'http://translate.google.com/translate_tts',
      qs: query,
      headers: {
        'User-Agent': 'Safari/1.0'
      }
    });
  };

}).call(this);

'use strict'

stream  = require 'stream'
request = require 'request'

say = (text, opts={}) ->
  opts.q = text
  req = getAudioStream opts


getAudioStream = (query) ->
  return request.get
    uri: 'http://translate.google.com/translate_tts',
    qs: query,
    headers:
      'User-Agent': 'Safari/1.0'


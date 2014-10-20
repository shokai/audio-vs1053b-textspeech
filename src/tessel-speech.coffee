'use strict'

stream  = require 'stream'
request = require 'request'

module.exports =
  use: (@audio) ->
    return @

  getAudioStream: (query) ->
    request.get
      uri: 'http://translate.google.com/translate_tts',
      qs: query,
      headers:
        'User-Agent': 'Safari/1.0'

  speech: (text, opts={tl: 'ja'}) ->
    opts.q = text

    buf = new Buffer 10240
    offset = 0
    ws = stream.Writable {decodeStrings: false}
    ws._write = (chunk, enc, next) ->
      if chunk.length > buf.length - offset
        return next new Error 'buffer over'
      buf.write chunk, offset, buf.length - offset
      offset += chunk.length
      next()

    req = getAudioStream opts
    req.pipe ws
    req.on 'end', ->
      audio.play buf

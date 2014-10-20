fs = require 'fs'
path = require 'path'
textspeech = require(path.resolve()).use(null)

textspeech.getAudioStream
  tl: 'ja'
  q: 'こんにちは'
.pipe fs.createWriteStream 'out.mp3'

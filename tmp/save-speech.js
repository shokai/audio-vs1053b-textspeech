var fs = require('fs');
var path = require('path');
var textspeech = require(path.resolve()).use(null);

textspeech.getAudioStream({
  tl: 'ja',
  q: 'こんにちは'
}).pipe(fs.createWriteStream('out.mp3'));

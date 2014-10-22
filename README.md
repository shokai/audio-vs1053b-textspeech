# audio-vs1053b-textspeech

Text-to-Speech module for [tessel audio module](https://tessel.io/docs/audio), using mp3 from Google translate.

- https://github.com/shokai/audio-vs1053b-textspeech
- https://npmjs.org/package/audio-vs1053b-textspeech


## Usage

```javascript
var audio = require('audio-vs1053b').use(tessel.port['A']);
var textspeech = require('audio-vs1053b-textspeech').use(audio);

audio.on('ready', function(){
  audio.setVolume(20, function(err){
    console.log('audio setup');
  });
});
```

```javascript
textspeech.speech('こんにちは'); // japanese
textspeech.speech('hello world', {tl: 'en'}); // english
```

set mp3 data cache size
```javascript
textspeech.setCacheSize(5); // default is 3
```

## Sample

    % npm install


    % tessel run sample.js
    # or
    % npm test


Contributing
------------
1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

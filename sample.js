var tessel = require('tessel');
var audio = require('audio-vs1053b').use(tessel.port['A']);

// var textspeech = require('audio-vs1053b-textspeech').use(audio);
var textspeech = require('./').use(audio);

var led_green = tessel.led[0].output(1);
setInterval(function(){
  led_green.toggle();
}, 200);

audio.on('ready', function(){
  console.log('audio ready');
  audio.setVolume(20, function(err){
    if(err) return console.error(err);
    audio.emit('ready:volume');
  });
});

audio.on('ready:volume', function(){
  console.log('audio ready:volume');
  if(err){
    console.error(err);
    return;
  }
  setInterval(function(){
    textspeech.speech('hello world', {tl: 'en'}, function(err){
      if(err) console.error(err);
      else console.log('done');
    });
  }, 30*1000);
});

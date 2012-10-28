define(['model','underscore'], function(model, _){
  
  if(window.webkitAudioContext){
    var context = new webkitAudioContext();

    function makeVoice(frequency, period){
      var osc = context.createOscillator();
      osc.frequency.value = frequency;
      var oscGain = context.createGainNode();
      osc.connect(oscGain);
      oscGain.connect(context.destination);
      oscGain.gain.value = 0;
      osc.noteOn(0);
      return {
        gain: oscGain,
        frequency: frequency,
        period: period,
        noteTime: 0,
        on: false
      };
    }

    var voices = [
      makeVoice(100, 1),
      makeVoice(200, 1/2),
      makeVoice(400, 1/4),
      makeVoice(800, 1/8),
    ];

    //model.on('change', function(){
    //  _(voices).each(function(voice){
    //    voice.on = false;
    //  });
    //  _(model.touches()).each(function(touch){
    //    touchGridX = Math.floor(touch.x * 4);
    //    voices[touchGridX].on = true;
    //  });
    //});

    var noteTime = 0;
    var latency = 7/1000;// in seconds
    /*var oldTime, newTime, timeDiff, i = 0;*/
    function schedule(){
      /*
      Avg time diff is 5 ms.
      newTime = Date.now();
      timeDiff = newTime - oldTime;
      oldTime = newTime;
      if(i++ % 50 == 0)
        console.log('timeDiff = '+timeDiff);
      */
      _.each(voices, function(voice){
        var volume = 1/4 * Math.random();// (voice.on ? 1 : 0);
        var oscGain = voice.gain;
        var period = voice.period;
        while (voice.noteTime < context.currentTime + latency) {
          oscGain.gain.linearRampToValueAtTime(volume, voice.noteTime+0.001);
          oscGain.gain.linearRampToValueAtTime(0, voice.noteTime+period/2);
          oscGain.gain.linearRampToValueAtTime(0, voice.noteTime+period);
          voice.noteTime += period;
        }
      });
      setTimeout(schedule, 0);
    }
    schedule();
  }
});

define(['model'], function(model){
 
  var frequency = 100;
  var period = 1/4; // in Seconds
  
  var touchIsDown = false;
  model.on('change', function(){
    touchIsDown = model.touches().length != 0;
  });
  
  if(window.webkitAudioContext){
    var context = new webkitAudioContext();
    var osc = context.createOscillator();
    var oscGain = context.createGainNode();
    osc.connect(oscGain);
    oscGain.connect(context.destination);
    oscGain.gain.value = 0;
    osc.noteOn(0);
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
      
      var volume = (touchIsDown ? 1 : 0);
      while (noteTime < context.currentTime + latency) {
        osc.frequency.setValueAtTime(frequency, noteTime);
        oscGain.gain.linearRampToValueAtTime(volume, noteTime+0.001);
        oscGain.gain.linearRampToValueAtTime(0, noteTime+period/2);
        oscGain.gain.linearRampToValueAtTime(0, noteTime+period);
        noteTime += period;
      }
      setTimeout(schedule, 0);
    }
    schedule();
  }
});

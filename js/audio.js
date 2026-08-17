window.OceanAudio = (()=>{
  let ctx=null;
  const Ctx=window.AudioContext||window.webkitAudioContext;
  function ac(){ if(!Ctx)return null; if(!ctx)ctx=new Ctx(); if(ctx.state==='suspended')ctx.resume(); return ctx; }
  function enabled(){return OceanStore.get().settings.sound!==false;}
  function tone(freq=440,dur=.12,type='sine',gain=.08,delay=0){
    if(!enabled())return; const c=ac(); if(!c)return;
    const o=c.createOscillator(), g=c.createGain(); o.type=type; o.frequency.value=freq;
    const t=c.currentTime+delay; g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(gain,t+.015); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+dur+.03);
  }
  function click(){tone(620,.055,'sine',.035);}
  function start(){[330,440,660].forEach((f,i)=>tone(f,.12,'triangle',.06,i*.09));}
  function complete(){[523,659,784,1046].forEach((f,i)=>tone(f,.18,'sine',.07,i*.08));}
  function level(){[392,523,659,784,988].forEach((f,i)=>tone(f,.2,'triangle',.07,i*.07));}
  function pearl(){[880,1174].forEach((f,i)=>tone(f,.12,'sine',.05,i*.06));}
  function splash(){tone(130,.16,'sine',.07); tone(220,.1,'triangle',.04,.05);}
  function bite(){tone(740,.06,'square',.035);tone(940,.08,'square',.03,.07);}
  function catchFish(){[440,660,880].forEach((f,i)=>tone(f,.13,'triangle',.06,i*.07));}
  function fail(){tone(220,.15,'sawtooth',.035);tone(180,.18,'sine',.035,.08);}
  function countdown(n){tone(n===0?900:500,.08,'square',.03);}
  function speak(text){
    if(!OceanStore.get().settings.voice || !('speechSynthesis' in window))return;
    speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text);u.lang='ja-JP';u.rate=1.0;u.pitch=1.15;speechSynthesis.speak(u);
  }
  return {click,start,complete,level,pearl,splash,bite,catchFish,fail,countdown,speak};
})();

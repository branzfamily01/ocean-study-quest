window.OceanStore = (() => {
  const OLD_KEYS = {
    xp:'ocean-xp-v4', active:'ocean-active-v4', log:'ocean-log-v4', tasks:'ocean-tasks-v4', settings:'ocean-settings-v4'
  };
  const KEY='ocean-study-quest-v1';
  const today=()=>{
    const d=new Date();
    const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  };
  const parse=(k, fallback)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):fallback; }catch{return fallback;} };
  const oldXp=parse(OLD_KEYS.xp,null);
  const oldActive=parse(OLD_KEYS.active,null);
  const oldLog=parse(OLD_KEYS.log,null);
  const oldTasks=parse(OLD_KEYS.tasks,null);
  const oldSettings=parse(OLD_KEYS.settings,null);

  function defaults(){
    const xp=Object.fromEntries(OceanData.CREATURES.map(c=>[c.id,0]));
    return {
      version:1,
      xp: oldXp || xp,
      active: oldActive || 'jellyfish',
      logs: oldLog || {},
      tasks: oldTasks || {},
      settings: {
        subjects:[
          {id:'math',name:'算数',duration:20,enabled:true},
          {id:'japanese',name:'国語',duration:20,enabled:true},
          {id:'english',name:'英語',duration:15,enabled:false}
        ],
        pin:'1234', sound:true, voice:false, ambient:false, reduceMotion:false,
        ...(oldSettings?{...(Array.isArray(oldSettings.subjects)?{subjects:oldSettings.subjects}:{}),pin:oldSettings.parentPassword||'1234'}:{})
      },
      game:{coins:80,pearls:0,bait:2,raceEnergy:1,fishDex:{},catches:[],coral:0,dailyKey:'',dailyClaimed:false},
      reflections:{},
      achievements:[],
      lastScreen:'home'
    };
  }

  let state={...defaults(), ...parse(KEY,{})};
  state.xp={...defaults().xp,...(state.xp||{})};
  state.settings={...defaults().settings,...(state.settings||{})};
  state.game={...defaults().game,...(state.game||{})};
  state.tasks=state.tasks||{}; state.logs=state.logs||{}; state.reflections=state.reflections||{};

  function save(){
    localStorage.setItem(KEY,JSON.stringify(state));
    localStorage.setItem(OLD_KEYS.xp,JSON.stringify(state.xp));
    localStorage.setItem(OLD_KEYS.active,JSON.stringify(state.active));
    localStorage.setItem(OLD_KEYS.log,JSON.stringify(state.logs));
    localStorage.setItem(OLD_KEYS.tasks,JSON.stringify(state.tasks));
    localStorage.setItem(OLD_KEYS.settings,JSON.stringify({subjects:state.settings.subjects,parentPassword:state.settings.pin}));
  }
  function get(){ return state; }
  function set(mutator){
    const next=typeof mutator==='function'?mutator(structuredClone(state)):mutator;
    if(next) state=next;
    save();
    window.dispatchEvent(new CustomEvent('ocean:state',{detail:state}));
    return state;
  }
  function update(path,value){
    return set(s=>{
      let o=s; const parts=path.split('.');
      parts.slice(0,-1).forEach(p=>o=o[p]);
      o[parts.at(-1)]=typeof value==='function'?value(o[parts.at(-1)]):value;
      return s;
    });
  }
  function addTask(date,task){
    set(s=>{ if(!s.tasks[date])s.tasks[date]=[]; s.tasks[date].push(task); return s; });
  }
  function backup(){ return JSON.stringify(state,null,2); }
  function restore(json){
    const obj=typeof json==='string'?JSON.parse(json):json;
    if(!obj || typeof obj!=='object' || !obj.xp) throw new Error('バックアップ形式が正しくありません');
    state={...defaults(),...obj}; save(); window.dispatchEvent(new CustomEvent('ocean:state',{detail:state}));
  }
  function resetGameOnly(){ set(s=>{s.game=defaults().game; return s;}); }
  save();
  return {KEY,get,set,update,save,today,addTask,backup,restore,resetGameOnly};
})();

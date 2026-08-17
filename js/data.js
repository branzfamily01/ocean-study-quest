window.OceanData = (() => {
  const LEVEL_NAMES = ['たまご','あかちゃん','こども','わかもの','おとな','レジェンド'];
  const XP_PER_LEVEL = 100;
  const SUBJECTS = ['国語','算数','理科','社会','英語','その他'];
  const MODES = ['インプット','問題を解く','お直し','暗記','音読','その他'];
  const GROWTH_SPRITES = {
    jellyfish:{url:'assets/growth/growth-atlas-a.webp?v=10',row:0},
    starfish:{url:'assets/growth/growth-atlas-a.webp?v=10',row:1},
    turtle:{url:'assets/growth/growth-atlas-a.webp?v=10',row:2},
    dolphin:{url:'assets/growth/growth-atlas-a.webp?v=10',row:3},
    seahorse:{url:'assets/growth/growth-atlas-a.webp?v=10',row:4},
    crab:{url:'assets/growth/growth-atlas-b.webp?v=10',row:0},
    whale:{url:'assets/growth/growth-atlas-b.webp?v=10',row:1},
    octopus:{url:'assets/growth/growth-atlas-b.webp?v=10',row:2},
    clownfish:{url:'assets/growth/growth-atlas-b.webp?v=10',row:3},
    anglerfish:{url:'assets/growth/growth-atlas-b.webp?v=10',row:4}
  };
  const CREATURES = [
    {id:'jellyfish',name:'クラゲのルミィ',short:'ルミィ',color:'#c5a7ff',accent:'#7c4dff',element:'水',description:'ふわふわ漂う神秘のこ'},
    {id:'starfish',name:'ヒトデのステラ',short:'ステラ',color:'#ffd080',accent:'#ff7a45',element:'光',description:'キラキラ輝く海の星'},
    {id:'turtle',name:'カメのテトラ',short:'テトラ',color:'#a8e4a8',accent:'#2e9b61',element:'地',description:'ゆっくりでも確実に進む'},
    {id:'dolphin',name:'イルカのドルフ',short:'ドルフ',color:'#91d9ff',accent:'#2a88e8',element:'風',description:'元気いっぱいの海の旅人'},
    {id:'seahorse',name:'タツノオトシゴのシグ',short:'シグ',color:'#ffacd4',accent:'#c23e8b',element:'夢',description:'不思議でかわいい海の生き物'},
    {id:'crab',name:'カニのクラブ',short:'クラブ',color:'#ff9d91',accent:'#d94132',element:'炎',description:'かっこよくてたくましい'},
    {id:'whale',name:'クジラのホエール',short:'ホエール',color:'#86b3ff',accent:'#3759cc',element:'深',description:'深海を知るおおきなこ'},
    {id:'octopus',name:'タコのオクト',short:'オクト',color:'#d9a1ff',accent:'#8d44cf',element:'謎',description:'頭がよくて変幻自在'},
    {id:'clownfish',name:'カクレクマノミのコーラル',short:'コーラル',color:'#ffb05b',accent:'#ef6c24',element:'勇',description:'どこまでも前に進む勇者'},
    {id:'anglerfish',name:'チョウチンアンコウのアン',short:'アン',color:'#aab9d8',accent:'#58637c',element:'闇',description:'深い海を照らす光'}
  ].map(c => ({...c, stages:(window.CREATURE_IMAGE_DATA?.[c.id]?.stages||[]),adult:(window.CREATURE_IMAGE_DATA?.[c.id]?.adult||''),sprite:GROWTH_SPRITES[c.id]||null}));

  const FISH = [
    {id:'sardine',name:'キラキライワシ',emoji:'🐟',rarity:1,coins:20,color:'#9bd6f4'},
    {id:'clownfish',name:'カクレクマノミ',emoji:'🐠',rarity:1,coins:25,color:'#ff9f43'},
    {id:'puffer',name:'ぷくぷくフグ',emoji:'🐡',rarity:2,coins:40,color:'#f7d774'},
    {id:'squid',name:'スミイカ',emoji:'🦑',rarity:2,coins:45,color:'#c59af2'},
    {id:'seahorse',name:'タツノオトシゴ',emoji:'🪸',rarity:3,coins:70,color:'#f8a7c7'},
    {id:'tuna',name:'ブルーツナ',emoji:'🐟',rarity:3,coins:80,color:'#4f86d9'},
    {id:'ray',name:'ムーンレイ',emoji:'◇',rarity:4,coins:130,color:'#7ac4d6'},
    {id:'sunfish',name:'オーシャンマンボウ',emoji:'🐟',rarity:4,coins:150,color:'#8aa6be'},
    {id:'goldfish',name:'ゴールデンフィッシュ',emoji:'🐠',rarity:5,coins:250,color:'#ffd34e'},
    {id:'whaleshark',name:'スター・ジンベエ',emoji:'🐋',rarity:5,coins:320,color:'#5aa3d8'},
  ];

  const RACE_OPPONENTS = [
    {name:'サクラ',icon:'🐬',pace:.90},
    {name:'リン',icon:'🐢',pace:.78},
    {name:'ハルト',icon:'🐠',pace:.84},
    {name:'ソラ',icon:'🪼',pace:.72}
  ];

  const MOTIVATE = [
    ['🌊','ふかいうみのそこへ…','教科書や教材をつくえに出そう'],
    ['✏️','相棒が待ってる！','えんぴつとノートを用意しよう'],
    ['💨','ちからをためて…','すわって、すーっとひといき'],
    ['🚀','さあ、潜水開始！','今日も一緒に進もう！']
  ];
  const MISTAKE_MSGS = [
    'まちがいは宝物！直した分だけ強くなる！',
    '直した問題は、もう一度会っても怖くない！',
    'まちがいを見つけた＝成長ポイント発見！',
    '逃げずに直したのがいちばんえらい！',
    '直した数だけ海に真珠が増えるよ！'
  ];

  function levelInfo(xp=0){
    const raw=Math.floor(xp/XP_PER_LEVEL);
    const level=Math.min(raw,LEVEL_NAMES.length-1);
    const progress=level>=LEVEL_NAMES.length-1?1:(xp%XP_PER_LEVEL)/XP_PER_LEVEL;
    return {level,visualStage:Math.min(level,4),name:LEVEL_NAMES[level],progress,next:level>=5?0:XP_PER_LEVEL-(xp%XP_PER_LEVEL)};
  }

  return {LEVEL_NAMES,XP_PER_LEVEL,SUBJECTS,MODES,CREATURES,FISH,RACE_OPPONENTS,MOTIVATE,MISTAKE_MSGS,levelInfo};
})();

'use strict';

const gameCanvas = document.getElementById('game');
const g = gameCanvas.getContext('2d');
const buildCanvas = document.getElementById('buildCanvas');
const bg = buildCanvas.getContext('2d');
const mapCanvas = document.getElementById('mapCanvas');
const mg = mapCanvas.getContext('2d');

const dungeonGraph = new Map([
  [
    'Room1',
    [
      { node: 'Room2', w: 2 },
      { node: 'Room3', w: 5 },
    ],
  ],
  [
    'Room2',
    [
      { node: 'Room1', w: 2 },
      { node: 'Room4', w: 3 },
      { node: 'Room5', w: 4 },
    ],
  ],
  [
    'Room3',
    [
      { node: 'Room1', w: 5 },
      { node: 'Room5', w: 1 },
    ],
  ],
  [
    'Room4',
    [
      { node: 'Room2', w: 3 },
      { node: 'Room6', w: 2 },
    ],
  ],
  [
    'Room5',
    [
      { node: 'Room2', w: 4 },
      { node: 'Room3', w: 1 },
      { node: 'Room6', w: 3 },
    ],
  ],
  [
    'Room6',
    [
      { node: 'Room4', w: 2 },
      { node: 'Room5', w: 3 },
    ],
  ],
]);
const buildGraph = new Map([
  ['Head', []],
  ['RArm', []],
  ['LArm', []],
  ['RHand', []],
  ['LHand', []],
  ['Chest', []],
  ['Legs', []],
]);

const SLOT_NAMES = ['Head', 'RArm', 'LArm', 'RHand', 'LHand', 'Chest', 'Legs'];
const slotLabel = { Head: 'Head', RArm: 'R.Arm', LArm: 'L.Arm', RHand: 'R.Hand', LHand: 'L.Hand', Chest: 'Chest', Legs: 'Legs' };
const slotEs = { Head: 'Cabeza', RArm: 'Brazo D.', LArm: 'Brazo I.', RHand: 'Mano D.', LHand: 'Mano I.', Chest: 'Pecho', Legs: 'Piernas' };
const roomEs = { Room1: 'Cripta', Room2: 'Umbral', Room3: 'Osario', Room4: 'Forja', Room5: 'Abismo', Room6: 'Trono' };
const partEs = {
  'Bone Arm': 'Brazo Oseo',
  Skull: 'Craneo',
  'Dagger Hand': 'Mano Daga',
  'Goblin Legs': 'Piernas Goblin',
  'Demon Claw': 'Garra Demoniaca',
  'Demon Core': 'Nucleo Demoniaco',
  'Stone Fist': 'Puno de Piedra',
  'Golem Heart': 'Corazon de Golem',
  'Crown of Conquest': 'Corona de Conquista',
  'Kingbreaker Relic': 'Reliquia Rompereyes',
  'Root Mask': 'Mascara de Raiz',
  'Mist Tabi': 'Tabi de Niebla',
  'Blood Seal': 'Sello de Sangre',
  'Void Crown': 'Corona del Vacio',
};
const enemyEs = {
  'SKELETON GRUNT': 'ESQUELETO RASO',
  'GOBLIN SCOUT': 'EXPLORADOR GOBLIN',
  'DEMON BRUTE': 'BRUTO DEMONIACO',
  'GOLEM KING': 'REY GOLEM',
};
const roomPos = {
  Room1: { x: 120, y: 145 },
  Room2: { x: 330, y: 120 },
  Room3: { x: 190, y: 330 },
  Room4: { x: 560, y: 130 },
  Room5: { x: 390, y: 345 },
  Room6: { x: 650, y: 305 },
};
const roomLayers = { Room1: 0, Room2: 54, Room3: 22, Room4: 82, Room5: 38, Room6: 106 };
const topDownRooms = {
  Room1: { x: 0.38, y: 0.82 },
  Room2: { x: 0.28, y: 0.62 },
  Room3: { x: 0.5, y: 0.58 },
  Room4: { x: 0.68, y: 0.7 },
  Room5: { x: 0.6, y: 0.38 },
  Room6: { x: 0.54, y: 0.18 },
};
const topDownWalkAreas = [
  [0.18, 0.7, 0.62, 0.84],
  [0.22, 0.52, 0.7, 0.76],
  [0.28, 0.38, 0.67, 0.58],
  [0.43, 0.26, 0.76, 0.45],
  [0.49, 0.1, 0.68, 0.29],
  [0.13, 0.37, 0.41, 0.64],
  [0.62, 0.4, 0.82, 0.8],
  [0.07, 0.45, 0.27, 0.62],
  [0.74, 0.5, 0.93, 0.7],
  [0.27, 0.18, 0.56, 0.41],
  [0.38, 0.65, 0.59, 0.82],
  [0.53, 0.7, 0.77, 0.86],
  [0.34, 0.42, 0.8, 0.72],
];
const partTemplates = {
  'Bone Arm': { slot: 'LArm', stats: { atk: 2 }, edges: [['LArm', 'Chest']], color: '#e8e0d0' },
  Skull: { slot: 'Head', stats: { def: 1 }, edges: [['Head', 'Chest']], color: '#e8e0d0' },
  'Dagger Hand': {
    slot: 'RHand',
    stats: { atk: 4, spd: -1 },
    edges: [
      ['RHand', 'RArm'],
      ['RHand', 'Head'],
    ],
    color: '#b8ffda',
  },
  'Goblin Legs': { slot: 'Legs', stats: { spd: 3 }, edges: [['Legs', 'Chest']], color: '#00ff88' },
  'Demon Claw': {
    slot: 'RHand',
    stats: { atk: 7, def: -2 },
    edges: [
      ['RHand', 'RArm'],
      ['RHand', 'Head'],
    ],
    color: '#ff2b2b',
  },
  'Demon Core': {
    slot: 'Chest',
    stats: { hp: 20 },
    edges: [
      ['Chest', 'Head'],
      ['Chest', 'Legs'],
      ['Chest', 'LArm'],
    ],
    color: '#8b0000',
  },
  'Stone Fist': {
    slot: 'LHand',
    stats: { atk: 10 },
    edges: [
      ['LHand', 'LArm'],
      ['LHand', 'Chest'],
    ],
    color: '#b6b6a8',
  },
  'Golem Heart': {
    slot: 'Chest',
    stats: { hp: 40, def: 5 },
    edges: [
      ['Chest', 'Head'],
      ['Chest', 'Legs'],
      ['Chest', 'RArm'],
      ['Chest', 'LArm'],
    ],
    color: '#ffd700',
  },
  'Crown of Conquest': {
    slot: 'Head',
    stats: { hp: 3, atk: 3, def: 3, spd: 3 },
    edges: [
      ['Head', 'Chest'],
      ['Head', 'RArm'],
      ['Head', 'LArm'],
    ],
    color: '#ffd700',
  },
  'Kingbreaker Relic': {
    slot: 'Chest',
    stats: { hp: 70, atk: 18, def: 8, spd: 10 },
    edges: [
      ['Chest', 'Head'],
      ['Chest', 'Legs'],
      ['Chest', 'RArm'],
      ['Chest', 'LArm'],
      ['Head', 'RHand'],
    ],
    color: '#ffef6e',
  },
  'Root Mask': {
    slot: 'Head',
    stats: { hp: 12, def: 2 },
    edges: [
      ['Head', 'Chest'],
      ['Head', 'LArm'],
    ],
    color: '#9fd968',
  },
  'Mist Tabi': {
    slot: 'Legs',
    stats: { spd: 10, def: 1 },
    edges: [
      ['Legs', 'Chest'],
      ['Legs', 'RArm'],
    ],
    color: '#b8ffda',
  },
  'Blood Seal': {
    slot: 'RHand',
    stats: { atk: 10, hp: 10 },
    edges: [
      ['RHand', 'RArm'],
      ['RHand', 'Head'],
      ['RHand', 'Legs'],
    ],
    color: '#ff3d3d',
  },
  'Void Crown': {
    slot: 'Head',
    stats: { hp: 30, atk: 12, def: 6, spd: 6 },
    edges: [
      ['Head', 'Chest'],
      ['Head', 'RArm'],
      ['Head', 'LArm'],
      ['Chest', 'Legs'],
    ],
    color: '#ffd700',
  },
};
const enemyTypes = [
  { name: 'SKELETON GRUNT', hp: 18, atk: 5, speed: 38, color: '#e8e0d0', drops: ['Bone Arm', 'Skull'] },
  { name: 'GOBLIN SCOUT', hp: 14, atk: 4, speed: 58, color: '#00ff88', drops: ['Dagger Hand', 'Goblin Legs'] },
  { name: 'DEMON BRUTE', hp: 34, atk: 9, speed: 28, color: '#8b0000', drops: ['Demon Claw', 'Demon Core'] },
];
const levels = [
  {
    name: 'Bosque Hundido',
    bossName: 'Garven',
    bossTitle: 'el Guardián de los Brazos de Raíz',
    reward: 'Root Mask',
    sideReward: 'Bone Arm',
    minions: 3,
    hp: 70,
    atk: 10,
    speed: 58,
    sky: ['#c9dee0', '#7fa6a8', '#26444f', '#071014'],
    accent: '#9fd968',
    music: 'assets/level1-music.mp3',
    bossMusic: 'assets/level1-boss-music.mp3',
  },
  {
    name: 'Templo de Niebla',
    bossName: 'Brakka',
    bossTitle: 'la Bestia de Hierro',
    reward: 'Mist Tabi',
    sideReward: 'Dagger Hand',
    minions: 4,
    hp: 115,
    atk: 14,
    speed: 32,
    sky: ['#d6d9e3', '#8d9aaa', '#414a64', '#090b16'],
    accent: '#b8ffda',
    music: 'assets/level2-music.mp3',
  },
  {
    name: 'Forja Sangrienta',
    bossName: 'Lyra',
    bossTitle: 'la Dama del Rostro Fragmentado',
    reward: 'Blood Seal',
    sideReward: 'Demon Core',
    minions: 5,
    hp: 165,
    atk: 19,
    speed: 35,
    sky: ['#d9b8a1', '#8a4a3a', '#33151b', '#080407'],
    accent: '#ff3d3d',
    music: 'assets/level3-music.mp3',
  },
  {
    name: 'Trono del Vacio',
    bossName: 'Auren',
    bossTitle: 'el Guardián del Pecho',
    reward: 'Void Crown',
    sideReward: 'Golem Heart',
    minions: 6,
    hp: 235,
    atk: 25,
    speed: 42,
    sky: ['#c8c5da', '#71668f', '#211c36', '#030307'],
    accent: '#ffd700',
    music: 'assets/level4-music.mp3',
  },
];

const bossDialogues = {
  1: {
    pre: [
      { speaker: 'Garven', text: 'Así que por fin enviaron a su perro.' },
      { speaker: 'Kael', text: 'No soy perro de nadie. Vine a terminar con tu corrupción.' },
      {
        speaker: 'Garven',
        text: '¿Corrupción? Mira a tu alrededor. Este bosque no está muriendo por mí. Está muriendo por los que te dieron esa espada.',
      },
      { speaker: 'Kael', text: 'Mentira. El Consejo dijo que tú devoraste estas tierras.' },
      { speaker: 'Garven', text: 'El Consejo también dijo que no recordarías nada, ¿verdad?' },
      { speaker: 'Kael', text: 'Cállate.' },
      { speaker: 'Garven', text: 'Entonces pelea. Pero cuando tomes mi fuerza, también tomarás mi memoria.' },
    ],
    defeat: [
      { speaker: 'Garven', text: 'No sientes victoria… porque algo dentro de ti sabe que esto está mal.' },
      { speaker: 'Kael', text: 'Dime qué sabes.' },
      { speaker: 'Garven', text: 'No… lo verás.' },
      { speaker: 'Kael', text: '¿Qué me hiciste?' },
      { speaker: 'Garven', text: 'No te hice nada. Solo te devolví una grieta de lo que te quitaron.' },
      {
        speaker: 'Memoria de Garven',
        text: 'Veo llamas. Soldados con emblemas dorados. El bosque arde mientras Garven protege a niños escondidos entre las raíces. Una figura con la misma espada de Kael camina entre el humo.',
      },
      { speaker: 'Voz de Garven', text: 'Yo no ataqué primero. Yo resistí.' },
      { speaker: 'Kael', text: 'No… eso no puede ser verdad.' },
    ],
    combat: [],
  },
  2: {
    pre: [
      { speaker: 'Brakka', text: 'Vienes con el brazo de Garven. Entonces ya empezaste a recordar.' },
      { speaker: 'Kael', text: 'Recuerdo mentiras. Visiones rotas.' },
      { speaker: 'Brakka', text: 'Las memorias no mienten. Solo duelen.' },
      { speaker: 'Kael', text: 'Tú esclavizaste esta mina.' },
      { speaker: 'Brakka', text: 'Yo la cerré para que nadie más sacara el mineral que alimenta las armas del Consejo.' },
      { speaker: 'Kael', text: 'El Consejo protege a la gente.' },
      { speaker: 'Brakka', text: 'No. El Consejo necesita enemigos para que la gente les tema menos a ellos.' },
      { speaker: 'Kael', text: 'No voy a escucharte.' },
      { speaker: 'Brakka', text: 'Claro que no. Por eso te eligieron.' },
    ],
    defeat: [
      { speaker: 'Brakka', text: 'Toma mis piernas, cazador. Corre con ellas. Huye de la verdad, si todavía puedes.' },
      { speaker: 'Kael', text: '¿Por qué todos dicen lo mismo?' },
      { speaker: 'Brakka', text: 'Porque todos vimos tu rostro antes de morir.' },
      {
        speaker: 'Memoria de Brakka',
        text: 'Kael ve la mina antes de la guerra. Obreros, familias, niños jugando cerca de los túneles. Luego llegan soldados del Consejo. Brakka se interpone para cerrar las puertas. Entre los soldados hay una sombra armada con la espada de Kael.',
      },
      { speaker: 'Voz de Brakka', text: 'No eras libre. Pero aun así fuiste tú quien abrió el camino.' },
      { speaker: 'Kael', text: 'Yo… no recuerdo haber estado aquí.' },
      { speaker: 'Voz desconocida', text: 'Porque recordar te habría hecho inútil.' },
    ],
    combat: ['¡Cada golpe tuyo suena igual que los martillos que destruyeron mi hogar!', '¡Basta!', 'No huyas de lo que eres.'],
  },
  3: {
    pre: [
      { speaker: 'Lyra', text: 'Has llegado más lejos de lo que esperaban.' },
      { speaker: 'Kael', text: '¿Tú también vas a decirme que soy un monstruo?' },
      { speaker: 'Lyra', text: 'No. Un monstruo elige. Tú fuiste vaciado.' },
      { speaker: 'Kael', text: 'Entonces dime quién soy.' },
      { speaker: 'Lyra', text: 'Eras el primer guardián. El que debía protegernos.' },
      { speaker: 'Kael', text: 'No…' },
      { speaker: 'Lyra', text: 'El Consejo no te creó para salvar el mundo. Te rompió para usar tu cuerpo como llave.' },
      { speaker: 'Kael', text: '¿Llave de qué?' },
      { speaker: 'Lyra', text: 'De nosotros. De nuestras fortalezas. De nuestras defensas. Nadie podía entrar… excepto tú.' },
      { speaker: 'Kael', text: '¡Eso no es verdad!' },
      { speaker: 'Lyra', text: 'Entonces pelea conmigo. Y cuando tomes mi rostro, mira bien el tuyo.' },
    ],
    defeat: [
      { speaker: 'Lyra', text: 'No te odio, Kael.' },
      { speaker: 'Kael', text: 'Deberías.' },
      { speaker: 'Lyra', text: 'Tal vez. Pero el odio fue la cadena que te pusieron. No seré yo quien la cierre.' },
      { speaker: 'Kael', text: '¿Quién me hizo esto?' },
      { speaker: 'Lyra', text: 'El último guardián tiene tu respuesta… y tu corazón.' },
      {
        speaker: 'Memoria de Lyra',
        text: 'Kael se ve a sí mismo antes de la transformación. No era un cazador, era un protector. Se arrodilla frente a varios guardianes. Promete defenderlos. Luego el Consejo lo captura, borra sus recuerdos y le coloca una marca en el pecho.',
      },
      { speaker: 'Kael', text: 'Yo los protegía…' },
      { speaker: 'Voz del Consejo', text: 'Un guardián roto es más útil que un enemigo muerto.' },
    ],
    combat: [
      'Cada parte que robas no te vuelve completo. Te vuelve más parecido a lo que ellos querían.',
      '¡Yo decido quién soy!',
      'Entonces empieza decidiendo no obedecer.',
    ],
  },
  4: {
    pre: [
      { speaker: 'Auren', text: 'Llegaste, hermano.' },
      { speaker: 'Kael', text: 'No me llames así.' },
      { speaker: 'Auren', text: 'Eso eras antes de que te arrancaran los recuerdos.' },
      { speaker: 'Kael', text: 'Todos dicen que fui uno de ustedes.' },
      { speaker: 'Auren', text: 'No uno de nosotros. El mejor de nosotros.' },
      { speaker: 'Kael', text: 'Entonces, ¿por qué no me salvaste?' },
      {
        speaker: 'Auren',
        text: 'Lo intenté. Todos lo intentamos. Pero el Consejo entendió algo cruel: no necesitaban vencerte. Solo necesitaban convencerte de que los demás éramos tus enemigos.',
      },
      { speaker: 'Kael', text: 'He matado a Garven. A Brakka. A Lyra…' },
      { speaker: 'Auren', text: 'Y con cada uno recuperaste una parte de ti.' },
      { speaker: 'Kael', text: 'No. Con cada uno me volví más vacío.' },
      { speaker: 'Auren', text: 'Porque todavía te falta esto.' },
      { speaker: 'Kael', text: 'Tu pechera.' },
      { speaker: 'Auren', text: 'No es una pechera. Es el sello que guarda el último recuerdo: el día en que aceptaste protegernos.' },
      { speaker: 'Kael', text: 'Si eso es verdad, entrégamelo.' },
      { speaker: 'Auren', text: 'No puedo. Si lo tomas por la fuerza, despertarás completo… pero manchado por todo lo que hiciste.' },
      { speaker: 'Kael', text: 'Entonces pelea.' },
      { speaker: 'Auren', text: 'No peleo para detenerte. Peleo para que, cuando recuerdes, todavía tengas una elección.' },
    ],
    defeat: [
      { speaker: 'Auren', text: 'Ahora… toma el último recuerdo.' },
      { speaker: 'Kael', text: 'No quiero ver más.' },
      { speaker: 'Auren', text: 'Tienes que hacerlo.' },
      { speaker: 'Kael', text: 'Si lo hago… no podré perdonarme.' },
      { speaker: 'Auren', text: 'No te pido que te perdones. Te pido que elijas qué harás con la verdad.' },
      { speaker: 'Kael', text: 'Auren…' },
      { speaker: 'Auren', text: 'No dejes que ellos escriban tu final.' },
      {
        speaker: 'Memoria final',
        text: 'El Consejo atacó primero. Los jefes eran guardianes de distintas regiones. Kael era el protector principal, pero fue capturado, marcado y manipulado. Le hicieron creer que sus antiguos aliados eran criaturas corruptas. Cada misión fue diseñada para debilitar las defensas del mundo y abrir el camino al Consejo.',
      },
      { speaker: 'Voz del Consejo', text: 'No necesitamos un héroe. Necesitamos una culpa con espada.' },
      { speaker: 'Kael', text: 'Yo… abrí las puertas.' },
      { speaker: 'Voz de Garven', text: 'Pero ahora puedes cerrarlas.' },
      { speaker: 'Voz de Brakka', text: 'Puedes correr hacia ellos, no lejos de ti.' },
      { speaker: 'Voz de Lyra', text: 'Puedes mirarte sin obedecerles.' },
      { speaker: 'Voz de Auren', text: 'Puedes decidir.' },
    ],
    combat: [
      '¡No eres el arma del Consejo!',
      '¡Ya no sé qué soy!',
      'Entonces deja de buscar respuestas en la sangre de otros.',
      '¡Yo solo quería salvar este mundo!',
      'Lo sé. Por eso te usaron.',
    ],
  },
};

const defaultHudMessage = 'A/D moverse, W saltar, S caer, ESPACIO disparar, I inventario, E recoger, P pausar.';
let hudMessage = defaultHudMessage;
let hudMessageTimer = 0;
let dialogVisible = false;
let dialogInProgress = false;
let dialogQueue = [];
let dialogIndex = 0;
let dialogCallback = null;
let pendingBossDrops = null;
let bossCombatTimer = 0;
const defaultMusicVolume = 0.22;
let musicOn = false;
let musicFadeHandle = null;
const bgMusic = document.getElementById('bgMusic');
if (bgMusic) {
  bgMusic.src = 'assets/ambient-loop.mp3';
  bgMusic.volume = defaultMusicVolume;
  bgMusic.loop = true;
}
const bossSpecialAttacks = [];
const keys = new Set();
const logLines = [];
const particles = [];
const drops = [];
const enemies = [];
const projectiles = [];
const stolenRewards = new Set();
const traversalHistory = [];
const pathAnim = { visited: [], finalPath: [], step: 0, timer: 0, distances: new Map(), label: 'esperando algoritmo' };
let buildGraphHitNodes = [];
let buildGraphSlotTargets = [];
let buildGraphHover = null;
let buildGraphDrag = null;
const assetLoads = [];
let assetsReady = false,
  paused = false,
  gameStarted = false;
const heroSprites = {
  frameW: 42,
  frameH: 42,
  loaded: 0,
  total: 0,
  sheets: {},
};
const heroSheetDefs = {
  idle: ['Idle.png', 4],
  run: ['Run.png', 6],
  walk: ['Walk.png', 6],
  shoot: ['Attack.png', 6],
  runShoot: ['RunAttack.png', 6],
  jump: ['Jump.png', 8],
  jumpShoot: ['JumpAttack.png', 6],
  hurt: ['Hurt.png', 4],
  death: ['Death.png', 8],
};
for (const [name, [file, frames]] of Object.entries(heroSheetDefs)) {
  heroSprites.total++;
  const img = new Image();
  heroSprites.sheets[name] = { img, frames, ready: false };
  assetLoads.push(
    new Promise(resolve => {
      img.onload = () => {
        heroSprites.sheets[name].ready = true;
        heroSprites.loaded++;
        if (heroSprites.loaded === heroSprites.total) log('Hero asset cargado: assets/hero-3');
        if (img.decode)
          img
            .decode()
            .catch(() => {})
            .finally(resolve);
        else resolve();
      };
      img.onerror = () => {
        log(`No se pudo cargar animacion hero-3/${file}`);
        resolve();
      };
    }),
  );
  img.src = `assets/hero-3-clean/${file}`;
}
const levelScene = { img: new Image(), ready: false, x: 0, y: 0, w: 0, h: 0 };
assetLoads.push(
  new Promise(resolve => {
    levelScene.img.onload = () => {
      levelScene.ready = true;
      log('Escenario top-down cargado para Nivel 1');
      if (levelScene.img.decode)
        levelScene.img
          .decode()
          .catch(() => {})
          .finally(resolve);
      else resolve();
    };
    levelScene.img.onerror = () => {
      log('No se pudo cargar level1-scene.png');
      resolve();
    };
  }),
);
levelScene.img.src = 'assets/level1-scene.png';
const bossLevel1Sprite = { img: new Image(), ready: false, frameW: 144, frameH: 128, frames: 5 };
assetLoads.push(
  new Promise(resolve => {
    bossLevel1Sprite.img.onload = () => {
      bossLevel1Sprite.ready = true;
      log('Sprite del jefe Nivel 1 cargado');
      if (bossLevel1Sprite.img.decode)
        bossLevel1Sprite.img
          .decode()
          .catch(() => {})
          .finally(resolve);
      else resolve();
    };
    bossLevel1Sprite.img.onerror = () => {
      log('No se pudo cargar boss-level1-walk.png');
      resolve();
    };
  }),
);
bossLevel1Sprite.img.src = 'assets/boss-level1-walk.png';
let w = 900,
  h = 600,
  tick = 0,
  shake = 0,
  inventoryOpen = false,
  gameOver = false,
  won = false,
  choosingBossReward = false,
  cycleRun = 1;
let last = performance.now();

const player = {
  x: 210,
  y: 210,
  r: 13,
  room: 'Room1',
  hp: 100,
  maxHp: 100,
  base: { hp: 100, atk: 8, def: 2, spd: 95 },
  atk: 8,
  def: 2,
  spd: 95,
  invincible: 0,
  attack: 0,
  shotCooldown: 0,
  dir: { x: 1, y: 0 },
  vy: 0,
  onGround: false,
  inventory: [],
  equipped: { Head: null, RArm: null, LArm: null, RHand: null, LHand: null, Chest: null, Legs: null },
  combos: new Set(),
};
let wave = 1;
let levelState = 'levelStart';
let awaitingBossReward = false;
let bossRewardClaimed = false;
let spawnTimer = 0;
let boss = null;

function resize() {
  const rect = gameCanvas.getBoundingClientRect();
  gameCanvas.width = Math.max(480, Math.floor(rect.width));
  gameCanvas.height = Math.max(360, Math.floor(rect.height));
  w = gameCanvas.width;
  h = gameCanvas.height;
  if (!player.onGround) placePlayerOnPath();
  for (const c of [buildCanvas, mapCanvas]) {
    const r = c.getBoundingClientRect();
    const dpr = Math.max(1, globalThis.devicePixelRatio || 1);
    c.dataset.dpr = String(dpr);
    c.width = Math.max(1, Math.floor(r.width * dpr));
    c.height = Math.max(1, Math.floor(r.height * dpr));
  }
}
addEventListener('resize', resize);

function placePlayerOnPath(x = player.x) {
  if (isTopDownLevel()) {
    const start = topDownStart();
    player.x = start.x;
    player.y = start.y;
    player.vy = 0;
    player.onGround = true;
    return;
  }
  player.x = clamp(x, 38, w - 38);
  player.y = groundYAt(player.x);
  player.vy = 0;
  player.onGround = true;
}

function isTopDownLevel() {
  return wave === 1;
}

function topDownSceneRect() {
  const usableH = h;
  const scale = Math.min(w / 1200, usableH / 1200);
  const sw = 1200 * scale;
  const sh = 1200 * scale;
  return { x: (w - sw) / 2, y: (usableH - sh) / 2, w: sw, h: sh, scale };
}

function topDownToScreen(nx, ny) {
  const r = topDownSceneRect();
  return { x: r.x + nx * r.w, y: r.y + ny * r.h };
}

function screenToTopDown(x, y) {
  const r = topDownSceneRect();
  return { x: (x - r.x) / r.w, y: (y - r.y) / r.h };
}

function topDownStart() {
  return topDownToScreen(0.39, 0.8);
}

function log(msg) {
  const line = `[T:${String(tick).padStart(3, '0')}] ${msg}`;
  logLines.push(line);
  if (logLines.length > 90) logLines.shift();
  const el = document.getElementById('log');
  const div = document.createElement('div');
  div.textContent = line;
  el.appendChild(div);
  while (el.childNodes.length > 70) el.removeChild(el.firstChild);
  el.scrollTop = el.scrollHeight;
}

class PriorityQueue {
  constructor() {
    this.heap = [];
  }
  push(item, priority) {
    this.heap.push({ item, priority });
    this.bubble(this.heap.length - 1);
  }
  pop() {
    if (!this.heap.length) return null;
    const top = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length) {
      this.heap[0] = end;
      this.sink(0);
    }
    return top.item;
  }
  bubble(i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.heap[p].priority <= this.heap[i].priority) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
      i = p;
    }
  }
  sink(i) {
    for (;;) {
      let l = i * 2 + 1,
        r = l + 1,
        s = i;
      if (l < this.heap.length && this.heap[l].priority < this.heap[s].priority) s = l;
      if (r < this.heap.length && this.heap[r].priority < this.heap[s].priority) s = r;
      if (s === i) break;
      [this.heap[s], this.heap[i]] = [this.heap[i], this.heap[s]];
      i = s;
    }
  }
  get size() {
    return this.heap.length;
  }
}

function dijkstra(start, goal) {
  const dist = new Map(),
    prev = new Map(),
    visited = [];
  for (const n of dungeonGraph.keys()) dist.set(n, Infinity);
  dist.set(start, 0);
  const pq = new PriorityQueue();
  pq.push(start, 0);
  while (pq.size) {
    const node = pq.pop();
    if (visited.includes(node)) continue;
    visited.push(node);
    if (node === goal) break;
    for (const e of dungeonGraph.get(node)) {
      const alt = dist.get(node) + e.w;
      if (alt < dist.get(e.node)) {
        dist.set(e.node, alt);
        prev.set(e.node, node);
        pq.push(e.node, alt);
      }
    }
  }
  const path = [];
  let cur = goal;
  if (prev.has(cur) || cur === start) {
    while (cur) {
      path.unshift(cur);
      if (cur === start) break;
      cur = prev.get(cur);
    }
  }
  return { dist, prev, visited, path, cost: dist.get(goal) };
}

function bfs(start, goal) {
  const q = [start],
    seen = new Set([start]),
    prev = new Map(),
    order = [];
  while (q.length) {
    const n = q.shift();
    order.push(n);
    if (n === goal) break;
    for (const e of dungeonGraph.get(n))
      if (!seen.has(e.node)) {
        seen.add(e.node);
        prev.set(e.node, n);
        q.push(e.node);
      }
  }
  const path = [];
  let cur = goal;
  if (cur === start || prev.has(cur)) {
    while (cur) {
      path.unshift(cur);
      if (cur === start) break;
      cur = prev.get(cur);
    }
  }
  return { order, path };
}

function hasCycle() {
  const seen = new Set();
  function dfs(node, parent) {
    seen.add(node);
    for (const next of buildGraph.get(node)) {
      if (!isSlotEquipped(next)) continue;
      if (!seen.has(next)) {
        if (dfs(next, node)) return true;
      } else if (next !== parent) return true;
    }
    return false;
  }
  for (const n of SLOT_NAMES) {
    if (isSlotEquipped(n) && !seen.has(n) && dfs(n, null)) return true;
  }
  return false;
}

function hasPath(a, b, through) {
  if (!isSlotEquipped(a) || !isSlotEquipped(b)) return false;
  const q = [a],
    seen = new Set([a]);
  while (q.length) {
    const n = q.shift();
    if (n === b) return !through || through.every(x => seen.has(x) || x === b);
    for (const e of buildGraph.get(n))
      if (!seen.has(e) && isSlotEquipped(e)) {
        seen.add(e);
        q.push(e);
      }
  }
  return false;
}

function kruskalOptimalBuild() {
  const candidates = player.inventory.concat(Object.values(player.equipped).filter(Boolean));
  const bestBySlot = new Map();
  for (const p of candidates) {
    const score = statScore(p.stats);
    const current = bestBySlot.get(p.slot);
    if (!current || score > statScore(current.stats)) bestBySlot.set(p.slot, p);
  }
  const edges = [];
  for (const p of bestBySlot.values())
    for (const e of p.edges) {
      const weight = Math.max(1, 20 - statScore(p.stats));
      edges.push({ a: e[0], b: e[1], weight, part: p.name });
    }
  const parent = Object.fromEntries(SLOT_NAMES.map(n => [n, n]));
  const find = n => (parent[n] === n ? n : (parent[n] = find(parent[n])));
  const union = (a, b) => {
    a = find(a);
    b = find(b);
    if (a === b) return false;
    parent[b] = a;
    return true;
  };
  const mst = [];
  edges.sort((a, b) => a.weight - b.weight);
  for (const e of edges) if (union(e.a, e.b)) mst.push(e);
  return mst;
}

function statScore(stats) {
  return (stats.hp || 0) * 0.12 + (stats.atk || 0) * 2.2 + (stats.def || 0) * 1.7 + (stats.spd || 0) * 1.2;
}

function resetBuildGraph() {
  for (const n of SLOT_NAMES) buildGraph.set(n, []);
  for (const [slot, part] of Object.entries(player.equipped)) {
    if (!part) continue;
    for (const [a, b] of part.edges) addBuildEdge(a, b);
  }
}
function addBuildEdge(a, b) {
  if (!buildGraph.get(a).includes(b)) buildGraph.get(a).push(b);
  if (!buildGraph.get(b).includes(a)) buildGraph.get(b).push(a);
}
function isSlotEquipped(slot) {
  return Boolean(player.equipped[slot]);
}

function makePart(name) {
  const t = partTemplates[name];
  return { id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(16).slice(2), name, ...t };
}

function equipPart(part) {
  const previous = player.equipped[part.slot];
  if (previous) player.inventory.push(previous);
  player.equipped[part.slot] = part;
  player.inventory = player.inventory.filter(p => p.id !== part.id);
  resetBuildGraph();
  recalcStats();
  log(`Arista agregada por ${slotEs[part.slot]}: ${partEs[part.name]} equipada`);
  if (hasCycle()) log('DFS detecto ciclo en el grafo de build: combo DESBLOQUEADO');
  updateInventory();
}

function recalcStats() {
  const totals = { ...player.base };
  for (const p of Object.values(player.equipped))
    if (p) {
      for (const [k, v] of Object.entries(p.stats)) totals[k] += v;
    }
  player.maxHp = Math.max(30, totals.hp);
  player.atk = Math.max(1, totals.atk);
  player.def = Math.max(0, totals.def);
  player.spd = Math.max(45, totals.spd);
  player.hp = Math.min(player.hp, player.maxHp);
  player.combos.clear();
  if (hasPath('RHand', 'Legs', ['RArm', 'Chest'])) player.combos.add('Berserker');
  if (hasCycle()) player.combos.add('Cycle Ward');
  if (isSlotEquipped('Head') && isSlotEquipped('Chest') && isSlotEquipped('Legs')) player.combos.add('Undying Spine');
}

function updateInventory() {
  const list = document.getElementById('partList');
  list.innerHTML = '';
  for (const part of player.inventory) {
    const el = document.createElement('div');
    el.className = 'part';
    el.draggable = true;
    el.dataset.id = part.id;
    el.innerHTML = `<strong>${partEs[part.name]}</strong><small>${slotEs[part.slot]} | ${statText(part.stats)}</small><small>Aristas: ${part.edges.map(e => e.map(x => slotEs[x]).join('-')).join(', ')}</small>`;
    el.addEventListener('dragstart', ev => ev.dataTransfer.setData('text/plain', part.id));
    el.addEventListener('dblclick', () => equipPart(part));
    list.appendChild(el);
  }
  const slots = document.getElementById('slotList');
  slots.innerHTML = '';
  for (const slot of SLOT_NAMES) {
    const p = player.equipped[slot];
    const el = document.createElement('div');
    el.className = `slot ${p ? 'filled' : ''}`;
    el.dataset.slot = slot;
    el.innerHTML = `<strong>${slotEs[slot]}</strong><br>${p ? partEs[p.name] + ' | ' + statText(p.stats) : 'vacia'}`;
    el.addEventListener('dragover', ev => ev.preventDefault());
    el.addEventListener('drop', ev => {
      ev.preventDefault();
      const part = player.inventory.find(x => x.id === ev.dataTransfer.getData('text/plain'));
      if (part && part.slot === slot) equipPart(part);
    });
    slots.appendChild(el);
  }
  const mst = kruskalOptimalBuild();
  document.getElementById('mstHint').textContent = mst.length
    ? `Pista MST (Kruskal): ${mst.map(e => `${slotEs[e.a]}-${slotEs[e.b]} via ${partEs[e.part]}`).join(' | ')}`
    : 'La sugerencia de build optima espera piezas recolectadas.';
  if (inventoryOpen) log(`MST ejecutado: ${mst.length} aristas optimas resaltadas`);
}

function statText(stats) {
  return Object.entries(stats)
    .map(([k, v]) => `${k.toUpperCase()}${v >= 0 ? '+' : ''}${v}`)
    .join(' ');
}

function spawnWave() {
  const level = currentLevel();
  if (!level) {
    openBossChoice();
    return;
  }
  enemies.length = 0;
  drops.length = 0;
  awaitingBossReward = false;
  bossRewardClaimed = false;
  for (let i = 0; i < level.minions + cycleRun - 1; i++) {
    const tier = Math.min(enemyTypes.length - 1, Math.floor(Math.random() * Math.min(enemyTypes.length, wave + 1)));
    const type = enemyTypes[tier];
    const room = ['Room2', 'Room3', 'Room4', 'Room5', 'Room6'][Math.floor(Math.random() * 5)];
    spawnEnemy(type, room);
  }
  levelState = 'minions';
  playLevelMusic(level);
  log(`Nivel ${wave}: ${level.name} iniciado. Derrota enemigos para llamar al jefe.`);
}

function spawnEnemy(type, room) {
  const p = roomScreen(room);
  const offset = isTopDownLevel() ? rand(-16, 16) : rand(-35, 35);
  enemies.push({
    ...type,
    hp: type.hp,
    maxHp: type.hp,
    room,
    x: p.x + offset,
    y: p.y,
    r: 12,
    moveCooldown: rand(30, 95),
    hitCooldown: 0,
  });
}

function spawnBoss() {
  const p = roomScreen('Room6');
  const level = currentLevel();
  const hp = level.hp + cycleRun * 35;
  boss = {
    name: level.bossName,
    hp,
    maxHp: hp,
    phase: wave,
    room: 'Room6',
    x: p.x,
    y: p.y,
    r: 24 + wave * 2,
    speed: level.speed,
    atk: level.atk + cycleRun * 2,
    moveCooldown: 45,
    hitCooldown: 0,
    bfsTimer: 0,
    reward: level.reward,
    specialAttackTimer: 0,
    specialAttackPhase: 0,
    isCharging: false,
  };
  levelState = 'boss';
  if (level.bossMusic) playLevelMusic(level, 'boss');
  log(`JEFE DEL NIVEL ${wave}: ${level.bossName} entra. BFS activo.`);
  const bossDialogue = bossDialogues[wave]?.pre;
  if (bossDialogue && bossDialogue.length) {
    dialogInProgress = true;
    showDialog(bossDialogue, `${level.bossName} · ${level.bossTitle}`, () => {
      dialogInProgress = false;
      setHudMessage(`El combate contra ${level.bossName} ha comenzado.`, 5);
    });
  }
}

function currentLevel() {
  return levels[wave - 1] || null;
}

function update(dt) {
  tick++;
  if (dialogVisible) {
    if (keys.has(' ') || keys.has('enter')) {
      keys.delete(' ');
      keys.delete('enter');
      advanceDialog();
    }
    draw();
    return;
  }
  if (gameOver || won) {
    if (keys.has('r')) location.reload();
    draw();
    return;
  }
  if (choosingBossReward) {
    if (keys.has('1')) {
      keys.delete('1');
      chooseRedemption();
    }
    if (keys.has('2')) {
      keys.delete('2');
      chooseJudgement();
    }
    draw();
    return;
  }
  if (keys.has('i')) {
    keys.delete('i');
    inventoryOpen = !inventoryOpen;
    document.getElementById('inventory').classList.toggle('open', inventoryOpen);
    updateInventory();
  }
  if (inventoryOpen) {
    draw();
    return;
  }

  const dx = (keys.has('d') ? 1 : 0) - (keys.has('a') ? 1 : 0);
  const dy = (keys.has('s') ? 1 : 0) - (keys.has('w') ? 1 : 0);

  if (isTopDownLevel()) {
    if (!isTopDownWalkable(player.x, player.y)) placePlayerOnPath();
    const len = Math.hypot(dx, dy) || 1;
    if (dx || dy) player.dir = { x: dx / len, y: dy / len };
    const nx = player.x + (dx / len) * player.spd * dt;
    const ny = player.y + (dy / len) * player.spd * dt;
    if (isTopDownWalkable(nx, player.y)) player.x = nx;
    if (isTopDownWalkable(player.x, ny)) player.y = ny;
    player.onGround = true;
  } else {
    if (dx) player.dir = { x: dx, y: 0 };
    player.x = clamp(player.x + dx * player.spd * dt, 38, w - 38);
    if (keys.has('w') && player.onGround) {
      player.vy = -280;
      player.onGround = false;
    }
    player.vy += (keys.has('s') ? 780 : 620) * dt;
    player.y += player.vy * dt;
    const floor = groundYAt(player.x);
    if (player.y >= floor) {
      player.y = floor;
      player.vy = 0;
      player.onGround = true;
    }
  }
  player.room = nearestRoom(player.x, player.y);
  if (keys.has(' ')) tryShoot();
  if (keys.has('e')) {
    keys.delete('e');
    pickupNearest(true);
  }
  player.attack = Math.max(0, player.attack - dt * 5);
  player.shotCooldown = Math.max(0, player.shotCooldown - dt);
  player.invincible = Math.max(0, player.invincible - dt);
  shake = Math.max(0, shake - dt * 18);
  bossCombatTimer = Math.max(0, bossCombatTimer - dt);
  if (hudMessageTimer > 0) {
    hudMessageTimer = Math.max(0, hudMessageTimer - dt);
    if (hudMessageTimer <= 0) hudMessage = defaultHudMessage;
  }
  updateEnemies(dt);
  updateBoss(dt);
  updateProjectiles(dt);
  updateParticles(dt);
  pickupNearest(false);
  if (!enemies.length && !boss && !awaitingBossReward && spawnTimer <= 0) {
    if (levelState === 'minions') {
      spawnBoss();
    } else if (levelState === 'levelStart') {
      spawnWave();
    }
  }
  const beforeSpawnTimer = spawnTimer;
  spawnTimer -= dt;
  if (beforeSpawnTimer > 0 && spawnTimer <= 0 && levelState === 'levelStart') spawnWave();
  pathAnim.timer += dt;
  if (pathAnim.timer > 0.28) {
    pathAnim.timer = 0;
    pathAnim.step = Math.min(pathAnim.step + 1, pathAnim.visited.length);
  }
  if (player.hp <= 0) finish(false);
  draw();
}

function tryShoot() {
  if (player.shotCooldown > 0) return;
  player.attack = 1;
  player.shotCooldown = player.combos.has('Berserker') ? 0.18 : 0.28;
  const speed = player.combos.has('Berserker') ? 430 : 360;
  const damage = player.atk + (player.combos.has('Berserker') ? 3 : 0);
  projectiles.push({
    x: player.x + player.dir.x * 20,
    y: player.y - (isTopDownLevel() ? 12 : 18),
    vx: player.dir.x * speed,
    vy: (player.dir.y || 0) * speed,
    life: 1.35,
    damage,
    r: 5,
    color: player.combos.has('Berserker') ? '#ffd700' : '#00ff88',
  });
  log(`Disparo necroforjado: ${damage} ATK`);
}

function damageEnemy(e, amount) {
  e.hp -= amount;
  shake = 5;
  for (let i = 0; i < 5; i++) particles.push(pixel(e.x, e.y, '#8b0000'));
  if (e.hp <= 0) killEnemy(e);
}

function killEnemy(e) {
  const idx = enemies.indexOf(e);
  if (idx >= 0) enemies.splice(idx, 1);
  explode(e.x, e.y, e.color, 22);
  log(`${enemyEs[e.name]} derrotado: sin botin. Solo los jefes sueltan objetos.`);
}

function damageBoss(amount) {
  boss.hp -= amount;
  shake = 8;
  explode(boss.x, boss.y, '#8b0000', 8);
  if (boss.hp <= 0) {
    const defeatedBoss = boss;
    const level = currentLevel();
    const main = makePart(defeatedBoss.reward);
    const support = makePart(level.sideReward);
    main.levelReward = true;
    main.bossLoot = true;
    support.bossLoot = true;
    support.supportReward = true;
    const baseY = isTopDownLevel() ? defeatedBoss.y : groundYAt(defeatedBoss.x) - 12;
    pendingBossDrops = { x: defeatedBoss.x, y: baseY, main, support };
    bossRewardClaimed = false;
    log(`${defeatedBoss.name} derrotado: solto 2 objetos maximo.`);
    log(`Clave: ${partEs[main.name]} para el siguiente jefe | Apoyo: ${partEs[support.name]}`);
    boss = null;
    const defeatDialogue = bossDialogues[wave]?.defeat;
    if (defeatDialogue && defeatDialogue.length) {
      dialogInProgress = true;
      showDialog(defeatDialogue, `${defeatedBoss.name} vencido`, () => {
        dialogInProgress = false;
        finalizeBossDefeat();
      });
    } else {
      finalizeBossDefeat();
    }
  }
}

function finalizeBossDefeat() {
  if (pendingBossDrops) {
    drops.push({ x: pendingBossDrops.x - 18, y: pendingBossDrops.y, part: pendingBossDrops.main, bob: 0 });
    drops.push({ x: pendingBossDrops.x + 22, y: pendingBossDrops.y, part: pendingBossDrops.support, bob: Math.PI });
    pendingBossDrops = null;
  }
  bossRewardClaimed = false;
  if (wave >= levels.length) {
    openBossChoice();
    return;
  }
  awaitingBossReward = true;
  levelState = 'reward';
}

function setHudMessage(text, duration = 4) {
  hudMessage = text;
  hudMessageTimer = duration;
}

function renderDialog() {
  const line = dialogQueue[dialogIndex] || { speaker: '', text: '' };
  const container = document.getElementById('dialogText');
  container.innerHTML = `<span class="dialogSpeaker">${line.speaker}</span><p>${line.text}</p>`;
}

function showDialog(lines, title, callback) {
  dialogQueue = lines;
  dialogIndex = 0;
  dialogCallback = callback || null;
  document.getElementById('dialogTitle').textContent = title || 'Diálogo';
  document.getElementById('dialogOverlay').classList.add('show');
  dialogVisible = true;
  renderDialog();
}

function advanceDialog() {
  dialogIndex++;
  if (dialogIndex >= dialogQueue.length) {
    document.getElementById('dialogOverlay').classList.remove('show');
    dialogVisible = false;
    if (typeof dialogCallback === 'function') dialogCallback();
    dialogCallback = null;
    setHudMessage(defaultHudMessage, 2);
    return;
  }
  renderDialog();
}

function openBossChoice() {
  choosingBossReward = true;
  document.getElementById('bossChoice').classList.add('show');
  document.getElementById('choiceStats').textContent = `La verdad está completa. Elige tu destino final.`;
  document.getElementById('stealRelic').textContent = '1 Redención: ir tras el Consejo';
  document.getElementById('leaveForge').textContent = '2 Juicio: destruir la pechera';
  log('Elección final disponible luego del recuerdo.');
}

function chooseRedemption() {
  finish(true, 'redemption');
}

function chooseJudgement() {
  finish(true, 'judgement');
}

function toggleMusic() {
  if (!bgMusic) return;
  musicOn = !musicOn;
  if (musicOn) {
    bgMusic.play().catch(() => {});
    document.getElementById('musicBtn').textContent = 'Música ON';
  } else {
    bgMusic.pause();
    document.getElementById('musicBtn').textContent = 'Música OFF';
  }
}

function playLevelMusic(level, stage = 'minions') {
  if (!bgMusic || !level) return;
  const source = stage === 'boss' && level.bossMusic ? level.bossMusic : level.music;
  if (!source) return;
  setMusicSource(source);
}

function setMusicSource(source) {
  if (!bgMusic || !source) return;
  if (bgMusic.src && bgMusic.src.includes(source)) return;
  if (!musicOn) {
    bgMusic.src = source;
    bgMusic.currentTime = 0;
    return;
  }

  if (musicFadeHandle) cancelAnimationFrame(musicFadeHandle);
  const fadeOutDuration = 240;
  const fadeInDuration = 240;
  const startingVolume = bgMusic.volume;
  let stage = 'fadeout';
  let startTime = performance.now();

  function step(now) {
    if (stage === 'fadeout') {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / fadeOutDuration);
      bgMusic.volume = startingVolume * (1 - progress);
      if (progress < 1) {
        musicFadeHandle = requestAnimationFrame(step);
        return;
      }
      bgMusic.pause();
      bgMusic.src = source;
      bgMusic.currentTime = 0;
      bgMusic.volume = 0;
      bgMusic.play().catch(() => {});
      stage = 'fadein';
      startTime = performance.now();
      musicFadeHandle = requestAnimationFrame(step);
      return;
    }

    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / fadeInDuration);
    bgMusic.volume = defaultMusicVolume * progress;
    if (progress < 1) {
      musicFadeHandle = requestAnimationFrame(step);
    } else {
      bgMusic.volume = defaultMusicVolume;
      musicFadeHandle = null;
    }
  }

  musicFadeHandle = requestAnimationFrame(step);
}

function advanceLevelAfterReward() {
  awaitingBossReward = false;
  bossRewardClaimed = false;
  const completed = currentLevel();
  if (completed) stolenRewards.add(completed.reward);
  if (wave >= levels.length) {
    openBossChoice();
    return;
  }
  wave++;
  levelState = 'levelStart';
  spawnTimer = 0.9;
  enemies.length = 0;
  drops.length = 0;
  boss = null;
  player.hp = Math.min(player.maxHp, player.hp + 35);
  placePlayerOnPath(150);
  player.room = 'Room1';
  log(`Objeto robado. Se abre el Nivel ${wave}: ${currentLevel().name}.`);
}

function updateEnemies(dt) {
  for (const e of [...enemies]) {
    // Manejar espíritus de Lyra (tienen duración limitada)
    if (e.isSpirit) {
      e.lifetime -= dt;
      if (e.lifetime <= 0) {
        enemies.splice(enemies.indexOf(e), 1);
        continue;
      }
    }

    e.moveCooldown -= dt * 60;
    e.hitCooldown = Math.max(0, e.hitCooldown - dt);
    if (e.moveCooldown <= 0) {
      const res = dijkstra(e.room, player.room);
      pathAnim.visited = res.visited;
      pathAnim.finalPath = res.path;
      pathAnim.step = 0;
      pathAnim.distances = res.dist;
      pathAnim.label = `Dijkstra de ${roomEs[e.room]} a ${roomEs[player.room]}`;
      log(`Dijkstra ejecutado: enemigo en ${roomEs[e.room]}, jugador en ${roomEs[player.room]}`);
      log(`Camino mas corto: ${res.path.map(r => roomEs[r]).join('->')} (costo: ${res.cost})`);
      if (res.path[1]) e.room = res.path[1];
      traversalHistory.push(`D:${res.path.join('>')}`);
      e.moveCooldown = rand(85, 150);
    }
    const target = roomScreen(e.room);
    const toPlayer = e.room === player.room ? { x: player.x, y: player.y } : target;
    moveToward(e, toPlayer.x, toPlayer.y, e.speed * dt);
    if (!isTopDownLevel()) e.y = groundYAt(e.x);
    if (Math.hypot(e.x - player.x, e.y - player.y) < e.r + player.r + 2 && e.hitCooldown <= 0) {
      hitPlayer(e.atk);
      e.hitCooldown = 1.1;
    }
  }
}

function updateBoss(dt) {
  if (!boss) return;
  boss.specialAttackTimer += dt;
  boss.moveCooldown -= dt * 60;
  boss.hitCooldown = Math.max(0, boss.hitCooldown - dt);

  // Boss no se mueve durante diálogos
  if (dialogInProgress) {
    bossSpecialAttacks.length = 0;
    return;
  }

  // Actualizar ataques especiales
  for (const attack of [...bossSpecialAttacks]) {
    attack.lifetime -= dt;
    if (attack.lifetime <= 0) {
      bossSpecialAttacks.splice(bossSpecialAttacks.indexOf(attack), 1);
    }
  }

  // Sistema de ataque especial cada 10 segundos
  if (boss.specialAttackTimer >= 10) {
    boss.specialAttackTimer = 0;
    boss.specialAttackPhase = 0;
    boss.isCharging = true;
  }

  // Fases del ataque especial - ÚNICO POR JEFE
  if (boss.isCharging) {
    executeBossSpecialAttack(dt);
    return;
  }

  // Comportamiento normal: seguir cada 3-5 segundos
  if (isTopDownLevel()) {
    const moving = keys.has('a') || keys.has('d') || keys.has('w') || keys.has('s');
    const lead = moving ? 32 : 10;
    const target = {
      x: player.x + player.dir.x * lead,
      y: player.y + player.dir.y * lead,
    };
    moveTopDownChaser(boss, target.x, target.y, (boss.speed + boss.phase * 14 + cycleRun * 4) * dt);
    boss.room = nearestRoom(boss.x, boss.y);
    if (boss.moveCooldown <= 0) {
      const res = bfs(boss.room, player.room);
      pathAnim.visited = res.order;
      pathAnim.finalPath = res.path;
      pathAnim.step = 0;
      pathAnim.distances = new Map(res.order.map((n, i) => [n, i]));
      pathAnim.label = `BFS + caza: ${roomEs[boss.room]} -> ${roomEs[player.room]}`;
      traversalHistory.push(`B:${res.path.join('>')}`);
      log(`BFS del jefe: caza cada 3+ segundos`);
      boss.moveCooldown = 180 + rand(0, 120);
    }
    // Reduce ataques de contacto
    if (Math.hypot(boss.x - player.x, boss.y - player.y) < boss.r + player.r && boss.hitCooldown <= 0) {
      hitPlayer(boss.atk - 2);
      boss.hitCooldown = 2.5;
    }
    return;
  }

  // Comportamiento terrestre
  if (boss.moveCooldown <= 0) {
    const res = bfs(boss.room, player.room);
    pathAnim.visited = res.order;
    pathAnim.finalPath = res.path;
    pathAnim.step = 0;
    pathAnim.distances = new Map(res.order.map((n, i) => [n, i]));
    pathAnim.label = `BFS: ${roomEs[boss.room]} -> ${roomEs[player.room]}`;
    log(`BFS del jefe: ruta cada 4+ segundos`);
    if (res.path[1]) boss.room = res.path[1];
    traversalHistory.push(`B:${res.path.join('>')}`);
    boss.moveCooldown = 240 - boss.phase * 12;
  }
  const target = boss.room === player.room ? player : roomScreen(boss.room);
  moveToward(boss, target.x, target.y, (boss.speed + boss.phase * 8) * dt);
  if (!isTopDownLevel()) boss.y = groundYAt(boss.x);

  // Reduce ataques de contacto
  if (Math.hypot(boss.x - player.x, boss.y - player.y) < boss.r + player.r && boss.hitCooldown <= 0) {
    hitPlayer(boss.atk - 2);
    boss.hitCooldown = 2.8;
  }
}

function executeBossSpecialAttack(dt) {
  // Ataques especiales únicos por jefe
  if (wave === 1) {
    // GARVEN: Raíces que emergen del suelo
    garvenSpecialAttack(dt);
  } else if (wave === 2) {
    // BRAKKA: Proyectiles de metal pesado
    brakkaSpecialAttack(dt);
  } else if (wave === 3) {
    // LYRA: Espíritus fragmentados que atacan
    lyraSpecialAttack(dt);
  } else if (wave === 4) {
    // AUREN: Onda de energía del vacío
    aurenSpecialAttack(dt);
  }
}

function garvenSpecialAttack(dt) {
  // Ataque de GARVEN: Raíces emergentes
  if (boss.specialAttackPhase === 0) {
    // Fase 1: Advertencia - mostrar dónde van a emerger las raíces
    if (boss.specialAttackTimer < 1.8) {
      if (Math.floor(boss.specialAttackTimer * 8) % 6 === 0) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 100 + Math.random() * 50;
        const wx = player.x + Math.cos(angle) * dist;
        const wy = isTopDownLevel() ? player.y + Math.sin(angle) * dist : groundYAt(player.x);
        bossSpecialAttacks.push({
          x: wx,
          y: wy,
          r: 32,
          lifetime: 1.8,
          maxLifetime: 1.8,
          type: 'root_warning',
        });
      }
    } else {
      boss.specialAttackPhase = 1;
      boss.specialAttackTimer = 0;
    }
  } else if (boss.specialAttackPhase === 1) {
    // Fase 2: Crear raíces que dañan
    if (boss.specialAttackTimer < 1.2) {
      if (Math.floor(boss.specialAttackTimer * 8) % 6 === 0) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 100 + Math.random() * 50;
        const rx = player.x + Math.cos(angle) * dist;
        const ry = isTopDownLevel() ? player.y + Math.sin(angle) * dist : groundYAt(player.x);
        bossSpecialAttacks.push({
          x: rx,
          y: ry,
          r: 28,
          lifetime: 0.8,
          maxLifetime: 0.8,
          type: 'root_damage',
          damage: boss.atk + 5,
        });
        // Dañar si el jugador está cerca
        if (Math.hypot(player.x - rx, player.y - ry) < 50) {
          hitPlayer(boss.atk + 3);
          setHudMessage('¡Las raíces de Garven te golpearon!', 2);
        }
      }
    } else {
      boss.isCharging = false;
      setHudMessage(`${boss.name} retrae sus raíces.`, 3);
    }
  }
}

function brakkaSpecialAttack(dt) {
  // Ataque de BRAKKA: Proyectiles pesados de metal
  if (boss.specialAttackPhase === 0) {
    // Fase 1: Advertencia
    if (boss.specialAttackTimer < 1.5) {
      if (Math.floor(boss.specialAttackTimer * 6) % 4 === 0) {
        const angle = Math.atan2(player.y - boss.y, player.x - boss.x) + (Math.random() - 0.5) * 0.6;
        bossSpecialAttacks.push({
          x: boss.x,
          y: boss.y,
          r: 45,
          angle,
          lifetime: 1.5,
          maxLifetime: 1.5,
          type: 'metal_warning',
        });
      }
    } else {
      boss.specialAttackPhase = 1;
      boss.specialAttackTimer = 0;
    }
  } else if (boss.specialAttackPhase === 1) {
    // Fase 2: Disparar proyectiles pesados (más lentos, más daño)
    if (boss.specialAttackTimer < 1.8) {
      if (Math.floor(boss.specialAttackTimer * 4) % 3 === 0) {
        const angle = Math.atan2(player.y - boss.y, player.x - boss.x) + (Math.random() - 0.5) * 0.5;
        projectiles.push({
          x: boss.x,
          y: boss.y,
          vx: Math.cos(angle) * 140,
          vy: Math.sin(angle) * 140,
          life: 3,
          damage: boss.atk + 6,
          r: 10,
          color: '#8b7355',
          isBossShot: true,
        });
      }
    } else {
      boss.isCharging = false;
      setHudMessage(`${boss.name} termina su descarga de metal.`, 3);
    }
  }
}

function lyraSpecialAttack(dt) {
  // Ataque de LYRA: Espíritus fragmentados
  if (boss.specialAttackPhase === 0) {
    // Fase 1: Advertencia de materializacion
    if (boss.specialAttackTimer < 1.5) {
      if (Math.floor(boss.specialAttackTimer * 10) % 8 === 0) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 120;
        const sx = player.x + Math.cos(angle) * dist;
        const sy = isTopDownLevel() ? player.y + Math.sin(angle) * dist : groundYAt(player.x);
        bossSpecialAttacks.push({
          x: sx,
          y: sy,
          r: 24,
          lifetime: 1.5,
          maxLifetime: 1.5,
          type: 'spirit_warning',
        });
      }
    } else {
      boss.specialAttackPhase = 1;
      boss.specialAttackTimer = 0;
    }
  } else if (boss.specialAttackPhase === 1) {
    // Fase 2: Crear espíritus enemigos
    if (boss.specialAttackTimer < 0.1) {
      for (let i = 0; i < 3; i++) {
        const angle = ((Math.PI * 2) / 3) * i;
        const dist = 110;
        const sx = player.x + Math.cos(angle) * dist;
        const sy = isTopDownLevel() ? player.y + Math.sin(angle) * dist : groundYAt(player.x);
        const spirit = {
          x: sx,
          y: sy,
          r: 12,
          room: nearestRoom(sx, sy),
          hp: 8,
          maxHp: 8,
          atk: boss.atk - 3,
          speed: 55,
          moveCooldown: 0,
          hitCooldown: 0,
          isSpirit: true,
          bossSpirit: true,
          lifetime: 6,
        };
        enemies.push(spirit);
      }
      setHudMessage('¡Lyra convoca espíritus fragmentados!', 3);
    } else if (boss.specialAttackTimer >= 0.1) {
      boss.isCharging = false;
    }
  }
}

function aurenSpecialAttack(dt) {
  // Ataque de AUREN: Onda de energía del vacío
  if (boss.specialAttackPhase === 0) {
    // Fase 1: Cargar energía
    if (boss.specialAttackTimer < 1.8) {
      if (Math.floor(boss.specialAttackTimer * 12) % 10 === 0) {
        const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
        bossSpecialAttacks.push({
          x: boss.x + Math.cos(angle) * 60,
          y: boss.y + Math.sin(angle) * 60,
          r: 50,
          angle,
          lifetime: 1.8,
          maxLifetime: 1.8,
          type: 'void_warning',
        });
      }
    } else {
      boss.specialAttackPhase = 1;
      boss.specialAttackTimer = 0;
    }
  } else if (boss.specialAttackPhase === 1) {
    // Fase 2: Lanzar onda expansiva
    if (boss.specialAttackTimer < 0.1) {
      const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
      // Crear una onda que se expande (simulada con múltiples proyectiles)
      for (let i = 0; i < 5; i++) {
        const spreadAngle = angle + (i - 2) * 0.25;
        projectiles.push({
          x: boss.x,
          y: boss.y,
          vx: Math.cos(spreadAngle) * 180,
          vy: Math.sin(spreadAngle) * 180,
          life: 2.5,
          damage: boss.atk + 8,
          r: 9,
          color: '#7b2cbf',
          isBossShot: true,
        });
      }
      setHudMessage('¡Auren libera una onda del vacío!', 3);
    } else if (boss.specialAttackTimer >= 0.1) {
      boss.isCharging = false;
    }
  }
}

function updateProjectiles(dt) {
  for (const shot of [...projectiles]) {
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.life -= dt;
    shot.y += Math.sin((tick + shot.x) * 0.08) * 0.2;
    for (const e of [...enemies]) {
      if (Math.hypot(e.x - shot.x, e.y - 10 - shot.y) < e.r + shot.r + 4) {
        damageEnemy(e, shot.damage);
        explode(shot.x, shot.y, shot.color, 6);
        projectiles.splice(projectiles.indexOf(shot), 1);
        break;
      }
    }
    if (projectiles.includes(shot) && boss && Math.hypot(boss.x - shot.x, boss.y - 12 - shot.y) < boss.r + shot.r) {
      damageBoss(shot.damage);
      explode(shot.x, shot.y, shot.color, 8);
      projectiles.splice(projectiles.indexOf(shot), 1);
    }
    if (projectiles.includes(shot) && (shot.life <= 0 || shot.x < -40 || shot.x > w + 40)) {
      projectiles.splice(projectiles.indexOf(shot), 1);
    }
  }
}

function hitPlayer(amount) {
  if (player.invincible > 0) return;
  const dmg = Math.max(1, amount - player.def - (player.combos.has('Cycle Ward') ? 2 : 0));
  player.hp -= dmg;
  player.invincible = 0.7;
  shake = 12;
  explode(player.x, player.y, '#e8e0d0', 10);
  log(`Jugador golpeado: ${dmg} dano tras DEF`);
}

function moveToward(obj, x, y, step) {
  const dx = x - obj.x,
    dy = y - obj.y,
    len = Math.hypot(dx, dy) || 1;
  obj.x += (dx / len) * step;
  obj.y += (dy / len) * step;
}

function moveTopDownChaser(obj, x, y, step) {
  const dx = x - obj.x,
    dy = y - obj.y,
    len = Math.hypot(dx, dy) || 1;
  const nx = obj.x + (dx / len) * step;
  const ny = obj.y + (dy / len) * step;
  if (isTopDownWalkable(nx, obj.y)) obj.x = nx;
  if (isTopDownWalkable(obj.x, ny)) obj.y = ny;
  if (!isTopDownWalkable(obj.x, obj.y)) {
    const fallback = roomScreen(nearestRoom(obj.x, obj.y));
    moveToward(obj, fallback.x, fallback.y, step * 0.35);
  }
}

function pickupNearest(force) {
  for (const d of [...drops]) {
    d.bob += 0.1;
    const near = Math.hypot(d.x - player.x, d.y - player.y) < (force ? 68 : 25);
    if (near) {
      drops.splice(drops.indexOf(d), 1);
      player.inventory.push(d.part);
      log(`Pieza recogida: ${partEs[d.part.name]}${d.part.levelReward ? ' (clave)' : d.part.supportReward ? ' (apoyo)' : ''}`);
      if (d.part.levelReward) equipPart(d.part);
      else if (!player.equipped[d.part.slot]) equipPart(d.part);
      updateInventory();
      if (d.part.levelReward) bossRewardClaimed = true;
      if (awaitingBossReward && bossRewardClaimed && !drops.some(x => x.part.bossLoot)) advanceLevelAfterReward();
    }
  }
}

function updateParticles(dt) {
  for (const p of [...particles]) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 120 * dt;
    p.life -= dt;
    if (p.life <= 0) particles.splice(particles.indexOf(p), 1);
  }
}
function pixel(x, y, color) {
  return { x, y, color, vx: rand(-80, 80), vy: rand(-140, 40), life: rand(0.25, 0.8), s: rand(2, 5) };
}
function explode(x, y, color, count) {
  for (let i = 0; i < count; i++) particles.push(pixel(x, y, i % 3 ? color : '#8b0000'));
}

function draw() {
  const ox = shake ? rand(-shake, shake) : 0,
    oy = shake ? rand(-shake, shake) : 0;
  g.save();
  g.clearRect(0, 0, w, h);
  g.translate(ox, oy);
  drawDungeon();

  // Dibujar zonas de advertencia del ataque especial (con estilos únicos por jefe)
  for (const attack of bossSpecialAttacks) {
    const alpha = attack.lifetime / attack.maxLifetime;
    if (attack.type === 'root_warning') {
      // Advertencia de raíces - líneas verdes circulares
      g.fillStyle = `rgba(159, 217, 104, ${Math.sin(tick * 0.1) * 0.3 + 0.5})`;
      g.beginPath();
      g.arc(attack.x, attack.y, attack.r, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = `rgba(159, 217, 104, ${alpha})`;
      g.lineWidth = 3;
      g.stroke();
    } else if (attack.type === 'metal_warning') {
      // Advertencia de metal - líneas de metal grisáceas en ángulo
      g.fillStyle = `rgba(139, 115, 85, ${Math.sin(tick * 0.12) * 0.25 + 0.4})`;
      g.save();
      g.translate(attack.x, attack.y);
      g.rotate(attack.angle);
      g.fillRect(-30, -attack.r, 60, attack.r * 2);
      g.restore();
      g.strokeStyle = `rgba(180, 150, 100, ${alpha})`;
      g.lineWidth = 2;
      g.strokeRect(attack.x - attack.r, attack.y - attack.r / 2, attack.r * 2, attack.r);
    } else if (attack.type === 'spirit_warning') {
      // Advertencia de espíritus - púrpura intermitente
      g.fillStyle = `rgba(255, 100, 180, ${Math.sin(tick * 0.15) * 0.4 + 0.45})`;
      g.beginPath();
      g.arc(attack.x, attack.y, attack.r, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = `rgba(255, 150, 200, ${alpha})`;
      g.lineWidth = 2.5;
      g.stroke();
      // Dibujar pequeñas líneas internas
      for (let i = 0; i < 3; i++) {
        const angle = ((Math.PI * 2) / 3) * i;
        g.strokeStyle = `rgba(255, 100, 180, ${alpha * 0.6})`;
        g.beginPath();
        g.moveTo(attack.x, attack.y);
        g.lineTo(attack.x + Math.cos(angle) * attack.r, attack.y + Math.sin(angle) * attack.r);
        g.stroke();
      }
    } else if (attack.type === 'void_warning') {
      // Advertencia del vacío - púrpura oscuro con destello
      g.fillStyle = `rgba(123, 44, 191, ${Math.sin(tick * 0.2) * 0.35 + 0.4})`;
      g.beginPath();
      g.arc(attack.x, attack.y, attack.r, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = `rgba(200, 100, 255, ${alpha})`;
      g.lineWidth = 3;
      g.stroke();
      // Aura exterior
      g.strokeStyle = `rgba(200, 100, 255, ${alpha * 0.5})`;
      g.lineWidth = 1;
      g.beginPath();
      g.arc(attack.x, attack.y, attack.r * 1.3, 0, Math.PI * 2);
      g.stroke();
    }
  }

  for (const d of drops) drawDrop(d);
  for (const shot of projectiles) drawProjectile(shot);
  for (const e of enemies) drawEnemy(e);
  if (boss) drawBoss();
  drawPlayer();
  for (const p of particles) {
    g.fillStyle = p.color;
    g.fillRect(p.x, p.y, p.s, p.s);
  }
  g.restore();
  drawBuildGraph();
  drawMapGraph();
  updateHud();
}

function drawLoadingScreen(progress) {
  g.clearRect(0, 0, w, h);
  g.fillStyle = '#050508';
  g.fillRect(0, 0, w, h);
  g.fillStyle = '#ffd700';
  g.font = '700 24px Segoe UI, Arial, sans-serif';
  g.textAlign = 'center';
  g.fillText('NECROFORGE', w / 2, h / 2 - 38);
  g.fillStyle = '#e8e0d0';
  g.font = '12px Segoe UI, Arial, sans-serif';
  g.fillText('Cargando sprites y grafos...', w / 2, h / 2 - 12);
  const bw = Math.min(320, w - 80),
    bx = (w - bw) / 2,
    by = h / 2 + 12;
  g.fillStyle = '#0a0a0f';
  g.fillRect(bx, by, bw, 14);
  g.fillStyle = '#00ff88';
  g.fillRect(bx + 2, by + 2, (bw - 4) * clamp(progress, 0, 1), 10);
  g.strokeStyle = '#765a88';
  g.strokeRect(bx, by, bw, 14);
  drawBuildGraph();
  drawMapGraph();
}

function setPaused(value) {
  if (!gameStarted || gameOver || won || choosingBossReward) return;
  paused = value;
  keys.clear();
  const btn = document.getElementById('pauseBtn');
  btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
  btn.textContent = paused ? 'SEGUIR' : 'PAUSA';
  document.getElementById('pauseOverlay').classList.toggle('show', paused);
  if (paused) log('Pausa activada: simulacion congelada');
  else log('Pausa desactivada: simulacion reanudada');
}

function togglePause() {
  setPaused(!paused);
}

function drawDungeon() {
  if (isTopDownLevel()) {
    drawTopDownDungeon();
    return;
  }
  const level = currentLevel() || levels[levels.length - 1];
  const sky = g.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, level.sky[0]);
  sky.addColorStop(0.33, level.sky[1]);
  sky.addColorStop(0.65, level.sky[2]);
  sky.addColorStop(1, level.sky[3]);
  g.fillStyle = sky;
  g.fillRect(0, 0, w, h);
  drawCloudLayer(0.12, '#dbe9e6', 42, 28, 34);
  drawTreeLayer(0.18, '#8fb4b0', 0.34, 42, 88);
  drawTreeLayer(0.35, '#5d8382', 0.46, 34, 126);
  drawTreeLayer(0.55, '#244d4f', 0.58, 28, 172);
  drawTreeLayer(0.82, '#102b2e', 0.68, 24, 220);
  drawForegroundTrunks();
  drawFogBands();
  drawLevelSetPieces(level);
  drawGround();
}

function drawTopDownDungeon() {
  g.fillStyle = '#343438';
  g.fillRect(0, 0, w, h);
  const r = topDownSceneRect();
  if (levelScene.ready) {
    g.drawImage(levelScene.img, r.x, r.y, r.w, r.h);
  } else {
    g.fillStyle = '#728018';
    g.fillRect(r.x, r.y, r.w, r.h);
  }
  g.fillStyle = 'rgba(0,0,0,.20)';
  g.fillRect(0, 0, w, h);
  g.fillStyle = '#050508';
  g.fillRect(w * 0.5 - 118, 18, 236, 24);
  g.strokeStyle = levels[0].accent;
  g.lineWidth = 2;
  g.strokeRect(w * 0.5 - 118, 18, 236, 24);
  g.fillStyle = levels[0].accent;
  g.font = '700 14px Segoe UI, Arial, sans-serif';
  g.textAlign = 'center';
  g.fillText(`NIVEL 1: ${levels[0].name}`, w * 0.5, 35);
}

function drawLevelSetPieces(level) {
  const floorL = groundYAt(92);
  const floorR = groundYAt(w - 105);
  g.fillStyle = 'rgba(0,0,0,.48)';
  g.fillRect(46, floorL - 64, 72, 66);
  g.fillStyle = '#111018';
  g.fillRect(58, floorL - 70, 48, 70);
  g.fillStyle = level.accent;
  g.fillRect(66, floorL - 58, 32, 5);
  g.fillRect(75, floorL - 44, 14, 28);
  g.fillStyle = 'rgba(0,0,0,.52)';
  g.fillRect(w - 156, floorR - 88, 112, 90);
  g.fillStyle = '#12101a';
  g.fillRect(w - 140, floorR - 78, 80, 78);
  g.fillStyle = level.accent;
  g.fillRect(w - 132, floorR - 68, 64, 5);
  g.fillRect(w - 118, floorR - 50, 36, 28);
  const signY = Math.max(168, groundYAt(w * 0.55) - 126);
  g.fillStyle = '#050508';
  g.fillRect(w * 0.5 - 118, signY, 236, 24);
  g.strokeStyle = level.accent;
  g.lineWidth = 2;
  g.strokeRect(w * 0.5 - 118, signY, 236, 24);
  g.fillStyle = level.accent;
  g.font = '700 14px Segoe UI, Arial, sans-serif';
  g.textAlign = 'center';
  g.fillText(`NIVEL ${wave}: ${level.name}`, w * 0.5, signY + 17);
  if (levelState === 'reward') {
    g.fillStyle = '#ffd700';
    g.fillText(`RECOGE CLAVE + APOYO DEL JEFE`, w * 0.5, signY + 44);
  } else if (levelState === 'boss' && boss) {
    g.fillStyle = '#ffef6e';
    g.fillText(`JEFE: ${level.bossName}`, w * 0.5, signY + 44);
  }
}

function scaledRooms() {
  const sx = w / 780;
  const out = {};
  for (const [k, p] of Object.entries(roomPos)) {
    const x = p.x * sx;
    out[k] = { x, y: groundYAt(x) - roomLayers[k] };
  }
  return out;
}
function roomScreen(room) {
  if (isTopDownLevel()) {
    const p = topDownRooms[room] || topDownRooms.Room1;
    return topDownToScreen(p.x, p.y);
  }
  const sx = w / 780;
  const x = roomPos[room].x * sx;
  return { x, y: groundYAt(x) };
}
function nearestRoom(x, y) {
  if (isTopDownLevel()) {
    let best = 'Room1',
      bd = Infinity;
    for (const [r, pn] of Object.entries(topDownRooms)) {
      const p = topDownToScreen(pn.x, pn.y);
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < bd) {
        bd = d;
        best = r;
      }
    }
    return best;
  }
  const scaled = scaledRooms();
  let best = 'Room1',
    bd = Infinity;
  for (const [r, p] of Object.entries(scaled)) {
    const d = Math.hypot(p.x - x, p.y - y);
    if (d < bd) {
      bd = d;
      best = r;
    }
  }
  return best;
}

function isTopDownWalkable(x, y) {
  const r = topDownSceneRect();
  if (x < r.x || y < r.y || x > r.x + r.w || y > r.y + r.h) return false;
  const p = screenToTopDown(x, y);
  const radius = 9 / r.w;
  const yRadius = 7 / r.h;
  const points = [
    [p.x, p.y],
    [p.x - radius, p.y],
    [p.x + radius, p.y],
    [p.x, p.y - yRadius],
    [p.x, p.y + yRadius],
  ];
  return points.every(([px, py]) => topDownWalkAreas.some(([x1, y1, x2, y2]) => px >= x1 && px <= x2 && py >= y1 && py <= y2));
}

function groundY() {
  return h - Math.max(74, Math.floor(h * 0.16));
}

function groundYAt(x) {
  const base = groundY();
  const hill = Math.sin(x * 0.012) * 9 + Math.sin(x * 0.031 + 1.7) * 5;
  const terrace = x > w * 0.48 && x < w * 0.62 ? -10 : x > w * 0.72 ? 7 : 0;
  return base + hill + terrace;
}

function drawCloudLayer(speed, color, yBase, height, gap) {
  const offset = -((player.x * speed + tick * 0.08) % gap);
  g.fillStyle = color;
  for (let x = offset - gap; x < w + gap; x += gap) {
    const y = yBase + Math.sin((x + tick) * 0.013) * 8;
    g.fillRect(x, y, height, 8);
    g.fillRect(x + 12, y - 7, height + 16, 9);
    g.fillRect(x + 34, y + 2, height + 6, 7);
  }
}

function drawTreeLayer(speed, color, startRatio, spacing, treeHeight) {
  const floor = groundY();
  const offset = -((player.x * speed) % spacing);
  g.fillStyle = color;
  for (let x = offset - spacing; x < w + spacing; x += spacing) {
    const hgt = treeHeight + ((Math.floor(x * 7) % 33) - 16);
    const top = floor - hgt - h * (1 - startRatio) * 0.12;
    g.fillRect(x, top, 7, floor - top);
    for (let y = top + 8; y < floor - 28; y += 18) {
      const spread = Math.max(10, (floor - y) * 0.16);
      g.fillRect(x - spread, y, spread * 2, 9);
      g.fillRect(x - spread * 0.65, y - 8, spread * 1.3, 8);
    }
  }
}

function drawForegroundTrunks() {
  const floor = groundY();
  const offset = -((player.x * 0.95) % 260);
  for (let x = offset - 260; x < w + 260; x += 260) {
    g.fillStyle = '#1a100d';
    g.fillRect(x + 16, floor - 250, 28, 260);
    g.fillStyle = '#5d301f';
    g.fillRect(x + 23, floor - 246, 10, 245);
    g.fillStyle = '#0a0a0f';
    g.fillRect(x + 3, floor - 125, 58, 9);
    g.fillRect(x + 31, floor - 175, 9, 64);
    g.fillStyle = '#224420';
    g.fillRect(x + 10, floor - 104, 18, 24);
  }
}

function drawFogBands() {
  g.fillStyle = 'rgba(214,236,228,.18)';
  for (let i = 0; i < 4; i++) {
    const y = h * (0.35 + i * 0.09) + Math.sin(tick / 38 + i) * 8;
    g.fillRect(0, y, w, 14 + i * 4);
  }
}

function drawGround() {
  const floor = groundY();
  g.fillStyle = '#07100b';
  g.beginPath();
  g.moveTo(0, h);
  for (let x = 0; x <= w; x += 10) g.lineTo(x, groundYAt(x) + 22);
  g.lineTo(w, h);
  g.closePath();
  g.fill();
  g.fillStyle = '#06140d';
  g.beginPath();
  g.moveTo(0, h);
  for (let x = 0; x <= w; x += 10) g.lineTo(x, groundYAt(x));
  g.lineTo(w, h);
  g.closePath();
  g.fill();
  g.strokeStyle = '#12291b';
  g.lineWidth = 10;
  g.beginPath();
  for (let x = 0; x <= w; x += 10) {
    const y = groundYAt(x) - 3;
    if (x === 0) g.moveTo(x, y);
    else g.lineTo(x, y);
  }
  g.stroke();
  g.fillStyle = '#5e7d36';
  for (let x = -8; x < w + 8; x += 12) {
    const y = groundYAt(x) + Math.sin((x + tick) * 0.04) * 2;
    g.fillRect(x, y, 16, 4);
    g.fillRect(x + 3, y - 5, 3, 8);
  }
  g.fillStyle = '#9ccf5c';
  for (let x = 4; x < w; x += 53) g.fillRect(x, groundYAt(x) - 11 + (x % 9), 4, 12);
  g.fillStyle = '#213f22';
  for (let x = 18; x < w; x += 71) g.fillRect(x, groundYAt(x) - 18 + (x % 7), 14, 18);
  g.fillStyle = '#0a0a0f';
  for (let x = 0; x < w; x += 37) g.fillRect(x, groundYAt(x) + 20 + (x % 11), 24, 8);
}

function drawPlayer() {
  const blink = player.invincible > 0 && tick % 8 < 4;
  if (blink) return;
  g.fillStyle = 'rgba(0,0,0,.45)';
  g.fillRect(player.x - 18, player.y + 12, 36, 7);
  drawPlayerSprite(player.x, player.y);
  if (player.attack > 0) {
    g.fillStyle = 'rgba(0,255,136,.28)';
    g.fillRect(player.x + player.dir.x * 12 - 4, player.y - 25, 8, 8);
    g.fillStyle = '#e8e0d0';
    g.fillRect(player.x + player.dir.x * 17 - 2, player.y - 23, 4, 4);
  }
  let i = 0;
  for (const c of player.combos) {
    g.fillStyle = c === 'Berserker' ? '#ffd700' : '#00ff88';
    g.fillRect(player.x - 28 + i * 18, player.y - 58 - Math.sin(tick / 12) * 3, 10, 10);
    i++;
  }
}

function drawProjectile(shot) {
  g.fillStyle = 'rgba(0,255,136,.18)';
  g.fillRect(shot.x - 10, shot.y - 5, 20, 10);
  g.fillStyle = shot.color;
  g.fillRect(shot.x - 5, shot.y - 4, 10, 8);
  g.fillStyle = '#e8e0d0';
  g.fillRect(shot.x + Math.sign(shot.vx) * 2, shot.y - 2, 4, 4);
}

function drawPlayerSprite(x, y) {
  const moving = keys.has('a') || keys.has('d') || (isTopDownLevel() && (keys.has('w') || keys.has('s')));
  const airborne = !player.onGround && !isTopDownLevel();
  const shooting = player.attack > 0;
  const hurt = player.invincible > 0;
  let action = 'idle';
  if (hurt) action = 'hurt';
  else if (airborne && shooting) action = 'jumpShoot';
  else if (airborne) action = 'jump';
  else if (moving && shooting) action = 'runShoot';
  else if (shooting) action = 'shoot';
  else if (moving) action = isTopDownLevel() ? 'walk' : 'run';
  const sheet = heroSprites.sheets[action];
  if (!sheet || !sheet.ready) {
    drawKnight(x, y, isTopDownLevel() ? 0.62 : 1.05);
    return;
  }
  const frameSpeed = shooting ? 4 : moving ? 6 : 12;
  const frame = Math.floor(tick / frameSpeed) % sheet.frames;
  const sw = heroSprites.frameW,
    sh = heroSprites.frameH;
  const levelScale = isTopDownLevel() ? 1.15 : 1.55;
  const dw = sw * levelScale,
    dh = sh * levelScale;
  g.save();
  g.translate(x, y + (isTopDownLevel() ? 7 : 3));
  if (player.dir.x < 0) g.scale(-1, 1);
  g.drawImage(sheet.img, frame * sw, 0, sw, sh, -dw / 2, -dh + (isTopDownLevel() ? 27 : 23), dw, dh);
  g.restore();
}

function drawKnight(x, y, s) {
  const bob = Math.sin(tick / 10) * s;
  const px = (ox, oy, ww, hh, color) => {
    g.fillStyle = color;
    g.fillRect(x + ox * s, y + (oy + bob) * s, ww * s, hh * s);
  };
  const face = '#78bd49',
    faceDark = '#2f7938',
    robe = '#08080f',
    robeHi = '#171725',
    scarf = '#39205b',
    belt = '#d17935';
  px(-18, 12, 36, 7, 'rgba(0,0,0,.38)');
  px(-14, -1, 28, 27, robe);
  px(-18, 3, 7, 21, '#11111c');
  px(11, 3, 7, 21, '#11111c');
  px(-10, 7, 20, 12, robeHi);
  px(-13, -18, 26, 14, face);
  px(-17, -14, 8, 9, face);
  px(9, -14, 8, 9, face);
  px(-9, -7, 18, 6, '#9bd865');
  px(-10, -23, 8, 10, '#0a0a0f');
  px(3, -23, 8, 10, '#0a0a0f');
  px(-8, -21, 3, 3, '#f6fbf1');
  px(5, -21, 3, 3, '#f6fbf1');
  px(-8, -9, 16, 5, '#fff7ef');
  px(-13, -10, 3, 4, faceDark);
  px(10, -10, 3, 4, faceDark);
  px(-24, -29, 48, 5, '#34211a');
  px(-20, -33, 40, 5, '#8d5737');
  px(-15, -37, 30, 5, '#b9784c');
  px(-10, -41, 20, 5, '#d59662');
  px(-5, -45, 10, 4, '#e4ad75');
  px(-22, -27, 44, 2, '#e1a46a');
  for (let i = -16; i <= 16; i += 8) px(i, -36 + Math.abs(i) / 5, 2, 7, '#6b3d2a');
  px(-13, -2, 26, 7, scarf);
  px(-17, 3, 34, 6, '#25113d');
  px(6, 8, 12, 6, '#4b2a76');
  px(-12, 12, 24, 4, belt);
  px(-10, 16, 7, 4, '#f2a25b');
  px(-2, 16, 6, 13, '#db803b');
  px(5, 16, 5, 11, '#be6531');
  px(-12, 28, 8, 5, face);
  px(5, 28, 8, 5, face);
  px(-15, 31, 6, 3, faceDark);
  px(10, 31, 6, 3, faceDark);
  px(17, -25, 4, 33, '#dfe8ef');
  px(19, -21, 4, 26, '#6f3c28');
  for (let i = 0; i < 4; i++) px(17, -18 + i * 6, 6, 2, '#ffd7a0');
  px(14, -6, 9, 4, '#dfe8ef');
}

function drawEnemy(e) {
  // Dibujar espíritus de Lyra con efecto especial
  if (e.isSpirit) {
    const alpha = e.lifetime / 6; // 6 segundos de duración
    const glow = Math.sin(tick * 0.15) * 0.3 + 0.7;
    if (isTopDownLevel()) {
      g.fillStyle = `rgba(255, 100, 180, ${alpha * 0.3})`;
      g.fillRect(e.x - 10, e.y + 6, 20, 5);
      g.fillStyle = `rgba(200, 0, 150, ${alpha * 0.6})`;
      g.fillRect(e.x - 8, e.y - 13, 16, 20);
      g.fillStyle = `rgba(255, 150, 200, ${alpha * glow})`;
      g.fillRect(e.x - 6, e.y - 12, 12, 7);
      g.fillRect(e.x - 7, e.y - 4, 14, 12);
      g.fillStyle = `rgba(150, 50, 150, ${alpha})`;
      g.fillRect(e.x - 3, e.y - 10, 2, 2);
      g.fillRect(e.x + 2, e.y - 10, 2, 2);
      g.fillStyle = `rgba(255, 100, 255, ${alpha * 0.8})`;
      g.fillRect(e.x - 8, e.y + 3, 4, 5);
      g.fillRect(e.x + 4, e.y + 3, 4, 5);
      healthBar(e.x - 10, e.y - 19, 20, 3, e.hp / e.maxHp);
      return;
    }
    g.fillStyle = `rgba(255, 100, 180, ${alpha * 0.2})`;
    g.fillRect(e.x - 14, e.y + 11, 28, 6);
    g.fillStyle = `rgba(200, 0, 150, ${alpha * 0.5})`;
    g.fillRect(e.x - 12, e.y - 13, 24, 26);
    g.fillStyle = `rgba(255, 150, 200, ${alpha * glow})`;
    g.fillRect(e.x - 8, e.y - 14, 16, 8);
    g.fillRect(e.x - 10, e.y - 4, 20, 14);
    g.fillStyle = `rgba(255, 200, 255, ${alpha * 0.7})`;
    g.fillRect(e.x - 6, e.y - 12, 3, 2);
    g.fillRect(e.x + 3, e.y - 12, 3, 2);
    g.fillStyle = `rgba(150, 50, 150, ${alpha * 0.6})`;
    g.fillRect(e.x - 4, e.y - 10, 3, 3);
    g.fillRect(e.x + 3, e.y - 10, 3, 3);
    g.fillStyle = `rgba(255, 100, 255, ${alpha * 0.8})`;
    g.fillRect(e.x - 13, e.y + 1, 4, 8);
    g.fillRect(e.x + 9, e.y + 1, 4, 8);
    healthBar(e.x - 14, e.y - 22, 28, 4, e.hp / e.maxHp);
    return;
  }

  // Enemigos normales
  if (isTopDownLevel()) {
    g.fillStyle = 'rgba(0,0,0,.35)';
    g.fillRect(e.x - 10, e.y + 6, 20, 5);
    g.fillStyle = '#030305';
    g.fillRect(e.x - 8, e.y - 13, 16, 20);
    g.fillStyle = e.color;
    g.fillRect(e.x - 6, e.y - 12, 12, 7);
    g.fillRect(e.x - 7, e.y - 4, 14, 12);
    g.fillStyle = '#0a0a0f';
    g.fillRect(e.x - 3, e.y - 10, 2, 2);
    g.fillRect(e.x + 2, e.y - 10, 2, 2);
    g.fillStyle = '#8b0000';
    g.fillRect(e.x - 8, e.y + 3, 4, 5);
    g.fillRect(e.x + 4, e.y + 3, 4, 5);
    healthBar(e.x - 10, e.y - 19, 20, 3, e.hp / e.maxHp);
    return;
  }
  g.fillStyle = 'rgba(0,0,0,.45)';
  g.fillRect(e.x - 14, e.y + 11, 28, 6);
  g.fillStyle = '#030305';
  g.fillRect(e.x - 12, e.y - 13, 24, 26);
  g.fillStyle = e.color;
  g.fillRect(e.x - 8, e.y - 14, 16, 8);
  g.fillRect(e.x - 10, e.y - 4, 20, 14);
  g.fillStyle = '#ffffff';
  g.fillRect(e.x - 6, e.y - 12, 3, 2);
  g.fillRect(e.x + 3, e.y - 12, 3, 2);
  g.fillStyle = '#0a0a0f';
  g.fillRect(e.x - 4, e.y - 10, 3, 3);
  g.fillRect(e.x + 3, e.y - 10, 3, 3);
  g.fillStyle = '#8b0000';
  g.fillRect(e.x - 13, e.y + 1, 4, 8);
  g.fillRect(e.x + 9, e.y + 1, 4, 8);
  healthBar(e.x - 14, e.y - 22, 28, 4, e.hp / e.maxHp);
}
function drawBoss() {
  const b = boss;
  if (isTopDownLevel()) {
    if (bossLevel1Sprite.ready) {
      const sw = bossLevel1Sprite.frameW;
      const sh = bossLevel1Sprite.frameH;
      const frame = Math.floor(tick / 14) % bossLevel1Sprite.frames;
      const scale = 0.56;
      const dw = sw * scale;
      const dh = sh * scale;
      g.fillStyle = 'rgba(0,0,0,.38)';
      g.fillRect(b.x - 25, b.y + 16, 50, 9);
      g.save();
      g.translate(b.x, b.y + 22);
      if (b.x < player.x) g.scale(-1, 1);
      g.drawImage(bossLevel1Sprite.img, frame * sw, 0, sw, sh, -dw / 2, -dh + 12, dw, dh);
      g.restore();
      healthBar(b.x - 36, b.y - 54, 72, 6, b.hp / b.maxHp);
      return;
    }
    g.fillStyle = 'rgba(0,0,0,.45)';
    g.fillRect(b.x - 22, b.y + 12, 44, 7);
    g.fillStyle = '#050508';
    g.fillRect(b.x - 18, b.y - 25, 36, 38);
    g.fillStyle = '#6d6680';
    g.fillRect(b.x - 14, b.y - 22, 28, 32);
    g.fillStyle = '#ffd700';
    g.fillRect(b.x - 10, b.y - 30, 20, 6);
    g.fillStyle = '#8b0000';
    g.fillRect(b.x - 7, b.y - 12, 4, 4);
    g.fillRect(b.x + 4, b.y - 12, 4, 4);
    g.fillStyle = '#00ff88';
    g.fillRect(b.x - 4, b.y + 3, 8, 7);
    healthBar(b.x - 28, b.y - 38, 56, 5, b.hp / b.maxHp);
    return;
  }
  g.fillStyle = 'rgba(0,0,0,.55)';
  g.fillRect(b.x - b.r - 10, b.y + b.r - 4, b.r * 2 + 20, 9);
  g.fillStyle = '#050508';
  g.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
  g.fillStyle = '#6d6680';
  g.fillRect(b.x - 23, b.y - 25, 46, 48);
  g.fillStyle = '#8f899a';
  g.fillRect(b.x - 17, b.y - 20, 34, 8);
  g.fillRect(b.x - 19, b.y - 4, 38, 8);
  g.fillStyle = '#3b3444';
  g.fillRect(b.x - 32, b.y - 11, 13, 32);
  g.fillRect(b.x + 19, b.y - 11, 13, 32);
  g.fillStyle = '#ffd700';
  g.fillRect(b.x - 13, b.y - 36, 26, 8);
  g.fillRect(b.x - 5, b.y - 30, 10, 6);
  g.fillStyle = '#8b0000';
  g.fillRect(b.x - 10, b.y - 13, 5, 5);
  g.fillRect(b.x + 5, b.y - 13, 5, 5);
  g.fillStyle = '#00ff88';
  g.fillRect(b.x - 4, b.y + 9, 8, 8);
  healthBar(b.x - 42, b.y - 47, 84, 6, b.hp / b.maxHp);
}
function drawDrop(d) {
  const y = d.y + Math.sin(d.bob) * 3;
  g.fillStyle = d.part.levelReward ? 'rgba(255,215,0,.28)' : 'rgba(60,247,255,.20)';
  g.fillRect(d.x - 14, y - 14, 28, 28);
  g.fillStyle = d.part.color;
  g.fillRect(d.x - 5, y - 5, 10, 10);
  g.fillRect(d.x - 8, y - 2, 16, 4);
  g.fillStyle = '#fff4b0';
  g.fillRect(d.x - 2, y - 7, 4, 3);
  g.strokeStyle = d.part.levelReward ? '#ffd700' : '#3cf7ff';
  g.lineWidth = 1;
  g.strokeRect(d.x - 11, y - 11, 22, 22);
  if (d.part.bossLoot) {
    g.fillStyle = d.part.levelReward ? '#ffd700' : '#3cf7ff';
    g.font = '700 9px Arial, sans-serif';
    g.textAlign = 'center';
    g.fillText(d.part.levelReward ? 'CLAVE' : 'APOYO', d.x, y - 18);
  }
}
function healthBar(x, y, width, height, pct) {
  g.fillStyle = '#0a0a0f';
  g.fillRect(x, y, width, height);
  g.fillStyle = pct > 0.45 ? '#00ff88' : '#8b0000';
  g.fillRect(x, y, width * Math.max(0, pct), height);
}

function drawBuildGraph() {
  const dpr = Number(buildCanvas.dataset.dpr || 1);
  const cw = buildCanvas.width / dpr,
    ch = buildCanvas.height / dpr;
  bg.setTransform(dpr, 0, 0, dpr, 0, 0);
  bg.clearRect(0, 0, cw, ch);
  buildGraphHitNodes = [];
  buildGraphSlotTargets = [];
  bg.save();
  const pulse = (Math.sin(tick * 0.08) + 1) * 0.5;
  bg.font = '700 12px Arial, sans-serif';
  bg.textAlign = 'left';
  bg.fillStyle = '#ffd700';
  bg.fillText('Inventario disponible', 10, 17);
  bg.strokeStyle = 'rgba(118,90,136,.55)';
  bg.lineWidth = 1;
  bg.beginPath();
  bg.moveTo(0, 44);
  bg.lineTo(cw, 44);
  bg.stroke();
  const shelfCount = Math.min(6, Math.max(3, Math.floor(cw / 58)));
  const shelfParts = player.inventory.slice(0, shelfCount);
  const shelfGap = cw / Math.max(1, shelfParts.length + 1);
  shelfParts.forEach((part, i) => {
    const dragged = buildGraphDrag && buildGraphDrag.part.id === part.id;
    const x = dragged ? buildGraphDrag.x : shelfGap * (i + 1);
    const y = dragged ? buildGraphDrag.y : 27 + Math.sin(tick * 0.06 + i) * 3;
    const r = dragged ? 16 : 13 + Math.sin(tick * 0.08 + i) * 1.4;
    buildGraphHitNodes.push({ x, y, r: r + 6, part });
    const hovered = buildGraphHover === part.id;
    bg.globalAlpha = dragged ? 0.68 : 1;
    bg.fillStyle = hovered || dragged ? 'rgba(255,215,0,.18)' : 'rgba(0,255,136,.08)';
    bg.beginPath();
    bg.arc(x, y, r + 5, 0, Math.PI * 2);
    bg.fill();
    bg.fillStyle = part.color;
    bg.beginPath();
    bg.arc(x, y, r, 0, Math.PI * 2);
    bg.fill();
    bg.strokeStyle = hovered || dragged ? '#ffd700' : '#00ff88';
    bg.lineWidth = hovered || dragged ? 3 : 2;
    bg.stroke();
    bg.globalAlpha = 1;
    bg.fillStyle = '#050508';
    bg.font = '700 10px Arial, sans-serif';
    bg.textAlign = 'center';
    bg.fillText(slotLabel[part.slot], x, y + 3);
    bg.fillStyle = '#e8e0d0';
    bg.font = '10px Arial, sans-serif';
    bg.fillText(partEs[part.name].split(' ')[0], x, y + 25);
  });
  if (!shelfParts.length) {
    bg.fillStyle = '#7d748d';
    bg.font = '11px Arial, sans-serif';
    bg.textAlign = 'center';
    bg.fillText('sin piezas fuera del cuerpo', cw / 2, 31);
  }
  const pos = {
    Head: { x: cw * 0.5, y: ch * 0.36 },
    Chest: { x: cw * 0.5, y: ch * 0.56 },
    LArm: { x: cw * 0.3, y: ch * 0.55 },
    RArm: { x: cw * 0.7, y: ch * 0.55 },
    LHand: { x: cw * 0.15, y: ch * 0.62 },
    RHand: { x: cw * 0.85, y: ch * 0.62 },
    Legs: { x: cw * 0.5, y: ch * 0.72 },
    LLeg: { x: cw * 0.34, y: ch * 0.88 },
    RLeg: { x: cw * 0.66, y: ch * 0.88 },
  };
  const visualEdges = [
    ['Head', 'Chest'],
    ['Chest', 'LArm'],
    ['Chest', 'RArm'],
    ['LArm', 'LHand'],
    ['RArm', 'RHand'],
    ['Chest', 'Legs'],
    ['Legs', 'LLeg'],
    ['Legs', 'RLeg'],
  ];
  bg.lineCap = 'round';
  bg.strokeStyle = 'rgba(232,224,208,.18)';
  bg.lineWidth = 6;
  for (const [a, b] of visualEdges) {
    bg.beginPath();
    bg.moveTo(pos[a].x, pos[a].y);
    bg.lineTo(pos[b].x, pos[b].y);
    bg.stroke();
  }
  const activePath = player.combos.has('Berserker') ? new Set(['RArm-Chest', 'Chest-Legs']) : new Set();
  const mst = kruskalOptimalBuild();
  const mstEdges = new Set(mst.map(e => edgeKey(e.a, e.b)));
  for (const e of mst) {
    const shelfNode = buildGraphHitNodes.find(n => n.part.name === e.part);
    if (!shelfNode) continue;
    bg.strokeStyle = 'rgba(255,215,0,.25)';
    bg.setLineDash([3, 5]);
    bg.lineWidth = 2;
    bg.beginPath();
    bg.moveTo(shelfNode.x, shelfNode.y + shelfNode.r);
    bg.lineTo(pos[e.a].x, pos[e.a].y - 18);
    bg.stroke();
  }
  for (const e of mst) {
    bg.strokeStyle = 'rgba(255,215,0,.82)';
    bg.setLineDash([7, 5]);
    bg.lineWidth = 4;
    bg.beginPath();
    bg.moveTo(pos[e.a].x, pos[e.a].y);
    bg.lineTo(pos[e.b].x, pos[e.b].y);
    bg.stroke();
    drawFlowDot(bg, pos[e.a], pos[e.b], '#ffd700', tick * 0.018 + e.weight * 0.07);
  }
  bg.setLineDash([]);
  for (const [a, edges] of buildGraph)
    for (const b of edges)
      if (a < b) {
        const key = activePath.has(`${a}-${b}`) || activePath.has(`${b}-${a}`);
        const inMst = mstEdges.has(edgeKey(a, b));
        bg.strokeStyle = key ? '#ffd700' : inMst ? '#00ff88' : '#7b4e98';
        bg.lineWidth = key ? 6 : inMst ? 4 : 2;
        bg.beginPath();
        bg.moveTo(pos[a].x, pos[a].y);
        bg.lineTo(pos[b].x, pos[b].y);
        bg.stroke();
        drawFlowDot(bg, pos[a], pos[b], key ? '#ffd700' : '#00ff88', tick * 0.025 + a.length * 0.1);
        if (key) {
          bg.strokeStyle = 'rgba(255,215,0,.22)';
          bg.lineWidth = 11;
          bg.beginPath();
          bg.moveTo(pos[a].x, pos[a].y);
          bg.lineTo(pos[b].x, pos[b].y);
          bg.stroke();
        }
      }
  for (const n of SLOT_NAMES) {
    const p = pos[n],
      equipped = isSlotEquipped(n);
    const part = player.equipped[n];
    const canDrop = buildGraphDrag && buildGraphDrag.part.slot === n;
    buildGraphSlotTargets.push({ slot: n, x: p.x, y: p.y, r: n === 'Chest' ? 25 : 21 });
    const nodePulse = equipped ? 1 + pulse * 3 : 0;
    bg.fillStyle = canDrop ? 'rgba(255,215,0,.22)' : equipped ? part.color : 'rgba(5,5,8,.86)';
    bg.beginPath();
    if (n === 'Chest') bg.rect(p.x - 18 - nodePulse * 0.25, p.y - 15 - nodePulse * 0.25, 36 + nodePulse * 0.5, 30 + nodePulse * 0.5);
    else bg.arc(p.x, p.y, (n === 'Head' ? 18 : 15) + nodePulse * 0.3, 0, Math.PI * 2);
    bg.fill();
    bg.strokeStyle = canDrop ? '#ffd700' : equipped ? '#00ff88' : '#6d6680';
    bg.setLineDash(equipped ? [] : [4, 4]);
    bg.lineWidth = 2;
    bg.stroke();
    bg.setLineDash([]);
    bg.fillStyle = equipped ? '#050508' : '#6d6680';
    bg.font = '700 11px Arial, sans-serif';
    bg.textAlign = 'center';
    bg.fillText(slotLabel[n], p.x, p.y + 4);
    bg.fillStyle = equipped ? '#e8e0d0' : '#7d748d';
    bg.font = '11px Arial, sans-serif';
    bg.fillText(equipped ? partEs[part.name].split(' ')[0] : 'vacio', p.x, p.y + 29);
  }
  for (const n of ['LLeg', 'RLeg']) {
    const p = pos[n];
    bg.fillStyle = 'rgba(5,5,8,.72)';
    bg.beginPath();
    bg.arc(p.x, p.y, 13, 0, Math.PI * 2);
    bg.fill();
    bg.strokeStyle = isSlotEquipped('Legs') ? '#00ff88' : '#6d6680';
    bg.lineWidth = 2;
    bg.stroke();
  }
  if (buildGraphDrag) {
    const target = buildGraphSlotTargets.find(t => t.slot === buildGraphDrag.part.slot);
    if (target) {
      bg.strokeStyle = 'rgba(255,215,0,.5)';
      bg.setLineDash([5, 5]);
      bg.lineWidth = 2;
      bg.beginPath();
      bg.moveTo(buildGraphDrag.x, buildGraphDrag.y);
      bg.lineTo(target.x, target.y);
      bg.stroke();
      bg.setLineDash([]);
    }
  }
  bg.restore();
  const adjacency = SLOT_NAMES.map(
    n =>
      `${slotEs[n]} -> [${buildGraph
        .get(n)
        .map(x => slotEs[x])
        .join(', ')}]`,
  ).join('\n');
  const mstText = mst.length
    ? mst.map(e => `${slotEs[e.a]}-${slotEs[e.b]} (${partEs[e.part]})`).join('\n')
    : 'sin arbol: faltan piezas candidatas';
  if (tick % 12 === 0)
    document.getElementById('adjList').textContent =
      `Cuerpo = grafo/arbol de build\nLista de adyacencia:\n${adjacency}\n\nKruskal MST sugerido:\n${mstText}`;
}

function edgeKey(a, b) {
  return [a, b].sort().join('-');
}

function drawFlowDot(ctx, a, b, color, phase) {
  const t = phase - Math.floor(phase);
  const x = a.x + (b.x - a.x) * t;
  const y = a.y + (b.y - a.y) * t;
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(x, y, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawMapGraph() {
  const dpr = Number(mapCanvas.dataset.dpr || 1);
  const cw = mapCanvas.width / dpr,
    ch = mapCanvas.height / dpr;
  mg.setTransform(dpr, 0, 0, dpr, 0, 0);
  mg.clearRect(0, 0, cw, ch);
  const pos = levels.map((level, i) => ({
    x: cw * (0.18 + (i % 2) * 0.62),
    y: ch * (0.18 + Math.floor(i / 2) * 0.52),
    level,
    index: i + 1,
  }));
  for (let i = 0; i < pos.length - 1; i++) {
    const a = pos[i],
      b = pos[i + 1];
    const unlocked = stolenRewards.has(a.level.reward) || wave > a.index;
    mg.strokeStyle = unlocked ? '#00ff88' : '#3d2a4f';
    mg.lineWidth = unlocked ? 4 : 2;
    mg.beginPath();
    mg.moveTo(a.x, a.y);
    mg.lineTo(b.x, b.y);
    mg.stroke();
    mg.fillStyle = unlocked ? '#00ff88' : '#6d6680';
    mg.font = '10px Segoe UI, Arial, sans-serif';
    mg.textAlign = 'center';
    mg.fillText(partEs[a.level.reward], (a.x + b.x) / 2, (a.y + b.y) / 2 - 5);
  }
  for (const n of pos) {
    const completed = wave > n.index || stolenRewards.has(n.level.reward);
    const active = wave === n.index;
    const locked = wave < n.index;
    mg.fillStyle = active ? 'rgba(255,215,0,.24)' : completed ? 'rgba(0,255,136,.16)' : 'rgba(255,255,255,.04)';
    mg.beginPath();
    mg.arc(n.x, n.y, 24, 0, Math.PI * 2);
    mg.fill();
    mg.beginPath();
    mg.arc(n.x, n.y, 15, 0, Math.PI * 2);
    mg.fillStyle = active ? '#ffd700' : completed ? '#00ff88' : locked ? '#111018' : '#3cf7ff';
    mg.fill();
    mg.strokeStyle = active ? '#ffd700' : completed ? '#00ff88' : '#6d6680';
    mg.lineWidth = 2;
    mg.stroke();
    mg.fillStyle = locked ? '#6d6680' : '#050508';
    mg.font = '700 11px Segoe UI, Arial, sans-serif';
    mg.textAlign = 'center';
    mg.fillText(`N${n.index}`, n.x, n.y + 4);
    mg.fillStyle = active ? '#ffd700' : completed ? '#00ff88' : '#e8e0d0';
    mg.font = '10px Segoe UI, Arial, sans-serif';
    mg.fillText(n.level.bossName, n.x, n.y + 32);
  }
  const objective = awaitingBossReward
    ? `Botin jefe: clave ${partEs[currentLevel().reward]} + apoyo ${partEs[currentLevel().sideReward]}`
    : boss
      ? `Derrotar jefe: ${currentLevel().bossName}`
      : `Limpiar enemigos: ${currentLevel()?.name || 'Final'}`;
  const gates = levels
    .map((level, i) => `N${i + 1}->${i + 2}: ${stolenRewards.has(level.reward) || wave > i + 1 ? 'ABIERTO' : partEs[level.reward]}`)
    .slice(0, -1);
  document.getElementById('distTable').textContent = `Grafo de progresion:\n${objective}\n${gates.join('\n')}`;
}

function updateHud() {
  document.getElementById('hp').textContent = `HP ${Math.ceil(player.hp)}/${player.maxHp}`;
  const hpPct = clamp(player.hp / player.maxHp, 0, 1);
  const hpFill = document.getElementById('hpFill');
  const hpText = document.getElementById('hpText');
  if (hpFill && hpText) {
    hpFill.style.width = `${hpPct * 100}%`;
    hpFill.style.background =
      hpPct > 0.55
        ? 'linear-gradient(90deg, #0fa65c, #00ff88)'
        : hpPct > 0.25
          ? 'linear-gradient(90deg, #ffd700, #ff8a00)'
          : 'linear-gradient(90deg, #8b0000, #ff2a2a)';
    hpText.textContent = `VIDA ${Math.ceil(player.hp)} / ${player.maxHp}`;
  }
  document.getElementById('atk').textContent = `ATK ${player.atk}`;
  document.getElementById('def').textContent = `DEF ${player.def}`;
  document.getElementById('spd').textContent = `SPD ${player.spd}`;
  document.getElementById('wave').textContent = `NIVEL ${Math.min(wave, levels.length)}`;
  document.getElementById('room').textContent = roomEs[player.room];
  document.getElementById('combo').textContent = `COMBO ${player.combos.size}`;
  document.getElementById('boss').textContent = boss ? `JEFE ${wave}` : awaitingBossReward ? 'BOTIN' : 'JEFE --';
  document.getElementById('msg').textContent = hudMessage;
}

function finish(success, endingType) {
  if (success) {
    choosingBossReward = false;
    document.getElementById('bossChoice').classList.remove('show');
    won = true;
    document.getElementById('win').classList.add('show');
    if (endingType === 'redemption') {
      document.getElementById('winStats').textContent =
        `El Consejo será tu siguiente objetivo. Conservas la pechera como carga y la verdad como arma.`;
    } else if (endingType === 'judgement') {
      document.getElementById('winStats').textContent =
        `Rompes la pechera y aceptas juicio. Caminas sin equipo, sin órdenes, con la verdad como única carga.`;
    } else {
      document.getElementById('winStats').textContent =
        `Escapaste tras ${cycleRun} ciclo(s). Historial: ${traversalHistory.slice(-18).join(' | ') || 'ninguno'}`;
    }
  } else {
    gameOver = true;
    const nodes = SLOT_NAMES.filter(isSlotEquipped).length;
    const edges = [...buildGraph.values()].reduce((sum, a) => sum + a.length, 0) / 2;
    document.getElementById('death').classList.add('show');
    document.getElementById('deathStats').textContent =
      `Tu grafo tuvo ${nodes} nodos, ${edges} aristas y ${player.combos.size} combos activos.`;
  }
}

function rand(a, b) {
  return a + Math.random() * (b - a);
}
function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}
addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (['w', 'a', 's', 'd', ' ', 'i', 'e', 'r', '1', '2', 'p'].includes(k)) e.preventDefault();
  if (k === 'p') {
    togglePause();
    return;
  }
  keys.add(k);
});
addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));
function canvasPointer(e) {
  const rect = buildCanvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function buildGraphNodeAt(x, y) {
  let hit = buildGraphHitNodes.find(n => Math.hypot(n.x - x, n.y - y) <= n.r);
  if (!hit && y <= 52 && buildGraphHitNodes.length) {
    hit = buildGraphHitNodes.reduce((best, n) => {
      const d = Math.hypot(n.x - x, n.y - y);
      return !best || d < best.d ? { node: n, d } : best;
    }, null)?.node;
  }
  return hit || null;
}

function buildGraphSlotAt(x, y, part) {
  return buildGraphSlotTargets.find(t => t.slot === part.slot && Math.hypot(t.x - x, t.y - y) <= t.r + 10) || null;
}

buildCanvas.addEventListener('pointerdown', e => {
  const p = canvasPointer(e);
  const hit = buildGraphNodeAt(p.x, p.y);
  if (!hit) return;
  e.preventDefault();
  buildCanvas.setPointerCapture?.(e.pointerId);
  buildGraphDrag = { part: hit.part, x: p.x, y: p.y, dx: hit.x - p.x, dy: hit.y - p.y };
  buildGraphHover = hit.part.id;
  log(`Arrastrando nodo: ${partEs[hit.part.name]} -> ${slotEs[hit.part.slot]}`);
});
function moveBuildGraphPointer(e) {
  const p = canvasPointer(e);
  if (buildGraphDrag) {
    buildGraphDrag.x = p.x + buildGraphDrag.dx;
    buildGraphDrag.y = p.y + buildGraphDrag.dy;
  }
  const hit = buildGraphNodeAt(p.x, p.y);
  buildGraphHover = hit ? hit.part.id : null;
  buildCanvas.style.cursor = buildGraphDrag ? 'grabbing' : hit ? 'grab' : 'default';
}
buildCanvas.addEventListener('mousemove', moveBuildGraphPointer);
buildCanvas.addEventListener('pointermove', moveBuildGraphPointer);
buildCanvas.addEventListener('pointerup', e => {
  if (!buildGraphDrag) return;
  const p = canvasPointer(e);
  const part = buildGraphDrag.part;
  const target = buildGraphSlotAt(p.x, p.y, part);
  buildGraphDrag = null;
  buildGraphHover = null;
  if (target) {
    equipPart(part);
    log(`Nodo insertado en cuerpo/grafo: ${partEs[part.name]} conectado como ${slotEs[part.slot]}`);
  } else {
    log(`Nodo no insertado: ${partEs[part.name]} volvio al inventario`);
  }
});
buildCanvas.addEventListener('pointerleave', () => {
  if (buildGraphDrag) {
    log(`Arrastre cancelado: ${partEs[buildGraphDrag.part.name]}`);
    buildGraphDrag = null;
  }
  buildGraphHover = null;
  buildCanvas.style.cursor = 'default';
});
document.getElementById('stealRelic').addEventListener('click', chooseRedemption);
document.getElementById('leaveForge').addEventListener('click', chooseJudgement);
document.getElementById('musicBtn').addEventListener('click', toggleMusic);
document.getElementById('pauseBtn').addEventListener('click', togglePause);

function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (paused) {
    draw();
    requestAnimationFrame(loop);
    return;
  }
  update(dt);
  requestAnimationFrame(loop);
}

async function startGame() {
  resize();
  drawLoadingScreen(0.12);
  let done = 0;
  await Promise.all(
    assetLoads.map(p =>
      p.then(() => {
        done++;
        drawLoadingScreen(done / Math.max(1, assetLoads.length));
      }),
    ),
  );
  assetsReady = true;
  placePlayerOnPath(150);
  player.inventory.push(makePart('Skull'), makePart('Bone Arm'));
  equipPart(player.inventory[0]);
  spawnWave();
  gameStarted = true;
  last = performance.now();
  log('Estructuras activas: Map dungeonGraph/buildGraph, Set de combos, PriorityQueue para Dijkstra');
  log('Algoritmos listos: Dijkstra enemigos, BFS jefe, DFS ciclos, Kruskal inventario');
  requestAnimationFrame(loop);
}

resize();
drawLoadingScreen(0.05);
startGame();

const PALETTE = {
  Y: '#f7c531',
  y: '#d99a1e',
  S: '#f2c29b',
  s: '#d9a07a',
  E: '#1d1d2b',
  H: '#5a3825',
  O: '#f26b1d',
  W: '#ffffff',
  B: '#2f5aa8',
  b: '#22427d',
  K: '#4a2f1d',
  C: '#3d7bd9',
  c: '#2a5aa6',
  G: '#4cbb3a',
  g: '#2f8a2a',
  T: '#8a5a2b',
  t: '#6b4220',
  P: '#ff7eb6',
  L: '#d6e8f7',
  D: '#1f2a44',
  R: '#c06a35',
  r: '#8f4a22',
  q: '#d98a52',
  N: '#9aa1ad',
  n: '#666d79',
  m: '#bcc2cc',
  Q: '#6ec3ff',
};

const HERO_HEAD = [
  '....yYYYYy....',
  '...yYYYYYYy...',
  '...yYYYYYYYYY.',
  '....HSSSSSS...',
  '....HSSSESS...',
  '....HSSSSSS...',
  '.....sSSSs....',
];

const HERO_HEAD_HAPPY = [
  '....yYYYYy....',
  '...yYYYYYYy...',
  '...yYYYYYYYYY.',
  '....HSSSSSS...',
  '....HSSSESS...',
  '....HSSSSSE...',
  '.....sSEEs....',
];

const HERO_HEAD_WORRIED = [
  '....yYYYYy....',
  '...yYYYYYYy...',
  '...yYYYYYYYYY.',
  '....HSSSSSSQ..',
  '....HSSSESSQ..',
  '....HSSSSSS...',
  '.....sSESs....',
];

const CRACK = [
  '.....D..............',
  '....D.D........D....',
  '...D...D......D.D...',
  '..D.....DD...D......',
  '.........D..D.......',
  '..........DD........',
  '...........D........',
  '...........D........',
];

const HERO_BODY = [
  '.ccCCOOOOO....',
  '.cCCCOWOOOS...',
  '.cCCCOWOOOS...',
  '.cCCCOOOOO....',
  '.cccCWWWWW....',
  '..cccOOOOO....',
  '.....BBBBB....',
  '.....BBbBB....',
];

const HERO_LEGS_STAND = [
  '.....BB.BB....',
  '.....BB.BB....',
  '.....bb.bb....',
  '....KKK.KKK...',
  '....KKK.KKK...',
];

const HERO_LEGS_STRIDE = [
  '....BB...BB...',
  '...BB.....BB..',
  '...bb.....bb..',
  '..KKK....KKK..',
  '..KKK....KKK..',
];

const HERO_LEGS_JUMP = [
  '.....BBBBB....',
  '....BB..BB....',
  '....bb..bb....',
  '...KKK..KKK...',
  '..............',
];

const CRATE = [
  'cccccccccc',
  'cWCCCCCCWc',
  'cCWCCCCWCc',
  'cCCCWWCCCc',
  'cCCCWWCCCc',
  'cCWCCCCWCc',
  'cWCCCCCCWc',
  'cccccccccc',
];

const CLOUD = [
  '.....WWWW.......',
  '...WWWWWWWW.....',
  '..WWWWWWWWWWW...',
  '.WWWWWWWWWWWWWW.',
  'WWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWW',
  '.LLLLLLLLLLLLLL.',
  '..LLLLLLLLLLLL..',
];

const TREE = [
  '.....GGGGGG.....',
  '...GGGGGGGGGG...',
  '..GGGgGGGGGGGG..',
  '.GGGGGGGGGgGGGG.',
  '.GGgGGGGGGGGGGG.',
  'GGGGGGGGGGGGGGGG',
  'GGGGGGgGGGGGgGGG',
  'GGgGGGGGGGGGGGGG',
  '.GGGGGGGGGGGGGG.',
  '.ggGGGGGGGGGGgg.',
  '..gggGGGGGGggg..',
  '....gggggggg....',
  '.......TT.......',
  '.......TT.......',
  '......TTTT......',
  '......TtTT......',
  '.....TTTTTT.....',
];

const BUSH = [
  '...GGGGG....',
  '.GGGGgGGGG..',
  'GGGgGGGGGGG.',
  'GGGGGGGGgGGG',
  'gggggggggggg',
];

const FLOWER = [
  '.P.P.',
  'PPYPP',
  '.PPP.',
  '..g..',
  '.gg..',
  '..g..',
];

const BIRD = [
  'D...D',
  '.D.D.',
  '..D..',
];

const GRASS_TILE = [
  '..G....G...G..G.',
  '.GGG..GGG.GGGGGG',
  'GGGGGGGGGGGGGGGG',
  'GGgGGGGGGGgGGGGG',
  'GGGGGgGGGGGGGgGG',
  'gGGGGGGGGGGGGGGg',
  'ggGgggGGgggGgggg',
  'gggggggggggggggg',
];

const DIRT_TILE = [
  'rrrrrrrrrrrrrrrr',
  'RRRRRRRrRRRRRRRR',
  'RqRRRRRrRRRqRRRR',
  'RRRRRRRrRRRRRRRR',
  'RRRRRRRrRRRRRRqR',
  'RRRqRRRrRRRRRRRR',
  'RRRRRRRrRRRRRRRR',
  'RRRRRRRrRRRRRRRR',
  'rrrrrrrrrrrrrrrr',
  'RRRRRRRRRRRRRRRr',
  'RRRRqRRRRRRRRRRr',
  'RRRRRRRRRRRqRRRr',
  'RRRRRRRRRRRRRRRr',
  'RqRRRRRRRRRRRRRr',
  'RRRRRRRRRqRRRRRr',
  'RRRRRRRRRRRRRRRr',
];

const STONE_TILE = [
  'mmmmmmmnmmmmmmmn',
  'mNNNNNNnmNNNNNNn',
  'mNNNNNNnmNNNNNNn',
  'mNNNNNNnmNNNNNNn',
  'mNNNNNNnmNNNNNNn',
  'mNNNNNNnmNNNNNNn',
  'mNNNNNNnmNNNNNNn',
  'nnnnnnnnnnnnnnnn',
  'mmmnmmmmmmmnmmmm',
  'NNNnmNNNNNNnmNNN',
  'NNNnmNNNNNNnmNNN',
  'NNNnmNNNNNNnmNNN',
  'NNNnmNNNNNNnmNNN',
  'NNNnmNNNNNNnmNNN',
  'NNNnmNNNNNNnmNNN',
  'nnnnnnnnnnnnnnnn',
];

const PARACHUTE_WIDTH = 24;
const PARACHUTE_HEIGHT = 18;
const CANOPY_HEIGHT = 8;
const STRING_COLOR = '#3b3b4f';
const PARACHUTE_STRINGS = [[1, 9], [7, 10], [16, 13], [22, 14]];

const cache = new Map();

const createCanvas = (width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return { canvas, context: canvas.getContext('2d') };
};

const paintRows = (context, rows, palette) => {
  rows.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      const color = palette[cell];
      if (color) {
        context.fillStyle = color;
        context.fillRect(x, y, 1, 1);
      }
    });
  });
};

const makeSprite = (key, rows, palette = PALETTE) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  const { canvas, context } = createCanvas(rows[0].length, rows.length);
  paintRows(context, rows, palette);
  const sprite = { url: canvas.toDataURL(), width: canvas.width, height: canvas.height };
  cache.set(key, sprite);
  return sprite;
};

const isInsideCanopy = (x, y) => {
  const dx = (x + 0.5 - PARACHUTE_WIDTH / 2) / (PARACHUTE_WIDTH / 2);
  const dy = (CANOPY_HEIGHT - (y + 0.5)) / CANOPY_HEIGHT;
  return dx * dx + dy * dy <= 1;
};

const paintCanopy = (context, color) => {
  for (let y = 0; y < CANOPY_HEIGHT; y += 1) {
    for (let x = 0; x < PARACHUTE_WIDTH; x += 1) {
      if (isInsideCanopy(x, y)) {
        context.fillStyle = Math.floor(x / 4) % 2 === 0 ? color : '#ffffff';
        context.fillRect(x, y, 1, 1);
      }
    }
  }
};

const paintStrings = (context) => {
  const span = PARACHUTE_HEIGHT - 1 - CANOPY_HEIGHT;
  context.fillStyle = STRING_COLOR;
  PARACHUTE_STRINGS.forEach(([fromX, toX]) => {
    for (let y = CANOPY_HEIGHT; y < PARACHUTE_HEIGHT; y += 1) {
      const x = Math.round(fromX + ((toX - fromX) * (y - CANOPY_HEIGHT)) / span);
      context.fillRect(x, y, 1, 1);
    }
  });
};

const makeParachute = (color) => {
  const key = `parachute:${color}`;
  if (cache.has(key)) {
    return cache.get(key);
  }
  const { canvas, context } = createCanvas(PARACHUTE_WIDTH, PARACHUTE_HEIGHT);
  paintCanopy(context, color);
  paintStrings(context);
  const sprite = { url: canvas.toDataURL(), width: canvas.width, height: canvas.height };
  cache.set(key, sprite);
  return sprite;
};

const makeDisc = (key, size, fill, edge) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  const { canvas, context } = createCanvas(size, size);
  const radius = size / 2;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const distance = Math.hypot(x + 0.5 - radius, y + 0.5 - radius);
      if (distance <= radius) {
        context.fillStyle = distance > radius - 1.2 ? edge : fill;
        context.fillRect(x, y, 1, 1);
      }
    }
  }
  const sprite = { url: canvas.toDataURL(), width: size, height: size };
  cache.set(key, sprite);
  return sprite;
};

const WHITE_CRATE_PALETTE = { c: '#ffffff', W: '#ffffff' };
const STORM_CLOUD_PALETTE = { W: '#8593ab', L: '#5f6c85' };

const SPRITES = {
  heroIdle: makeSprite('hero:idle', [...HERO_HEAD, ...HERO_BODY, ...HERO_LEGS_STAND]),
  heroHappy: makeSprite('hero:happy', [...HERO_HEAD_HAPPY, ...HERO_BODY, ...HERO_LEGS_STAND]),
  heroWorried: makeSprite('hero:worried', [...HERO_HEAD_WORRIED, ...HERO_BODY, ...HERO_LEGS_STAND]),
  crack: makeSprite('crack', CRACK),
  stormCloud: makeSprite('cloud:storm', CLOUD, STORM_CLOUD_PALETTE),
  sun: makeDisc('sun', 14, '#ffd84a', '#f5a524'),
  moon: makeDisc('moon', 12, '#eef2ff', '#bcc6dc'),
  heroWalk: makeSprite('hero:walk', [...HERO_HEAD, ...HERO_BODY, ...HERO_LEGS_STRIDE]),
  heroJump: makeSprite('hero:jump', [...HERO_HEAD, ...HERO_BODY, ...HERO_LEGS_JUMP]),
  crate: makeSprite('crate', CRATE),
  crateIcon: makeSprite('crate:icon', CRATE, WHITE_CRATE_PALETTE),
  cloud: makeSprite('cloud', CLOUD),
  tree: makeSprite('tree', TREE),
  bush: makeSprite('bush', BUSH),
  flower: makeSprite('flower', FLOWER),
  bird: makeSprite('bird', BIRD),
  grassTile: makeSprite('tile:grass', GRASS_TILE),
  dirtTile: makeSprite('tile:dirt', DIRT_TILE),
  stoneTile: makeSprite('tile:stone', STONE_TILE),
};

export { SPRITES, makeParachute };

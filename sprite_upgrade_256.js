/**
 * 256x256 Procedural Sprite Upgrade Pack
 * --------------------------------------
 * - 목적: 기존 16x16/64x64 스프라이트를 대체 가능한 256x256 프로시저럴(수동 알고리즘) 데이터로 생성
 * - 구조: 종족(10) × 폼(4) × 프레임(4: idle/walk/attack/hurt)
 * - 방식: 각 프레임은 IIFE로 계산되어 문자열 배열(256줄)로 저장
 *
 * 사용 예시:
 *   import { SPRITE_DATA_256, renderFrameToCanvas } from './sprite_upgrade_256.js';
 *   const frame = SPRITE_DATA_256['양서강'].forms[2].attack;
 *   renderFrameToCanvas(frame, SPRITE_DATA_256['양서강'].forms[2].palette, canvas, 1);
 */

const SIZE = 256;
const CENTER = SIZE / 2;

const DEFAULT_PALETTE = {
  '.': null,
  '1': '#365314', // main body shadow
  '2': '#4d7c0f', // main body
  '3': '#84cc16', // highlight
  '4': '#facc15', // accent / eye / horn
  '5': '#b91c1c', // attack accent
  '6': '#1f2937', // deep shadow
  '7': '#e5e7eb', // light detail
  '8': '#0ea5e9', // aquatic accent
  '9': '#7c3aed', // poison / energy
  a: '#fb923c',   // warm accent
  b: '#14b8a6',   // cool accent
  c: '#f472b6',   // rare accent
};

function createGrid(fill = '.') {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(fill));
}

function fillEllipse(grid, cx, cy, rx, ry, char) {
  const minY = Math.max(0, Math.floor(cy - ry));
  const maxY = Math.min(SIZE - 1, Math.ceil(cy + ry));
  const minX = Math.max(0, Math.floor(cx - rx));
  const maxX = Math.min(SIZE - 1, Math.ceil(cx + rx));
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      if ((dx * dx) + (dy * dy) <= 1) grid[y][x] = char;
    }
  }
}

function strokeLine(grid, x1, y1, x2, y2, thickness, char) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), 1);
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    fillEllipse(grid, x, y, thickness, thickness, char);
  }
}

function noiseStripe(grid, yStart, yEnd, amplitude, frequency, char) {
  for (let y = yStart; y <= yEnd; y += 1) {
    const wave = Math.sin((y / SIZE) * Math.PI * frequency) * amplitude;
    const start = Math.floor(CENTER - 38 + wave);
    const end = Math.floor(CENTER + 38 + wave);
    for (let x = start; x <= end; x += 1) {
      if (x >= 0 && x < SIZE && Math.random() > 0.55) grid[y][x] = char;
    }
  }
}

function finalize(grid) {
  return grid.map((row) => row.join(''));
}

function getPoseOffsets(frameName) {
  switch (frameName) {
    case 'walk':
      return { bodyShiftX: 6, bodyShiftY: 2, attackLean: 0, compress: 0.97 };
    case 'attack':
      return { bodyShiftX: 14, bodyShiftY: -4, attackLean: 1, compress: 0.95 };
    case 'hurt':
      return { bodyShiftX: -4, bodyShiftY: 10, attackLean: 0, compress: 0.87 };
    default:
      return { bodyShiftX: 0, bodyShiftY: 0, attackLean: 0, compress: 1 };
  }
}

/**
 * speciesProfile:
 * - archetype: mammal/reptile/bird/amphibian/fish/insect/spider/cephalopod/crustacean/protozoa
 * - motif: 고유 디테일 스타일
 */
function buildCreatureFrame(speciesProfile, formIndex, frameName) {
  const grid = createGrid('.');
  const pose = getPoseOffsets(frameName);
  const formScale = 1 + (formIndex * 0.1);

  const cx = CENTER + pose.bodyShiftX;
  const cy = CENTER + pose.bodyShiftY;

  const rx = 54 * formScale;
  const ry = (40 * formScale) * pose.compress;

  // 1) 몸통
  fillEllipse(grid, cx, cy, rx, ry, '2');
  fillEllipse(grid, cx - 8, cy + 10, rx * 0.75, ry * 0.7, '1');

  // 2) 머리
  fillEllipse(grid, cx + (35 + (formIndex * 8)), cy - 26, 24 * formScale, 22 * formScale, '3');

  // 3) 눈
  fillEllipse(grid, cx + 50 + (formIndex * 8), cy - 30, 4, 4, '7');
  fillEllipse(grid, cx + 53 + (formIndex * 8), cy - 30, 2, 2, '6');

  // 4) 등/하이라이트
  for (let i = 0; i < 5 + formIndex; i += 1) {
    const px = cx - 20 + (i * 14);
    const py = cy - 26 - (Math.sin(i * 0.8) * 5);
    fillEllipse(grid, px, py, 6, 5, '3');
  }

  // 5) 다리/지느러미/팔 기본 프레임
  strokeLine(grid, cx - 26, cy + 20, cx - 38, cy + 48, 4, '1');
  strokeLine(grid, cx + 8, cy + 22, cx - 2, cy + 50, 4, '1');
  strokeLine(grid, cx + 24, cy + 16, cx + 10, cy + 45, 4, '1');

  // 6) 꼬리
  strokeLine(grid, cx - 52, cy, cx - 92 - (formIndex * 8), cy - 10, 6, '2');
  strokeLine(grid, cx - 88 - (formIndex * 8), cy - 12, cx - 116 - (formIndex * 10), cy - 24, 5, '3');

  // 프레임 타입별 강조
  if (pose.attackLean) {
    strokeLine(grid, cx + 52, cy - 18, cx + 90, cy - 30, 5, '5');
    fillEllipse(grid, cx + 95, cy - 31, 8, 8, '4');
  }
  if (frameName === 'hurt') {
    strokeLine(grid, cx - 24, cy - 8, cx + 16, cy + 18, 2, '9');
    strokeLine(grid, cx - 14, cy - 12, cx + 24, cy + 12, 2, '9');
  }

  // 종족별 아키타입 디테일
  switch (speciesProfile.archetype) {
    case 'mammal':
      fillEllipse(grid, cx + 42, cy - 46, 8, 10, '4'); // 귀
      fillEllipse(grid, cx + 26, cy - 44, 8, 10, '4');
      noiseStripe(grid, Math.floor(cy - 8), Math.floor(cy + 16), 6 + formIndex, 4, 'a'); // 갈기 느낌
      break;
    case 'reptile':
      for (let i = 0; i < 10 + formIndex; i += 1) {
        fillEllipse(grid, cx - 18 + (i * 10), cy - 32 - (i % 2 ? 4 : -2), 5, 4, '4');
      }
      strokeLine(grid, cx + 46, cy - 30, cx + 86, cy - 54, 3 + formIndex, '4'); // 뿔
      break;
    case 'bird':
      strokeLine(grid, cx - 8, cy - 10, cx - 76, cy - 38, 7 + formIndex, '7');
      strokeLine(grid, cx + 4, cy - 8, cx - 62, cy + 24, 6 + formIndex, '7');
      strokeLine(grid, cx + 62, cy - 20, cx + 86, cy - 26, 3, '4'); // 부리
      break;
    case 'amphibian':
      fillEllipse(grid, cx + 42, cy - 42, 10, 10, '8');
      fillEllipse(grid, cx + 24, cy - 42, 10, 10, '8');
      if (formIndex >= 1) noiseStripe(grid, Math.floor(cy - 20), Math.floor(cy + 24), 8, 7, '9'); // 독무늬
      if (formIndex >= 2) for (let i = 0; i < 5; i += 1) fillEllipse(grid, cx - 10 + (i * 15), cy - 34, 3, 7, '5'); // 독침
      break;
    case 'fish':
      strokeLine(grid, cx - 22, cy - 10, cx - 76, cy - 42, 8 + formIndex, '8');
      strokeLine(grid, cx - 14, cy + 8, cx - 74, cy + 40, 8 + formIndex, '8');
      for (let i = 0; i < 12; i += 1) fillEllipse(grid, cx - 20 + (i * 8), cy + (i % 2 ? 6 : -4), 3, 3, '7');
      break;
    case 'insect':
      fillEllipse(grid, cx - 24, cy, 24, 20, '1');
      fillEllipse(grid, cx + 20, cy, 22, 18, '3');
      strokeLine(grid, cx + 42, cy - 36, cx + 78, cy - 76, 3 + formIndex, '4'); // 뿔
      strokeLine(grid, cx + 28, cy - 36, cx + 56, cy - 82, 3 + formIndex, '4');
      break;
    case 'spider':
      for (let i = -3; i <= 3; i += 1) {
        strokeLine(grid, cx - 20, cy + (i * 6), cx - 78, cy + (i * 14), 3, '1');
        strokeLine(grid, cx + 20, cy + (i * 6), cx + 78, cy + (i * 14), 3, '1');
      }
      if (formIndex >= 1) fillEllipse(grid, cx, cy - 12, 18, 10, '9'); // 독무늬
      break;
    case 'cephalopod':
      fillEllipse(grid, cx, cy - 8, 52, 44, '8');
      for (let i = -4; i <= 4; i += 1) {
        strokeLine(grid, cx + (i * 10), cy + 16, cx + (i * 14), cy + 74, 5, '2');
        if (formIndex >= 1) fillEllipse(grid, cx + (i * 14), cy + 70, 4, 4, '7'); // 흡반 강화
      }
      if (formIndex >= 2) noiseStripe(grid, Math.floor(cy - 12), Math.floor(cy + 36), 10, 5, '6'); // 먹물 느낌
      break;
    case 'crustacean':
      fillEllipse(grid, cx, cy, 58, 38, '2');
      strokeLine(grid, cx + 32, cy - 10, cx + 94, cy - 38, 10 + formIndex, '4');
      strokeLine(grid, cx + 30, cy + 10, cx + 92, cy + 38, 10 + formIndex, '4');
      for (let i = -3; i <= 3; i += 1) strokeLine(grid, cx - 10, cy + (i * 8), cx - 54, cy + (i * 14), 3, '1');
      break;
    case 'protozoa':
      for (let i = 0; i < 14 + (formIndex * 2); i += 1) {
        const angle = (Math.PI * 2 * i) / (14 + (formIndex * 2));
        const px = cx + Math.cos(angle) * (58 + Math.sin(i) * 8);
        const py = cy + Math.sin(angle) * (44 + Math.cos(i * 0.7) * 8);
        strokeLine(grid, cx, cy, px, py, 2, 'b'); // 위족/세포 돌기
      }
      fillEllipse(grid, cx, cy, 24, 20, '9'); // 핵
      break;
    default:
      break;
  }

  return finalize(grid);
}

const SPECIES_LIST = [
  { key: '원시종', archetype: 'protozoa', color: '#14b8a6' },
  { key: '포유강', archetype: 'mammal', color: '#a16207' },
  { key: '파충강', archetype: 'reptile', color: '#16a34a' },
  { key: '조강', archetype: 'bird', color: '#0284c7' },
  { key: '양서강', archetype: 'amphibian', color: '#65a30d' },
  { key: '조기어강', archetype: 'fish', color: '#0891b2' },
  { key: '곤충강', archetype: 'insect', color: '#ca8a04' },
  { key: '거미강', archetype: 'spider', color: '#7c3aed' },
  { key: '두족강', archetype: 'cephalopod', color: '#0f766e' },
  { key: '갑각강', archetype: 'crustacean', color: '#dc2626' },
];

function buildForm(speciesProfile, formIndex) {
  const palette = { ...DEFAULT_PALETTE };
  return {
    idle: (() => buildCreatureFrame(speciesProfile, formIndex, 'idle'))(),
    walk: (() => buildCreatureFrame(speciesProfile, formIndex, 'walk'))(),
    attack: (() => buildCreatureFrame(speciesProfile, formIndex, 'attack'))(),
    hurt: (() => buildCreatureFrame(speciesProfile, formIndex, 'hurt'))(),
    palette,
    color: speciesProfile.color,
    meta: {
      resolution: `${SIZE}x${SIZE}`,
      form: formIndex,
      archetype: speciesProfile.archetype,
    },
  };
}

export const SPRITE_DATA_256 = SPECIES_LIST.reduce((acc, species) => {
  acc[species.key] = {
    forms: [0, 1, 2, 3].map((formIndex) => buildForm(species, formIndex)),
  };
  return acc;
}, {});

/**
 * 렌더러 (256x256 문자열 프레임 -> Canvas)
 * @param {string[]} frame 256줄 문자열
 * @param {Record<string, string|null>} palette 문자-색상 매핑
 * @param {HTMLCanvasElement} canvas 타깃 캔버스
 * @param {number} scale 1이면 256x256 그대로, 0.5면 128x128
 */
export function renderFrameToCanvas(frame, palette, canvas, scale = 1) {
  if (!canvas || !frame || frame.length !== SIZE) return;

  const px = Math.max(1, Math.floor(scale));
  canvas.width = SIZE * px;
  canvas.height = SIZE * px;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < SIZE; y += 1) {
    const row = frame[y];
    for (let x = 0; x < SIZE; x += 1) {
      const code = row[x];
      const color = palette[code];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x * px, y * px, px, px);
    }
  }
}

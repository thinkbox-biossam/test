import { SolarSystemMarbleGame } from './js/game.js';

// 게임 인스턴스
let game = null;

// 브라우저 호환성 체크
function checkBrowserCompatibility() {
    const issues = [];
    
    if (!window.requestAnimationFrame) {
        issues.push('requestAnimationFrame 지원 안됨');
    }
    
    if (!document.querySelector) {
        issues.push('querySelector 지원 안됨');
    }
    
    if (!window.addEventListener) {
        issues.push('addEventListener 지원 안됨');
    }
    
    // ES6 모듈 지원 확인
    if (!window.Symbol) {
        issues.push('ES6 Symbol 지원 안됨');
    }
    
    // Canvas 지원 확인
    const testCanvas = document.createElement('canvas');
    if (!testCanvas.getContext) {
        issues.push('Canvas 지원 안됨');
    }
    
    if (issues.length > 0) {
        console.error('❌ 브라우저 호환성 문제:', issues);
        return false;
    }
    
    console.log('✅ 브라우저 호환성 확인 완료');
    return true;
}

// DOM이 로드되면 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM 로드 완료, 게임 초기화 시작...');
    
    // 브라우저 호환성 체크
    if (!checkBrowserCompatibility()) {
        alert('브라우저가 게임을 지원하지 않습니다. 최신 브라우저를 사용해주세요.');
        return;
    }
    
    try {
        // 캔버스 확인
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            throw new Error('gameCanvas 요소를 찾을 수 없습니다');
        }
        
        console.log('🎮 캔버스 요소 확인됨:', canvas);
        console.log('📏 캔버스 크기:', canvas.width, 'x', canvas.height);
        
        // 게임 초기화
        console.log('🎯 게임 클래스 생성 중...');
        game = new SolarSystemMarbleGame('gameCanvas');
        
        console.log('✅ 태양계 알까기 v3 - 모듈화 버전이 시작되었습니다!');
        
        // 전역 게임 객체 설정 (디버깅용)
        window.game = game;
        
        // 추가 디버깅 정보
        console.log('🔍 게임 객체:', game);
        console.log('🎪 게임 상태:', game.gameStateManager?.currentState);
        
        // 간단한 클릭 테스트 추가
        canvas.addEventListener('click', (e) => {
            console.log('🖱️ [Direct] 캔버스 클릭 감지됨:', e);
        });
        
    } catch (error) {
        console.error('❌ 게임 초기화 중 오류 발생:', error);
        console.error('📍 오류 스택:', error.stack);
        
        // 오류 메시지 표시
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ff0000';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('게임 로딩 실패', canvas.width / 2, canvas.height / 2);
            ctx.font = '16px Arial';
            ctx.fillText('콘솔을 확인해주세요', canvas.width / 2, canvas.height / 2 + 30);
            ctx.fillText(error.message, canvas.width / 2, canvas.height / 2 + 60);
        }
        
        // 사용자에게 알림
        alert(`게임 로딩 실패: ${error.message}\n\n콘솔(F12)을 확인하여 자세한 오류를 확인하세요.`);
    }
});

// 페이지 언로드 시 게임 정리
window.addEventListener('beforeunload', () => {
    if (game) {
        game.destroy();
    }
});

// 개발자 도구용 유틸리티 함수들
window.gameUtils = {
    // 게임 재시작
    restart: () => {
        if (game) {
            game.restartGame();
        }
    },
    
    // 특정 게임 모드로 시작
    startMode: (mode) => {
        if (game) {
            game.startGame(mode);
        }
    },
    
    // 오디오 토글
    toggleAudio: () => {
        if (game) {
            const audioSystem = game.audioSystem;
            audioSystem.setEnabled(!audioSystem.isEnabled);
        }
    },
    
    // 게임 상태 출력
    getGameState: () => {
        if (game) {
            return {
                currentState: game.gameStateManager.currentState,
                gameMode: game.gameStateManager.gameMode,
                currentPlayer: game.gameStateManager.currentPlayer,
                curlingScores: game.gameStateManager.curlingScores,
                selectedPlanetIds: game.gameStateManager.selectedPlanetIds
            };
        }
        return null;
    },
    
    // 행성 정보 출력
    getPlanetsInfo: () => {
        if (game && game.gameStateManager.planets) {
            return game.gameStateManager.planets.map(planet => ({
                id: planet.id,
                name: planet.name,
                owner: planet.owner,
                active: planet.isActive,
                position: { x: planet.x, y: planet.y },
                velocity: { x: planet.vx, y: planet.vy },
                radius: planet.radius,
                mass: planet.mass
            }));
        }
        return [];
    },
    
    // 간단한 클릭 테스트
    testClick: () => {
        if (game) {
            const canvas = game.canvas;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            // 가상 클릭 이벤트 생성
            const fakeEvent = {
                clientX: centerX,
                clientY: centerY + 50, // 버튼 위치에 클릭
                preventDefault: () => {}
            };
            
            console.log('🧪 가상 클릭 테스트 실행...');
            game.handleClick(fakeEvent);
        }
    }
};

// 콘솔에 도움말 출력
console.log(`
🌟 태양계 알까기 v3 - 개발자 도구 🌟

사용 가능한 명령어:
- gameUtils.restart() : 게임 재시작
- gameUtils.startMode('marbles') : 알까기 모드로 시작
- gameUtils.startMode('curling') : 컬링 모드로 시작
- gameUtils.toggleAudio() : 오디오 토글
- gameUtils.getGameState() : 현재 게임 상태 확인
- gameUtils.getPlanetsInfo() : 행성 정보 확인
- gameUtils.testClick() : 가상 클릭 테스트

키보드 단축키:
- ESC : 메뉴로 돌아가기
- R : 게임 오버 시 재시작
- M : 음소거 토글

게임 객체는 window.game으로 접근 가능합니다.

🧪 테스트 방법:
1. 먼저 test-simple.html을 열어서 기본 클릭이 작동하는지 확인
2. 메인 게임에서 gameUtils.testClick()으로 가상 클릭 테스트
`);

// 주기율표 원소 데이터 (1-118번)
const ELEMENTS = {
    1: { symbol: "H", name: "수소", mass: 1.008, group: "비금속", period: 1, color: "#FF6B6B" },
    2: { symbol: "He", name: "헬륨", mass: 4.003, group: "비금속", period: 1, color: "#4ECDC4" },
    3: { symbol: "Li", name: "리튬", mass: 6.94, group: "금속", period: 2, color: "#45B7D1" },
    4: { symbol: "Be", name: "베릴륨", mass: 9.012, group: "금속", period: 2, color: "#96CEB4" },
    5: { symbol: "B", name: "붕소", mass: 10.81, group: "준금속", period: 2, color: "#FFEAA7" },
    6: { symbol: "C", name: "탄소", mass: 12.011, group: "비금속", period: 2, color: "#DDA0DD" },
    7: { symbol: "N", name: "질소", mass: 14.007, group: "비금속", period: 2, color: "#74B9FF" },
    8: { symbol: "O", name: "산소", mass: 15.999, group: "비금속", period: 2, color: "#FF7675" },
    9: { symbol: "F", name: "플루오린", mass: 18.998, group: "비금속", period: 2, color: "#FD79A8" },
    10: { symbol: "Ne", name: "네온", mass: 20.18, group: "비금속", period: 2, color: "#FDCB6E" },
    11: { symbol: "Na", name: "나트륨", mass: 22.99, group: "금속", period: 3, color: "#6C5CE7" },
    12: { symbol: "Mg", name: "마그네슘", mass: 24.305, group: "금속", period: 3, color: "#A29BFE" },
    13: { symbol: "Al", name: "알루미늄", mass: 26.982, group: "금속", period: 3, color: "#2D3436" },
    14: { symbol: "Si", name: "규소", mass: 28.085, group: "준금속", period: 3, color: "#636E72" },
    15: { symbol: "P", name: "인", mass: 30.974, group: "비금속", period: 3, color: "#81ECEC" },
    16: { symbol: "S", name: "황", mass: 32.06, group: "비금속", period: 3, color: "#00B894" },
    17: { symbol: "Cl", name: "염소", mass: 35.45, group: "비금속", period: 3, color: "#00CEC9" },
    18: { symbol: "Ar", name: "아르곤", mass: 39.948, group: "비금속", period: 3, color: "#55A3FF" },
    19: { symbol: "K", name: "칼륨", mass: 39.098, group: "금속", period: 4, color: "#FF6B35" },
    20: { symbol: "Ca", name: "칼슘", mass: 40.078, group: "금속", period: 4, color: "#F79F1F" },
    21: { symbol: "Sc", name: "스칸듐", mass: 44.956, group: "금속", period: 4, color: "#EA2027" },
    22: { symbol: "Ti", name: "티타늄", mass: 47.867, group: "금속", period: 4, color: "#EE5A24" },
    23: { symbol: "V", name: "바나듐", mass: 50.942, group: "금속", period: 4, color: "#009432" },
    24: { symbol: "Cr", name: "크로뮴", mass: 51.996, group: "금속", period: 4, color: "#006266" },
    25: { symbol: "Mn", name: "망간", mass: 54.938, group: "금속", period: 4, color: "#5758BB" },
    26: { symbol: "Fe", name: "철", mass: 55.845, group: "금속", period: 4, color: "#6F1E51" },
    27: { symbol: "Co", name: "코발트", mass: 58.933, group: "금속", period: 4, color: "#B53471" },
    28: { symbol: "Ni", name: "니켈", mass: 58.693, group: "금속", period: 4, color: "#833471" },
    29: { symbol: "Cu", name: "구리", mass: 63.546, group: "금속", period: 4, color: "#F8B500" },
    30: { symbol: "Zn", name: "아연", mass: 65.38, group: "금속", period: 4, color: "#78E08F" },
    31: { symbol: "Ga", name: "갈륨", mass: 69.723, group: "금속", period: 4, color: "#60A3BC" },
    32: { symbol: "Ge", name: "게르마늄", mass: 72.630, group: "준금속", period: 4, color: "#82589F" },
    33: { symbol: "As", name: "비소", mass: 74.922, group: "준금속", period: 4, color: "#2C2C54" },
    34: { symbol: "Se", name: "셀레늄", mass: 78.971, group: "비금속", period: 4, color: "#40407A" },
    35: { symbol: "Br", name: "브로민", mass: 79.904, group: "비금속", period: 4, color: "#706FD3" },
    36: { symbol: "Kr", name: "크립톤", mass: 83.798, group: "비금속", period: 4, color: "#FF5252" },
    37: { symbol: "Rb", name: "루비듐", mass: 85.468, group: "금속", period: 5, color: "#FF4757" },
    38: { symbol: "Sr", name: "스트론튬", mass: 87.62, group: "금속", period: 5, color: "#FF6348" },
    39: { symbol: "Y", name: "이트륨", mass: 88.906, group: "금속", period: 5, color: "#FF9F43" },
    40: { symbol: "Zr", name: "지르코늄", mass: 91.224, group: "금속", period: 5, color: "#FFA502" },
    41: { symbol: "Nb", name: "니오븀", mass: 92.906, group: "금속", period: 5, color: "#FF6B6B" },
    42: { symbol: "Mo", name: "몰리브데넘", mass: 95.96, group: "금속", period: 5, color: "#4834D4" },
    43: { symbol: "Tc", name: "테크네튬", mass: 98, group: "금속", period: 5, color: "#686DE0" },
    44: { symbol: "Ru", name: "루테늄", mass: 101.07, group: "금속", period: 5, color: "#30336B" },
    45: { symbol: "Rh", name: "로듐", mass: 102.91, group: "금속", period: 5, color: "#535C68" },
    46: { symbol: "Pd", name: "팔라듐", mass: 106.42, group: "금속", period: 5, color: "#95AFC0" },
    47: { symbol: "Ag", name: "은", mass: 107.87, group: "금속", period: 5, color: "#778CA3" },
    48: { symbol: "Cd", name: "카드뮴", mass: 112.41, group: "금속", period: 5, color: "#4B6584" },
    49: { symbol: "In", name: "인듐", mass: 114.82, group: "금속", period: 5, color: "#F8B500" },
    50: { symbol: "Sn", name: "주석", mass: 118.71, group: "금속", period: 5, color: "#78E08F" },
    51: { symbol: "Sb", name: "안티몬", mass: 121.76, group: "준금속", period: 5, color: "#60A3BC" },
    52: { symbol: "Te", name: "텔루륨", mass: 127.60, group: "준금속", period: 5, color: "#82589F" },
    53: { symbol: "I", name: "아이오딘", mass: 126.90, group: "비금속", period: 5, color: "#2C2C54" },
    54: { symbol: "Xe", name: "제논", mass: 131.29, group: "비금속", period: 5, color: "#40407A" },
    55: { symbol: "Cs", name: "세슘", mass: 132.91, group: "금속", period: 6, color: "#706FD3" },
    56: { symbol: "Ba", name: "바륨", mass: 137.33, group: "금속", period: 6, color: "#FF5252" },
    57: { symbol: "La", name: "란탄", mass: 138.91, group: "금속", period: 6, color: "#FF4757" },
    58: { symbol: "Ce", name: "세륨", mass: 140.12, group: "금속", period: 6, color: "#FF6348" },
    59: { symbol: "Pr", name: "프라세오디뮴", mass: 140.91, group: "금속", period: 6, color: "#FF9F43" },
    60: { symbol: "Nd", name: "네오디뮴", mass: 144.24, group: "금속", period: 6, color: "#FFA502" },
    61: { symbol: "Pm", name: "프로메튬", mass: 145, group: "금속", period: 6, color: "#FF6B6B" },
    62: { symbol: "Sm", name: "사마륨", mass: 150.36, group: "금속", period: 6, color: "#4834D4" },
    63: { symbol: "Eu", name: "유로퓸", mass: 151.96, group: "금속", period: 6, color: "#686DE0" },
    64: { symbol: "Gd", name: "가돌리늄", mass: 157.25, group: "금속", period: 6, color: "#30336B" },
    65: { symbol: "Tb", name: "터븀", mass: 158.93, group: "금속", period: 6, color: "#535C68" },
    66: { symbol: "Dy", name: "디스프로슘", mass: 162.50, group: "금속", period: 6, color: "#95AFC0" },
    67: { symbol: "Ho", name: "홀뮴", mass: 164.93, group: "금속", period: 6, color: "#778CA3" },
    68: { symbol: "Er", name: "에르븀", mass: 167.26, group: "금속", period: 6, color: "#4B6584" },
    69: { symbol: "Tm", name: "툴륨", mass: 168.93, group: "금속", period: 6, color: "#F8B500" },
    70: { symbol: "Yb", name: "이터븀", mass: 173.05, group: "금속", period: 6, color: "#78E08F" },
    71: { symbol: "Lu", name: "루테튬", mass: 174.97, group: "금속", period: 6, color: "#60A3BC" },
    72: { symbol: "Hf", name: "하프늄", mass: 178.49, group: "금속", period: 6, color: "#82589F" },
    73: { symbol: "Ta", name: "탄탈럼", mass: 180.95, group: "금속", period: 6, color: "#2C2C54" },
    74: { symbol: "W", name: "텅스텐", mass: 183.84, group: "금속", period: 6, color: "#40407A" },
    75: { symbol: "Re", name: "레늄", mass: 186.21, group: "금속", period: 6, color: "#706FD3" },
    76: { symbol: "Os", name: "오스뮴", mass: 190.23, group: "금속", period: 6, color: "#FF5252" },
    77: { symbol: "Ir", name: "이리듐", mass: 192.22, group: "금속", period: 6, color: "#FF4757" },
    78: { symbol: "Pt", name: "백금", mass: 195.08, group: "금속", period: 6, color: "#FF6348" },
    79: { symbol: "Au", name: "금", mass: 196.97, group: "금속", period: 6, color: "#FF9F43" },
    80: { symbol: "Hg", name: "수은", mass: 200.59, group: "금속", period: 6, color: "#FFA502" },
    81: { symbol: "Tl", name: "탈륨", mass: 204.38, group: "금속", period: 6, color: "#FF6B6B" },
    82: { symbol: "Pb", name: "납", mass: 207.2, group: "금속", period: 6, color: "#4834D4" },
    83: { symbol: "Bi", name: "비스무트", mass: 208.98, group: "금속", period: 6, color: "#686DE0" },
    84: { symbol: "Po", name: "폴로늄", mass: 209, group: "준금속", period: 6, color: "#30336B" },
    85: { symbol: "At", name: "아스타틴", mass: 210, group: "준금속", period: 6, color: "#535C68" },
    86: { symbol: "Rn", name: "라돈", mass: 222, group: "비금속", period: 6, color: "#95AFC0" },
    87: { symbol: "Fr", name: "프랑슘", mass: 223, group: "금속", period: 7, color: "#778CA3" },
    88: { symbol: "Ra", name: "라듐", mass: 226, group: "금속", period: 7, color: "#4B6584" },
    89: { symbol: "Ac", name: "악티늄", mass: 227, group: "금속", period: 7, color: "#F8B500" },
    90: { symbol: "Th", name: "토륨", mass: 232.04, group: "금속", period: 7, color: "#78E08F" },
    91: { symbol: "Pa", name: "프로탁티늄", mass: 231.04, group: "금속", period: 7, color: "#60A3BC" },
    92: { symbol: "U", name: "우라늄", mass: 238.03, group: "금속", period: 7, color: "#82589F" },
    93: { symbol: "Np", name: "넵투늄", mass: 237, group: "금속", period: 7, color: "#2C2C54" },
    94: { symbol: "Pu", name: "플루토늄", mass: 244, group: "금속", period: 7, color: "#40407A" },
    95: { symbol: "Am", name: "아메리슘", mass: 243, group: "금속", period: 7, color: "#706FD3" },
    96: { symbol: "Cm", name: "퀴륨", mass: 247, group: "금속", period: 7, color: "#FF5252" },
    97: { symbol: "Bk", name: "버클륨", mass: 247, group: "금속", period: 7, color: "#FF4757" },
    98: { symbol: "Cf", name: "칼리포늄", mass: 251, group: "금속", period: 7, color: "#FF6348" },
    99: { symbol: "Es", name: "아인슈타이늄", mass: 252, group: "금속", period: 7, color: "#FF9F43" },
    100: { symbol: "Fm", name: "페르뮴", mass: 257, group: "금속", period: 7, color: "#FFA502" },
    101: { symbol: "Md", name: "멘델레븀", mass: 258, group: "금속", period: 7, color: "#FF6B6B" },
    102: { symbol: "No", name: "노벨륨", mass: 259, group: "금속", period: 7, color: "#4834D4" },
    103: { symbol: "Lr", name: "로렌슘", mass: 266, group: "금속", period: 7, color: "#686DE0" },
    104: { symbol: "Rf", name: "러더포듐", mass: 267, group: "금속", period: 7, color: "#30336B" },
    105: { symbol: "Db", name: "더브늄", mass: 268, group: "금속", period: 7, color: "#535C68" },
    106: { symbol: "Sg", name: "시보귬", mass: 271, group: "금속", period: 7, color: "#95AFC0" },
    107: { symbol: "Bh", name: "보륨", mass: 270, group: "금속", period: 7, color: "#778CA3" },
    108: { symbol: "Hs", name: "하슘", mass: 277, group: "금속", period: 7, color: "#4B6584" },
    109: { symbol: "Mt", name: "마이트너륨", mass: 276, group: "금속", period: 7, color: "#F8B500" },
    110: { symbol: "Ds", name: "담스타튬", mass: 281, group: "금속", period: 7, color: "#78E08F" },
    111: { symbol: "Rg", name: "뢴트게늄", mass: 280, group: "금속", period: 7, color: "#60A3BC" },
    112: { symbol: "Cn", name: "코페르니슘", mass: 285, group: "금속", period: 7, color: "#82589F" },
    113: { symbol: "Nh", name: "니호늄", mass: 284, group: "금속", period: 7, color: "#2C2C54" },
    114: { symbol: "Fl", name: "플레로븀", mass: 289, group: "금속", period: 7, color: "#40407A" },
    115: { symbol: "Mc", name: "모스코븀", mass: 288, group: "금속", period: 7, color: "#706FD3" },
    116: { symbol: "Lv", name: "리버모륨", mass: 293, group: "금속", period: 7, color: "#FF5252" },
    117: { symbol: "Ts", name: "테네신", mass: 294, group: "준금속", period: 7, color: "#FF4757" },
    118: { symbol: "Og", name: "오가네손", mass: 295, group: "비금속", period: 7, color: "#FF6348" }
};

// 주사위 정보
const DICE_TYPES = {
    d4: { sides: 4, color: "#e74c3c", icon: "fas fa-dice-d4" },
    d6: { sides: 6, color: "#e67e22", icon: "fas fa-dice-six" },
    d8: { sides: 8, color: "#f1c40f", icon: "fas fa-dice-d8" },
    d10: { sides: 10, color: "#2ecc71", icon: "fas fa-dice-d10" },
    d12: { sides: 12, color: "#3498db", icon: "fas fa-dice-d12" },
    d20: { sides: 20, color: "#9b59b6", icon: "fas fa-dice-d20" },
    d100: { sides: 100, color: "#3498db", icon: "fas fa-dice-d100" }
};

// 전역 변수
let selectedDice = [];
let includeMultiplyDivide = false;
let lastResults = {};
let animationTimeout;

// DOM 요소
const diceCheckboxes = document.querySelectorAll('.dice-checkbox');
const multiplyDivideCheckbox = document.getElementById('multiplyDivide');
const rollButton = document.getElementById('rollDiceBtn');
const diceResultsSection = document.getElementById('diceResults');
const diceResultsContainer = document.getElementById('diceResultsContainer');
const calculationResultsSection = document.getElementById('calculationResults');
const calculationResultsContainer = document.getElementById('calculationResultsContainer');
const elementFilter = document.getElementById('elementFilter');
const loadingModal = document.getElementById('loadingModal');
const elementModal = document.getElementById('elementModal');

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateRollButton();
});

// 이벤트 리스너 초기화
function initializeEventListeners() {
    // 주사위 체크박스 이벤트
    diceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleDiceSelection);
    });

    // 곱셈/나눗셈 토글 이벤트
    multiplyDivideCheckbox.addEventListener('change', handleMultiplyDivideToggle);

    // 주사위 굴리기 버튼 이벤트
    rollButton.addEventListener('click', rollDice);

    // 원소 필터 이벤트
    elementFilter.addEventListener('input', filterElements);

    // 키보드 이벤트
    document.addEventListener('keydown', handleKeyPress);
}

// 주사위 선택 처리
function handleDiceSelection(event) {
    const diceType = event.target.id;
    const isChecked = event.target.checked;

    if (isChecked) {
        selectedDice.push(diceType);
    } else {
        selectedDice = selectedDice.filter(dice => dice !== diceType);
    }

    updateRollButton();
    addDiceSelectionAnimation(event.target.closest('.dice-option'));
}

// 곱셈/나눗셈 토글 처리
function handleMultiplyDivideToggle(event) {
    includeMultiplyDivide = event.target.checked;
    
    if (Object.keys(lastResults).length > 0) {
        calculateAndDisplayResults();
    }
}

// 주사위 굴리기 버튼 업데이트
function updateRollButton() {
    const rollInstruction = document.querySelector('.roll-instruction');
    
    if (selectedDice.length === 0) {
        rollButton.disabled = true;
        rollInstruction.textContent = '최소 1개 이상의 주사위를 선택하세요';
        rollInstruction.style.color = 'var(--text-muted)';
    } else {
        rollButton.disabled = false;
        rollInstruction.textContent = `선택된 주사위: ${selectedDice.join(', ')}`;
        rollInstruction.style.color = 'var(--text-secondary)';
    }
}

// 주사위 굴리기
async function rollDice() {
    if (selectedDice.length === 0) return;

    // 로딩 모달 표시
    showLoadingModal();

    // 주사위 굴리기 애니메이션 시작
    startDiceAnimation();

    // 실제 주사위 굴리기 (애니메이션 시간 후)
    setTimeout(() => {
        performDiceRoll();
        hideLoadingModal();
    }, 1200);
}

// 주사위 굴리기 실행
function performDiceRoll() {
    lastResults = {};
    
    selectedDice.forEach(diceType => {
        const sides = DICE_TYPES[diceType].sides;
        const result = Math.floor(Math.random() * sides) + 1;
        lastResults[diceType] = result;
    });

    displayDiceResults();
    calculateAndDisplayResults();
}

// 주사위 결과 표시
function displayDiceResults() {
    diceResultsContainer.innerHTML = '';
    
    Object.entries(lastResults).forEach(([diceType, result]) => {
        const diceInfo = DICE_TYPES[diceType];
        const diceResultElement = createDiceResultElement(diceType, result, diceInfo);
        diceResultsContainer.appendChild(diceResultElement);
    });

    // 결과 섹션 표시
    diceResultsSection.style.display = 'block';
    diceResultsSection.classList.add('fade-in-up');
    
    // 스크롤 이동
    setTimeout(() => {
        diceResultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

// 주사위 결과 요소 생성
function createDiceResultElement(diceType, result, diceInfo) {
    const element = document.createElement('div');
    element.className = 'dice-result';
    element.innerHTML = `
        <i class="${diceInfo.icon} dice-result-icon" style="color: ${diceInfo.color}"></i>
        <div class="dice-result-value">${result}</div>
        <div class="dice-result-label">${diceType.toUpperCase()}</div>
    `;
    return element;
}

// 계산 결과 표시
function calculateAndDisplayResults() {
    const results = Object.values(lastResults);
    const calculations = generateCalculations(results);
    
    calculationResultsContainer.innerHTML = '';
    
    calculations.forEach(calc => {
        const element = ELEMENTS[calc.result];
        if (element) {
            const calcElement = createCalculationElement(calc, element);
            calculationResultsContainer.appendChild(calcElement);
        }
    });

    calculationResultsSection.style.display = 'block';
    calculationResultsSection.classList.add('fade-in-up');
}

// 계산 조합 생성
function generateCalculations(results) {
    const calculations = [];
    
    // 단일 값들
    results.forEach(result => {
        if (result >= 1 && result <= 118) {
            calculations.push({
                formula: result.toString(),
                result: result
            });
        }
    });
    
    // 두 개씩 조합
    for (let i = 0; i < results.length; i++) {
        for (let j = i + 1; j < results.length; j++) {
            const a = results[i];
            const b = results[j];
            
            // 덧셈
            const sum = a + b;
            if (sum >= 1 && sum <= 118) {
                calculations.push({
                    formula: `${a} + ${b}`,
                    result: sum
                });
            }
            
            // 뺄셈 (절댓값)
            const diff = Math.abs(a - b);
            if (diff >= 1 && diff <= 118) {
                calculations.push({
                    formula: `|${a} - ${b}|`,
                    result: diff
                });
            }
            
            // 곱셈/나눗셈 (활성화된 경우)
            if (includeMultiplyDivide) {
                // 곱셈
                const product = a * b;
                if (product >= 1 && product <= 118) {
                    calculations.push({
                        formula: `${a} × ${b}`,
                        result: product
                    });
                }
                
                // 나눗셈 (정수 나누기)
                if (a % b === 0) {
                    const quotient = a / b;
                    if (quotient >= 1 && quotient <= 118) {
                        calculations.push({
                            formula: `${a} ÷ ${b}`,
                            result: quotient
                        });
                    }
                }
                
                if (b % a === 0) {
                    const quotient = b / a;
                    if (quotient >= 1 && quotient <= 118) {
                        calculations.push({
                            formula: `${b} ÷ ${a}`,
                            result: quotient
                        });
                    }
                }
            }
        }
    }
    
    // 세 개 이상 조합 (간단한 경우만)
    if (results.length >= 3) {
        const sum = results.reduce((acc, val) => acc + val, 0);
        if (sum >= 1 && sum <= 118) {
            calculations.push({
                formula: results.join(' + '),
                result: sum
            });
        }
    }
    
    // 중복 제거 및 정렬
    const uniqueCalculations = [];
    const seen = new Set();
    
    calculations.forEach(calc => {
        const key = `${calc.result}-${calc.formula}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueCalculations.push(calc);
        }
    });
    
    return uniqueCalculations.sort((a, b) => a.result - b.result);
}

// 계산 결과 요소 생성
function createCalculationElement(calc, element) {
    const div = document.createElement('div');
    div.className = 'calculation-result';
    div.innerHTML = `
        <div class="calculation-formula">${calc.formula}</div>
        <div class="calculation-value">${calc.result}</div>
        <div class="element-symbol" onclick="showElementModal(${calc.result})" style="background-color: ${element.color}20; border-color: ${element.color};">
            ${element.symbol}
        </div>
        <div class="element-name">${element.name}</div>
    `;
    return div;
}

// 원소 필터링
function filterElements() {
    const filterValue = elementFilter.value.toLowerCase();
    const calculationElements = calculationResultsContainer.querySelectorAll('.calculation-result');
    
    calculationElements.forEach(element => {
        const symbol = element.querySelector('.element-symbol').textContent.toLowerCase();
        const name = element.querySelector('.element-name').textContent.toLowerCase();
        const formula = element.querySelector('.calculation-formula').textContent.toLowerCase();
        
        if (symbol.includes(filterValue) || name.includes(filterValue) || formula.includes(filterValue)) {
            element.style.display = 'grid';
        } else {
            element.style.display = 'none';
        }
    });
}

// 원소 모달 표시
function showElementModal(atomicNumber) {
    const element = ELEMENTS[atomicNumber];
    if (!element) return;
    
    const elementDetails = document.getElementById('elementDetails');
    elementDetails.innerHTML = `
        <div class="element-modal-header">
            <div class="element-modal-symbol" style="background-color: ${element.color}20; border-color: ${element.color}; color: ${element.color};">
                ${element.symbol}
            </div>
            <div class="element-modal-info">
                <h2>${element.name}</h2>
                <p>원자번호: ${atomicNumber}</p>
            </div>
        </div>
        <div class="element-modal-details">
            <div class="element-detail-item">
                <strong>원자량:</strong> ${element.mass}
            </div>
            <div class="element-detail-item">
                <strong>원소 분류:</strong> ${element.group}
            </div>
            <div class="element-detail-item">
                <strong>주기:</strong> ${element.period}주기
            </div>
            <div class="element-detail-item">
                <strong>화학 기호:</strong> ${element.symbol}
            </div>
        </div>
    `;
    
    elementModal.style.display = 'block';
    elementModal.classList.add('fade-in-up');
}

// 원소 모달 닫기
function closeElementModal() {
    elementModal.style.display = 'none';
    elementModal.classList.remove('fade-in-up');
}

// 로딩 모달 표시/숨기기
function showLoadingModal() {
    loadingModal.style.display = 'block';
}

function hideLoadingModal() {
    loadingModal.style.display = 'none';
}

// 주사위 애니메이션
function startDiceAnimation() {
    const diceIcons = document.querySelectorAll('.dice-checkbox:checked + .dice-label .dice-icon');
    diceIcons.forEach(icon => {
        icon.classList.add('dice-rolling');
    });
    
    setTimeout(() => {
        diceIcons.forEach(icon => {
            icon.classList.remove('dice-rolling');
        });
    }, 1000);
}

// 주사위 선택 애니메이션
function addDiceSelectionAnimation(diceOption) {
    diceOption.style.transform = 'scale(1.05)';
    diceOption.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
        diceOption.style.transform = 'scale(1)';
    }, 200);
}

// 키보드 이벤트 처리
function handleKeyPress(event) {
    // 스페이스바로 주사위 굴리기
    if (event.code === 'Space' && !rollButton.disabled) {
        event.preventDefault();
        rollDice();
    }
    
    // ESC로 모달 닫기
    if (event.code === 'Escape') {
        closeElementModal();
    }
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    if (event.target === elementModal) {
        closeElementModal();
    }
}

// 추가 CSS 스타일을 동적으로 추가
const additionalStyles = `
    .element-modal-header {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .element-modal-symbol {
        font-family: 'Orbitron', monospace;
        font-size: 3rem;
        font-weight: 700;
        width: 80px;
        height: 80px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid;
        background: rgba(255, 255, 255, 0.05);
    }
    
    .element-modal-info h2 {
        margin: 0 0 0.5rem 0;
        color: var(--text-primary);
        font-size: 1.8rem;
    }
    
    .element-modal-info p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 1.1rem;
    }
    
    .element-modal-details {
        display: grid;
        gap: 1rem;
    }
    
    .element-detail-item {
        background: rgba(255, 255, 255, 0.05);
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid var(--secondary-color);
    }
    
    .element-detail-item strong {
        color: var(--secondary-color);
        margin-right: 0.5rem;
    }
`;

// 동적 스타일 추가
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

console.log('멘델리예프 다이스 시뮬레이터가 초기화되었습니다.');
console.log('선택 가능한 주사위:', Object.keys(DICE_TYPES));
console.log('등록된 원소 수:', Object.keys(ELEMENTS).length); 
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

// Main JavaScript for Mendeleev Dice Simulator

// DOM Elements
const rollBtn = document.getElementById('roll-btn');
const diceCheckboxes = document.querySelectorAll('input[name="dice"]');
const multiplyDivideToggle = document.getElementById('multiply-divide');
const resultsSection = document.getElementById('results');
const diceResultsContainer = document.getElementById('dice-results');
const calculationsSection = document.getElementById('calculations');
const calculationsBody = document.getElementById('calculations-body');

// Dice roll results storage
let diceResults = {};

// Event Listeners
rollBtn.addEventListener('click', rollDice);

// Main dice rolling function
function rollDice() {
    // Get selected dice
    const selectedDice = Array.from(diceCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => ({
            type: `d${checkbox.value}`,
            sides: parseInt(checkbox.value)
        }));
    
    if (selectedDice.length === 0) {
        alert('주사위를 선택해주세요!');
        return;
    }
    
    // Clear previous results
    diceResults = {};
    diceResultsContainer.innerHTML = '';
    calculationsBody.innerHTML = '';
    
    // Roll each selected die
    selectedDice.forEach(die => {
        const result = rollSingleDie(die.sides);
        diceResults[die.type] = result;
        displayDiceResult(die.type, result);
    });
    
    // Show results sections
    resultsSection.style.display = 'block';
    calculationsSection.style.display = 'block';
    
    // Calculate and display combinations
    calculateCombinations();
}

// Roll a single die
function rollSingleDie(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

// Display individual dice result
function displayDiceResult(diceType, value) {
    const diceElement = document.createElement('div');
    diceElement.className = 'dice-result';
    
    const iconMap = {
        'd4': '△',
        'd6': '⬡',
        'd8': '◆',
        'd10': '⬢',
        'd12': '⬟',
        'd20': '⬢',
        'd100': '%'
    };
    
    const colorMap = {
        'd4': '#e74c3c',
        'd6': '#3498db',
        'd8': '#9b59b6',
        'd10': '#1abc9c',
        'd12': '#f39c12',
        'd20': '#e67e22',
        'd100': '#34495e'
    };
    
    diceElement.innerHTML = `
        <div class="dice-result-icon" style="color: ${colorMap[diceType]}">${iconMap[diceType]}</div>
        <div class="dice-result-value">${value}</div>
        <div class="dice-result-type">${diceType}</div>
    `;
    
    // Add rolling animation
    diceElement.classList.add('rolling');
    setTimeout(() => {
        diceElement.classList.remove('rolling');
    }, 500);
    
    diceResultsContainer.appendChild(diceElement);
}

// Calculate all possible combinations
function calculateCombinations() {
    const values = Object.values(diceResults);
    const includeMultiplyDivide = multiplyDivideToggle.checked;
    const calculations = [];
    
    // Single values
    values.forEach(value => {
        calculations.push({
            formula: `${value}`,
            result: value,
            diceUsed: [value]
        });
    });
    
    // Two dice combinations
    if (values.length >= 2) {
        for (let i = 0; i < values.length; i++) {
            for (let j = i + 1; j < values.length; j++) {
                const a = values[i];
                const b = values[j];
                
                // Addition
                calculations.push({
                    formula: `${a} + ${b}`,
                    result: a + b,
                    diceUsed: [a, b]
                });
                
                // Subtraction (both directions)
                calculations.push({
                    formula: `${a} - ${b}`,
                    result: a - b,
                    diceUsed: [a, b]
                });
                
                calculations.push({
                    formula: `${b} - ${a}`,
                    result: b - a,
                    diceUsed: [a, b]
                });
                
                if (includeMultiplyDivide) {
                    // Multiplication
                    calculations.push({
                        formula: `${a} × ${b}`,
                        result: a * b,
                        diceUsed: [a, b]
                    });
                    
                    // Division (both directions, avoiding division by zero)
                    if (b !== 0) {
                        calculations.push({
                            formula: `${a} ÷ ${b}`,
                            result: a / b,
                            diceUsed: [a, b]
                        });
                    }
                    
                    if (a !== 0) {
                        calculations.push({
                            formula: `${b} ÷ ${a}`,
                            result: b / a,
                            diceUsed: [a, b]
                        });
                    }
                }
            }
        }
    }
    
    // Three or more dice combinations
    if (values.length >= 3) {
        // For simplicity, we'll do sequential operations
        // You can expand this to include all permutations if needed
        
        // All addition
        const sumAll = values.reduce((sum, val) => sum + val, 0);
        calculations.push({
            formula: values.join(' + '),
            result: sumAll,
            diceUsed: [...values]
        });
        
        // Other complex combinations can be added here
    }
    
    // Filter out duplicate results and invalid calculations
    const uniqueCalculations = [];
    const seenResults = new Set();
    
    calculations.forEach(calc => {
        // Only include positive integers and reasonable decimal results
        if (calc.result > 0 && calc.result <= 1000) {
            const key = `${calc.result}-${calc.formula}`;
            if (!seenResults.has(key)) {
                seenResults.add(key);
                uniqueCalculations.push(calc);
            }
        }
    });
    
    // Sort by result value
    uniqueCalculations.sort((a, b) => a.result - b.result);
    
    // Display calculations
    displayCalculations(uniqueCalculations);
}

// Display calculation results
function displayCalculations(calculations) {
    calculationsBody.innerHTML = '';
    
    calculations.forEach(calc => {
        const row = document.createElement('tr');
        
        // Round result for display if it's a decimal
        const displayResult = Number.isInteger(calc.result) ? 
            calc.result : 
            calc.result.toFixed(2);
        
        // Get element information
        const atomicNumber = Math.round(calc.result);
        const element = getElement(atomicNumber);
        
        row.innerHTML = `
            <td class="calculation-formula">${calc.formula}</td>
            <td class="calculation-result">${displayResult}</td>
            <td class="element-symbol">${element.symbol}</td>
            <td class="element-name">${element.name}</td>
        `;
        
        calculationsBody.appendChild(row);
    });
}

// Add some visual feedback when hovering over dice options
document.querySelectorAll('.dice-option').forEach(option => {
    option.addEventListener('mouseenter', function() {
        this.querySelector('.dice-icon').style.transform = 'scale(1.1)';
    });
    
    option.addEventListener('mouseleave', function() {
        if (!this.querySelector('input').checked) {
            this.querySelector('.dice-icon').style.transform = 'scale(1)';
        }
    });
});

// Initialize - hide results sections
resultsSection.style.display = 'none';
calculationsSection.style.display = 'none'; 
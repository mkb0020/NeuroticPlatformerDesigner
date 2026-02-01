// ============================================================
// CALCULATOR MODULE
// Handles all platform calculation logic
// ============================================================

window.calculationResult = null;

window.addEventListener('load', buildLevelCards);

document.addEventListener('DOMContentLoaded', function() {
  const levelsInput = document.getElementById('levels');
  levelsInput.addEventListener('input', buildLevelCards);
  
  const overlay = document.getElementById("alert-overlay");
  const okBtn = document.getElementById("alert-ok");
  
  okBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
  });
});

function showAlert(message) {
  const overlay = document.getElementById("alert-overlay");
  const msg = document.getElementById("alert-message");
  
  const friendlyHeaders = [
    "WHOOPSIES!",
    "THAT WOULD BREAK THE LAWS OF THIS UNIVERSE",
    "THAT VALUE MIGHT BE A BIT AMBITIOUS...",
    "WE ADMIRE THE CONFIDENCE - BUT LET'S DIAL IT BACK.",
    "WE LOVE THE ENTHUSIASM, BUT...",
    "FUN IDEA! BUT..."
  ];
  
  message = friendlyHeaders[Math.floor(Math.random() * friendlyHeaders.length)] + "\n\n" + message;
  msg.textContent = message;
  overlay.classList.remove("hidden");
}

function buildLevelCards() {
  const container = document.getElementById('levelsContainer');
  container.innerHTML = '';
  
  const numLevels = +document.getElementById('levels').value;
  
  for (let i = 0; i < numLevels; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    
    card.innerHTML = `
      <h2>LEVEL ${i + 1} SPECS</h2>
      <label>NUMBER OF GAUNTLETS (1 to 50): <input type="number" class="gauntlets" value="1" min="1" max="50"></label> 
      <label>PLATFORMS PER GAUNTLET (1 to 100): <input type="number" class="platforms" value="1" min="1" max="100"></label> 
      <label>PLATFORM WIDTH (10 to 1000): <input type="number" class="platformWidth" value="100" min="10" max="1000"></label>
      <label>FIRST GROUND SEGMENT END (0 to 10000): <input type="number" class="firstGroundX" value="100" min="0" max="10000"></label> 
      <label>GROUND LENGTH BETWEEN GAUNTLETS (10 to 5000): <input type="number" class="groundLength" value="100" min="10" max="5000"></label> 
      <label>GROUND OVERLAP (-500 to 500): <input type="number" class="overlap" value="0" min="-500" max="500"></label> 
      <div class="message">This overlap value determines how much the platforms extend into or pull away from the ground segments. A positive overlap means platforms start before the ground segment ends (creating a smoother transition), while a negative overlap creates a gap between the ground and the first platform (making it more challenging).</div>
    `;
    
    container.appendChild(card);
  }
}

window.calculate = function() {
  const validations = {
    gravity: { min: 1, max: 5000, name: 'Gravity' },
    jumpPower: { min: 1, max: 1000, name: 'Jump Force' },
    jumpMult: { min: 0.1, max: 100, name: 'Jump Multiplier' },
    baseSpeed: { min: 1, max: 1000, name: 'Base Speed' },
    speedMult: { min: 0.1, max: 100, name: 'Speed Multiplier' },
    levels: { min: 1, max: 20, name: 'Number of Levels' },
    distanceDelta: { min: -500, max: 500, name: 'Incremental Platform Distance' },
    groundY: { min: 100, max: 2000, name: 'Ground Y' }
  };
  
  for (const [id, rules] of Object.entries(validations)) {
    const input = document.getElementById(id);
    const value = +input.value;
    if (value < rules.min || value > rules.max) {
      showAlert(`${rules.name} must be between ${rules.min} and ${rules.max}. You entered: ${value}`);
      input.focus();
      return;
    }
  }
  
  const levelCards = document.querySelectorAll('#levelsContainer .card');
  for (let l = 0; l < levelCards.length; l++) {
    const card = levelCards[l];
    const levelNum = l + 1;
    
    const levelValidations = {
      gauntlets: { el: card.querySelector('.gauntlets'), min: 1, max: 50, name: `Level ${levelNum} - Number of Gauntlets` },
      platforms: { el: card.querySelector('.platforms'), min: 1, max: 100, name: `Level ${levelNum} - Platforms per Gauntlet` },
      platformWidth: { el: card.querySelector('.platformWidth'), min: 10, max: 1000, name: `Level ${levelNum} - Platform Width` },
      firstGroundX: { el: card.querySelector('.firstGroundX'), min: 0, max: 10000, name: `Level ${levelNum} - First Ground Segment End` },
      groundLength: { el: card.querySelector('.groundLength'), min: 10, max: 5000, name: `Level ${levelNum} - Ground Length Between Gauntlets` },
      overlap: { el: card.querySelector('.overlap'), min: -500, max: 500, name: `Level ${levelNum} - Ground Overlap` }
    };
    
    for (const [key, rules] of Object.entries(levelValidations)) {
      const value = +rules.el.value;
      if (value < rules.min || value > rules.max) {
        showAlert(`${rules.name} must be between ${rules.min} and ${rules.max}. You entered: ${value}`);
        rules.el.focus();
        return;
      }
    }
  }
  
  const g = +document.getElementById('gravity').value;
  const jp = +document.getElementById('jumpPower').value;
  const jm = +document.getElementById('jumpMult').value;
  const bs = +document.getElementById('baseSpeed').value;
  const sm = +document.getElementById('speedMult').value;
  
  const numLevels = +document.getElementById('levels').value;
  const delta = +document.getElementById('distanceDelta').value;
  const gy = +document.getElementById('groundY').value;
  
  const jumpForce = jp * jm;
  const effectiveSpeed = bs * sm;
  const timeInAir = (2 * jumpForce) / g;
  const maxJumpDistance = effectiveSpeed * timeInAir;
  const maxJumpHeight = (jumpForce ** 2) / (2 * g);
  const finalDistance = maxJumpDistance - delta;
  
  let result = {
    jumpForce,
    effectiveSpeed,
    maxJumpDistance: maxJumpDistance.toFixed(2),
    maxJumpHeight: maxJumpHeight.toFixed(2),
    levels: []
  };
  
  for (let l = 0; l < numLevels; l++) {
    const card = levelCards[l];
    
    const gauntletsPerLevel = +card.querySelector('.gauntlets').value;
    const platformsPerGauntlet = +card.querySelector('.platforms').value;
    const platformLen = +card.querySelector('.platformWidth').value;
    const firstGroundEnd = +card.querySelector('.firstGroundX').value;
    const groundLen = +card.querySelector('.groundLength').value;
    const overlap = +card.querySelector('.overlap').value;
    
    const fromEnd = (numLevels - 1) - l;
    const platformGap = finalDistance - (fromEnd * delta);
    const platformStartToStart = platformLen + platformGap;
    
    let currentGroundEndX = firstGroundEnd;
    let gauntlets = [];
    
    for (let g = 0; g < gauntletsPerLevel; g++) {
      const gauntletStartX = currentGroundEndX - overlap;
      
      let platforms = [];
      let prevY = gy;
      let currentPlatformX = gauntletStartX;
      
      for (let p = 0; p < platformsPerGauntlet; p++) {
        const highestReachable = Math.max(0, prevY - maxJumpHeight * 0.9);
        const lowestReachable = Math.min(gy, prevY + maxJumpHeight * 0.9);
        const y = Math.random() * (lowestReachable - highestReachable) + highestReachable;
        
        platforms.push({
          platformNumber: p + 1,
          startX: currentPlatformX.toFixed(2),
          endX: (currentPlatformX + platformLen).toFixed(2),
          y: Math.max(0, y).toFixed(1)
        });
        
        prevY = y;
        currentPlatformX += platformStartToStart;
      }
      
      const lastPlatformStartX = parseFloat(platforms[platforms.length - 1].startX);
      const gauntletEndX = lastPlatformStartX + platformLen;
      const gauntletLength = gauntletEndX - gauntletStartX;
      
      const nextGroundStartX = gauntletEndX - overlap;
      const nextGroundEndX = nextGroundStartX + groundLen;
      
      gauntlets.push({
        gauntletNumber: g + 1,
        gauntletStartX: gauntletStartX.toFixed(2),
        gauntletEndX: gauntletEndX.toFixed(2),
        gauntletLength: gauntletLength.toFixed(2),
        platforms: platforms,
        nextGroundSegmentStartX: nextGroundStartX.toFixed(2),
        nextGroundSegmentEndX: nextGroundEndX.toFixed(2)
      });
      
      currentGroundEndX = nextGroundEndX;
    }
    
    result.levels.push({
      level: l + 1,
      gauntletsPerLevel,
      platformsPerGauntlet,
      platformWidth: platformLen,
      firstGroundEnd,
      groundSegmentLength: groundLen,
      overlap: overlap,
      platformGap: platformGap.toFixed(2),
      platformStartToStart: platformStartToStart.toFixed(2),
      gauntlets: gauntlets
    });
  }
  
  const jsonString = JSON.stringify(result, null, 2);
  const lines = jsonString.split('\n');
  let colored = '';
  let currentLevel = -1;
  const colors = ['#67FEBD', '#FFC7FF'];
  const physicsColor = '#C4C3D0';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    const isPhysicsProperty = line.includes('"jumpForce"') || 
                              line.includes('"effectiveSpeed"') || 
                              line.includes('"maxJumpDistance"') || 
                              line.includes('"maxJumpHeight"');
    
    if (line.includes('"level":')) {
      const match = line.match(/"level":\s*(\d+)/);
      if (match) {
        currentLevel = parseInt(match[1]) - 1;
      }
    }
    
    if (isPhysicsProperty) {
      colored += `<span style="color: ${physicsColor}">${line}</span>\n`;
    } else if (currentLevel >= 0 && currentLevel < numLevels) {
      const color = colors[currentLevel % 2];
      colored += `<span style="color: ${color}">${line}</span>\n`;
    } else {
      colored += line + '\n';
    }
  }
  
  document.getElementById('output').innerHTML = colored;
  document.getElementById('resultsContainer').style.display = 'block';
  document.getElementById('downloadDetailedBtn').style.display = 'block';
  document.getElementById('downloadMakeoverBtn').style.display = 'block';
  
  window.calculationResult = result;
  
  document.getElementById('resultsContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.downloadDetailedJSON = function() {
  if (!window.calculationResult) return;
  
  const jsonString = JSON.stringify(window.calculationResult, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'level-specs.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
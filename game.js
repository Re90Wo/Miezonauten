const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const fishCount = document.querySelector('#fish-count');
const lifeCount = document.querySelector('#life-count');
const introCard = document.querySelector('#intro-card');
const resultCard = document.querySelector('#result-card');
const levelName = document.querySelector('#level-name');
const scoreForm = document.querySelector('#score-form');
const leaderboardList = document.querySelector('#leaderboard-list');
const powerupIcon = document.querySelector('#powerup-icon');
const powerupLabel = document.querySelector('#powerup-label');
const powerupDisplay = document.querySelector('#powerup-display');
const soundToggle = document.querySelector('#sound-toggle');
const continueButton = document.querySelector('#continue-button');
const hudReturnToMenuButton = document.querySelector('#hud-return-to-menu-button');
const playerPanel = document.querySelector('#player-panel');
const playerList = document.querySelector('#player-list');
const playerForm = document.querySelector('#player-form');
const playerNameInput = document.querySelector('#new-player-name');
const addPlayerButton = document.querySelector('#add-player-button');
const playerLimitMessage = document.querySelector('#player-limit-message');
const shopPanel = document.querySelector('#shop-panel');
const shopWallet = document.querySelector('#shop-wallet');
const shopBalance = document.querySelector('#shop-balance');
const colorShopList = document.querySelector('#color-shop-list');
const accessoryShopList = document.querySelector('#accessory-shop-list');
const abilityShopList = document.querySelector('#ability-shop-list');
const keys = { left: false, right: false, jump: false };

const WORLD_WIDTH = 3300;
const GRAVITY = 0.62;
const ground = [
  { x: 0, w: 690 }, { x: 810, w: 560 }, { x: 1510, w: 570 },
  { x: 2220, w: 460 }, { x: 2790, w: 510 },
];
const platformTemplate = [
  { x: 190, y: 370, w: 120 }, { x: 395, y: 306, w: 115 }, { x: 560, y: 375, w: 90 },
  { x: 735, y: 405, w: 105 }, { x: 920, y: 350, w: 120 }, { x: 1090, y: 286, w: 130 },
  { x: 1290, y: 365, w: 100 }, { x: 1450, y: 398, w: 100 }, { x: 1640, y: 335, w: 125 },
  { x: 1840, y: 275, w: 110 }, { x: 2010, y: 355, w: 100 }, { x: 2160, y: 398, w: 105 },
  { x: 2350, y: 340, w: 125 }, { x: 2540, y: 282, w: 115 }, { x: 2720, y: 370, w: 110 },
  { x: 2910, y: 330, w: 120 },
];
const levels = [
  { name: 'WOLKENPFOTEN-INSEL', sky: ['#9edee8', '#e1f4dd'], hill: '#a4d5ba', grass: '#78bc76', dirt: '#8c6651', heights: [370,306,375,405,350,286,365,398,335,275,355,398,340,282,370,330], speed: 1.15 },
  { name: 'SONNENBLUMEN-WIESE', sky: ['#a8e1e5', '#eff1bf'], hill: '#add58d', grass: '#88bd56', dirt: '#98704d', heights: [350,290,365,402,335,275,360,395,325,270,350,395,335,275,360,320], speed: 1.3 },
  { name: 'ZUCKERWATTEN-GEBIRGE', sky: ['#b5d8f1', '#f4e3ef'], hill: '#c4c5dc', grass: '#93b7d5', dirt: '#827a9c', heights: [390,330,380,405,365,310,385,398,350,295,375,398,365,310,390,350], speed: 1.45 },
  { name: 'KÜRBIS-KUSCHELTAL', sky: ['#f5c99d', '#f4e6b6'], hill: '#d8ad76', grass: '#91b75d', dirt: '#98644c', heights: [355,290,370,405,340,280,365,398,330,275,360,400,340,280,370,325], speed: 1.6 },
  { name: 'MONDLICHT-MIAU', sky: ['#8d9bc9', '#d2c8e6'], hill: '#9b9ac4', grass: '#86a88c', dirt: '#665c87', heights: [390,325,380,408,360,300,380,400,345,285,365,402,355,295,380,340], speed: 1.75 },
  { name: 'REGENBOGEN-RUHESTÄTTE', sky: ['#f2b9c9', '#c4e7de'], hill: '#a9d8bd', grass: '#79b987', dirt: '#8e6d70', heights: [350,280,365,405,330,270,355,395,320,265,350,400,330,270,360,315], speed: 1.9 },
];
const levelMusic = [
  { bpm: 104, wave: 'sine', notes: [0,4,7,4,2,5,9,5,0,4,7,11,9,7,4,2], bass: [0,null,0,null,5,null,5,null,3,null,3,null,5,null,5,null] },
  { bpm: 116, wave: 'triangle', notes: [0,2,4,7,9,7,4,2,0,4,7,9,11,9,7,4], bass: [0,null,4,null,5,null,4,null,0,null,4,null,7,null,5,null] },
  { bpm: 88, wave: 'sine', notes: [0,null,7,5,3,null,5,7,10,null,7,5,3,null,2,0], bass: [0,null,null,null,5,null,null,null,3,null,null,null,4,null,null,null] },
  { bpm: 96, wave: 'triangle', notes: [0,3,5,8,7,5,3,0,10,8,7,5,3,5,7,3], bass: [0,null,0,null,3,null,3,null,5,null,5,null,0,null,0,null] },
  { bpm: 78, wave: 'sine', notes: [0,null,3,7,null,10,7,null,5,null,3,7,null,5,3,null], bass: [0,null,null,null,3,null,null,null,5,null,null,null,4,null,null,null] },
  { bpm: 108, wave: 'triangle', notes: [0,4,7,12,11,9,7,4,2,5,9,14,12,9,7,4], bass: [0,null,0,null,4,null,4,null,5,null,5,null,0,null,7,null] },
];
const bossMusic = {
  bpm: 136,
  wave: 'sawtooth',
  notes: [0,0,3,7,0,0,10,7,0,0,3,8,7,3,2,-2],
  bass: [0,null,0,null,3,null,3,null,5,null,5,null,2,null,2,null],
};
const powerupTypes = [
  { id: 'zoomies', icon: '💨', name: 'Turbo-Pfoten', duration: 8 },
  { id: 'jump', icon: '🐇', name: 'Super-Sprung', duration: 8 },
  { id: 'shield', icon: '🫧', name: 'Schnurr-Schild', duration: 10 },
  { id: 'magnet', icon: '🐟', name: 'Fisch-Magnet', duration: 10 },
  { id: 'woolball', icon: '🧶', name: 'Wollball-Wurf', charges: 5 },
  { id: 'flight', icon: '🪽', name: 'Flug-Pfoten', duration: 10 },
];
const catColors = [
  { id: 'orange', name: 'Miez-Orange', color: '#f08c50', price: 0 },
  { id: 'cream', name: 'Vanille-Creme', color: '#e8c99a', price: 8 },
  { id: 'gray', name: 'Wolken-Grau', color: '#8795a8', price: 12 },
  { id: 'pink', name: 'Rosa Zuckerwatte', color: '#e88eae', price: 16 },
  { id: 'black', name: 'Mitternachts-Schwarz', color: '#51485f', price: 20 },
  { id: 'mint', name: 'Minz-Miau', color: '#66bda5', price: 24 },
  { id: 'slumber', name: 'Schlummer-Miez', color: '#5d86ad', price: 10, rare: true },
  { id: 'lavender-cloud', name: 'Lavendelwolke', color: '#b28be0', price: 10, rare: true },
  { id: 'cinnamon', name: 'Zimtpfote', color: '#b96e43', price: 10, rare: true },
  { id: 'coral-reef', name: 'Korallenriff-Miez', color: '#ef8b79', price: 10, rare: true },
  { id: 'forest-moss', name: 'Waldmoos-Miez', color: '#628b59', price: 10, rare: true },
  { id: 'aurora', name: 'Polarlicht-Miez', color: '#46a99c', price: 10, rare: true },
  { id: 'stardust', name: 'Sternenstaub-Miez', color: '#6872a8', price: 10, rare: true },
  { id: 'cherry-blossom', name: 'Kirschblüten-Miez', color: '#ec9ab5', price: 10, rare: true },
  { id: 'lagoon-shell', name: 'Lagunen-Schildkröten-Miez', color: '#55bfd0', price: 10, rare: true },
  { id: 'rainbow', name: 'Legendäre Regenbogenkatze', color: '#ff72ac', price: 1000, legendary: true },
  { id: 'galaxy', name: 'Legendäre Galaxie-Miez', color: '#6858b8', price: 1000, legendary: true },
  { id: 'gold', name: 'Legendäre Goldpfote', color: '#e9b837', price: 1000, legendary: true },
  { id: 'thunder', name: 'Mythische Blitzpfote', color: '#f6d84a', price: 300, legendary: true, mythic: true },
  { id: 'phoenix', name: 'Mythische Phönix-Miez', color: '#f0783c', price: 300, legendary: true, mythic: true },
  { id: 'deep-sea', name: 'Mythische Tiefsee-Miez', color: '#32b9c9', price: 300, legendary: true, mythic: true },
  { id: 'crystal', name: 'Mythische Kristallpfote', color: '#b58bec', price: 300, legendary: true, mythic: true },
  { id: 'emerald', name: 'Mythische Smaragd-Miez', color: '#48b77b', price: 300, legendary: true, mythic: true },
  { id: 'tiger', name: 'Tigerstreifen', color: '#e77b32', price: 40, pattern: true },
  { id: 'leopard', name: 'Leopardenpunkte', color: '#d8a34b', price: 45, pattern: true },
  { id: 'tuxedo', name: 'Kleine Smoking-Miez', color: '#f1eee8', price: 35, pattern: true },
  { id: 'calico', name: 'Dreifarbige Glückskatze', color: '#f0d7a5', price: 50, pattern: true },
  { id: 'candy', name: 'Bonbon-Wirbel', color: '#ef91be', price: 55, pattern: true },
  { id: 'blue-tiger', name: 'Blauer Tiger', color: '#73bde8', price: 60, pattern: true },
  { id: 'lavender-tiger', name: 'Flieder-Tiger', color: '#b28be0', price: 60, pattern: true },
  { id: 'rose-leopard', name: 'Rosa Leopard', color: '#ef9fbd', price: 65, pattern: true },
  { id: 'arctic', name: 'Arktis-Miez', color: '#bdebf0', price: 55, pattern: true },
  { id: 'sunset', name: 'Sonnenuntergangs-Miez', color: '#f08c62', price: 70, pattern: true },
];
const catAccessories = [
  { id: 'blue-woolball', name: 'Blauer Wollball-Freund', icon: '🧶', color: '#51a9e8', price: 18 },
  { id: 'star-kitten', name: 'Sternchen-Kätzchen', icon: '🐱', color: '#f5c85a', price: 22 },
  { id: 'moon-bunny', name: 'Mondhäschen', icon: '🐰', color: '#baa5e8', price: 20 },
  { id: 'tiny-dragon', name: 'Mini-Drache', icon: '🐉', color: '#65bd83', price: 28 },
  { id: 'duckling', name: 'Quietsch-Entchen', icon: '🐤', color: '#f4d45b', price: 16 },
  { id: 'little-fox', name: 'Fuchs-Freund', icon: '🦊', color: '#ef9860', price: 24 },
  { id: 'ladybug', name: 'Pünktchen-Marienkäfer', icon: '🐞', color: '#e65f59', price: 18 },
  { id: 'tiny-ghost', name: 'Nebel-Geistchen', icon: '👻', color: '#c4e6f3', price: 30 },
  { id: 'crown', name: 'Kleine Krone', icon: '👑', color: '#f1bf4a', price: 12 },
  { id: 'bow', name: 'Rosa Schleife', icon: '🎀', color: '#eb83ad', price: 10 },
  { id: 'glasses', name: 'Sternbrille', icon: '🤓', color: '#78a8c9', price: 14 },
];
const shopAbilities = [
  { id: 'extra-heart', name: 'Dicke Pfoten', icon: '💖', description: 'Du hältst einen zusätzlichen Treffer aus.', price: 100 },
  { id: 'fish-sense', name: 'Fisch-Sinn', icon: '🐟', description: 'Sammle Fische dauerhaft aus größerer Nähe.', price: 100 },
  { id: 'quick-paws', name: 'Flotte Pfoten', icon: '💨', description: 'Laufe dauerhaft ein wenig schneller.', price: 100 },
];
let fishWallet = 0;
let ownedCatColors = ['orange'];
let equippedCatColor = 'orange';
let ownedAccessories = [];
let equippedAccessory = null;
let ownedAbilities = [];
let activeLevel = 0;
let levelCompletePending = false;
let platforms = [];
let fish = [];
let enemies = [];
let flyingEnemies = [];
let questionBlocks = [];
let cardboardBoxes = [];
let powerupDrops = [];
let woolballs = [];
let waterballs = [];
let boss = null;

function loadLevel(index) {
  activeLevel = index;
  const config = levels[index];
  platforms = platformTemplate
    .map((platform, i) => ({ ...platform, y: config.heights[i] }))
    .filter((_, i) => index !== levels.length - 1 || i !== 15);
  const fishSlots = index === levels.length - 1
    ? [0, 1, 2, 4, 5, 6, 8, 9, 12, 13]
    : [0, 1, 2, 4, 5, 6, 8, 9, 12, 13, 15];
  fish = fishSlots.map(slot => ({
    x: platforms[slot].x + Math.round(platforms[slot].w * .4),
    y: platforms[slot].y - 44,
    collected: false,
    bob: Math.random() * Math.PI * 2,
  }));
  fish.push({ x: 3020, y: 425, collected: false, bob: Math.random() * Math.PI * 2 });
  questionBlocks = [1, 5, 8, 13].map((platformIndex, index) => ({
    x: platforms[platformIndex].x + Math.floor(platforms[platformIndex].w / 2) - 17,
    y: platforms[platformIndex].y - 98,
    w: 34,
    h: 34,
    used: false,
    powerup: powerupTypes[activeLevel === levels.length - 1 && index === 0
      ? powerupTypes.findIndex(powerup => powerup.id === 'woolball')
      : (index + activeLevel) % powerupTypes.length],
  }));
  powerupDrops = [];
  const boxSpots = [330, null, 1770, null, 2380, null];
  cardboardBoxes = boxSpots[index] === null ? [] : [{ x: boxSpots[index], y: 436, w: 44, h: 34, used: false }];
  woolballs = [];
  waterballs = [];
  boss = index === levels.length - 1
    ? { x: 2960, y: 378, w: 100, h: 88, hits: 0, defeated: false, shotTimer: 10 }
    : null;
  enemies = [
    { x: 990, min: 830, max: 1210, speed: config.speed, direction: 1, alive: true },
    { x: 1750, min: 1535, max: 2045, speed: config.speed * 1.08, direction: -1, alive: true },
    { x: 2400, min: 2250, max: 2650, speed: config.speed * .95, direction: 1, alive: true },
  ];
  flyingEnemies = [
    { x: 540, y: 242, min: 465, max: 650, speed: .78, direction: 1, alive: true, phase: 0 },
    { x: 1940, y: 220, min: 1855, max: 2045, speed: .88, direction: -1, alive: true, phase: 2 },
  ];
  levelName.textContent = `LEVEL ${index + 1}/${levels.length} · ${config.name}`;
  fishCount.textContent = `0 / ${fish.length}`;
}

const player = { x: 70, y: 390, w: 38, h: 48, vx: 0, vy: 0, grounded: false, facing: 1, invulnerable: 0 };
let cameraX = 0;
let collected = 0;
let levelCollected = 0;
let lives = 3;
let elapsedSeconds = 0;
let heldPowerup = null;
let activeEffect = null;
let effectTime = 0;
let bonusMode = false;
let bonusTime = 0;
let bonusFish = [];
let bonusFishCollected = 0;
let bonusReturnState = null;
let running = false;
let finished = false;
let previousTime = 0;
let jumpQueued = false;
let audioContext = null;
let soundEnabled = true;
let musicTimer = null;
let musicStep = 0;
let nextMusicStepTime = 0;
let musicMode = null;
let lastSaveAt = 0;

const GAME_SAVE_KEY = 'miezonauten-game-save-v1';
const PLAYER_STORE_KEY = 'miezonauten-players-v1';
const MAX_PLAYERS = 10;
let playerStore = { version: 1, accounts: [], selectedAccountId: null };

function activePlayer() {
  return playerStore.accounts.find(account => account.id === playerStore.selectedAccountId) || null;
}

function persistPlayerStore() {
  try {
    localStorage.setItem(PLAYER_STORE_KEY, JSON.stringify(playerStore));
  } catch {
    // Accounts und Fortschritt bleiben für die Sitzung nutzbar, falls Speicher nicht verfügbar ist.
  }
}

function parseLegacyValue(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function loadPlayerStore() {
  try {
    const saved = JSON.parse(localStorage.getItem(PLAYER_STORE_KEY) || 'null');
    if (saved && saved.version === 1 && Array.isArray(saved.accounts)) {
      playerStore = {
        version: 1,
        accounts: saved.accounts
          .filter(account => account && typeof account.id === 'string' && typeof account.name === 'string')
          .slice(0, MAX_PLAYERS),
        selectedAccountId: typeof saved.selectedAccountId === 'string' ? saved.selectedAccountId : null,
      };
      if (!activePlayer()) playerStore.selectedAccountId = null;
      return;
    }

    const legacyShopKeys = [
      'miezonauten-fish-wallet', 'miezonauten-cat-colors', 'miezonauten-cat-color',
      'miezonauten-accessories', 'miezonauten-equipped-accessory', 'miezonauten-abilities',
    ];
    const hasLegacyData = localStorage.getItem(GAME_SAVE_KEY) !== null ||
      legacyShopKeys.some(key => localStorage.getItem(key) !== null);
    if (hasLegacyData) {
      const account = {
        id: `player-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: 'Miez',
        gameSave: parseLegacyValue(GAME_SAVE_KEY, null),
        shop: {
          fishWallet: Number(localStorage.getItem('miezonauten-fish-wallet')) || 0,
          ownedCatColors: parseLegacyValue('miezonauten-cat-colors', ['orange']),
          equippedCatColor: localStorage.getItem('miezonauten-cat-color') || 'orange',
          ownedAccessories: parseLegacyValue('miezonauten-accessories', []),
          equippedAccessory: localStorage.getItem('miezonauten-equipped-accessory'),
          ownedAbilities: parseLegacyValue('miezonauten-abilities', []),
        },
      };
      playerStore = { version: 1, accounts: [account], selectedAccountId: account.id };
      persistPlayerStore();
    }
  } catch {
    playerStore = { version: 1, accounts: [], selectedAccountId: null };
  }
}

function renderPlayerList() {
  playerList.replaceChildren();
  if (!playerStore.accounts.length) {
    const empty = document.createElement('p');
    empty.className = 'player-empty';
    empty.textContent = 'Noch keine Spieler vorhanden. Lege mit ＋ den ersten Spieler an.';
    playerList.append(empty);
  }
  for (const account of playerStore.accounts) {
    const row = document.createElement('div');
    row.className = `player-row${account.id === playerStore.selectedAccountId ? ' selected' : ''}`;
    const name = document.createElement('span');
    name.className = 'player-name';
    name.textContent = account.name;
    const selectButton = document.createElement('button');
    selectButton.type = 'button';
    selectButton.textContent = account.id === playerStore.selectedAccountId ? 'Ausgewählt' : 'Wählen';
    selectButton.disabled = account.id === playerStore.selectedAccountId;
    selectButton.addEventListener('click', () => selectPlayer(account.id));
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-player-button';
    deleteButton.textContent = 'Löschen';
    deleteButton.setAttribute('aria-label', `${account.name} löschen`);
    deleteButton.addEventListener('click', () => deletePlayer(account.id));
    row.append(name, selectButton, deleteButton);
    playerList.append(row);
  }
  const atLimit = playerStore.accounts.length >= MAX_PLAYERS;
  addPlayerButton.disabled = atLimit;
  playerLimitMessage.classList.toggle('hidden', !atLimit);
}

function updateActivePlayerUI() {
  const account = activePlayer();
  const label = document.querySelector('#active-player-label');
  const chooseButton = document.querySelector('#choose-player-button');
  label.textContent = account ? `Spieler: ${account.name}` : 'Kein Spieler ausgewählt';
  chooseButton.textContent = account ? `Spieler wählen · ${account.name}` : 'Spieler wählen';
  document.querySelector('#start-button').disabled = !account;
  document.querySelector('#open-shop-button').disabled = !account;
  continueButton.disabled = !account;
  updateContinueButton();
}

function openPlayerPanel() {
  renderPlayerList();
  playerPanel.classList.remove('hidden');
  document.querySelector('#close-player-panel-button').focus();
}

function closePlayerPanel() {
  playerPanel.classList.add('hidden');
  document.querySelector('#choose-player-button').focus();
}

function selectPlayer(id) {
  const account = playerStore.accounts.find(item => item.id === id);
  if (!account) return;
  playerStore.selectedAccountId = id;
  persistPlayerStore();
  loadCatShopData();
  updateActivePlayerUI();
  renderPlayerList();
  closePlayerPanel();
}

function deletePlayer(id) {
  const account = playerStore.accounts.find(item => item.id === id);
  if (!account || !window.confirm(`Spieler „${account.name}“ und den gesamten persönlichen Fortschritt löschen?`)) return;
  playerStore.accounts = playerStore.accounts.filter(item => item.id !== id);
  if (playerStore.selectedAccountId === id) {
    playerStore.selectedAccountId = null;
    loadCatShopData();
  }
  persistPlayerStore();
  updateActivePlayerUI();
  renderPlayerList();
}

function addPlayer(name) {
  const trimmedName = name.trim().slice(0, 16);
  if (!trimmedName || playerStore.accounts.length >= MAX_PLAYERS) return;
  const account = {
    id: `player-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: trimmedName,
    gameSave: null,
    shop: null,
  };
  playerStore.accounts.push(account);
  playerStore.selectedAccountId = account.id;
  persistPlayerStore();
  loadCatShopData();
  updateActivePlayerUI();
  playerForm.reset();
  playerForm.classList.add('hidden');
  addPlayerButton.classList.remove('hidden');
  closePlayerPanel();
}

try {
  soundEnabled = localStorage.getItem('miezonauten-sound') !== 'off';
} catch {
  soundEnabled = true;
}

function updateSoundButton() {
  soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
  soundToggle.setAttribute('aria-pressed', String(soundEnabled));
  soundToggle.setAttribute('aria-label', soundEnabled ? 'Ton und Musik ausschalten' : 'Ton und Musik einschalten');
}

function loadCatShopData() {
  try {
    const shop = activePlayer()?.shop || {};
    fishWallet = Math.max(0, Number(shop.fishWallet) || 0);
    const savedOwned = shop.ownedCatColors || ['orange'];
    ownedCatColors = Array.isArray(savedOwned)
      ? [...new Set(['orange', ...savedOwned.filter(id => catColors.some(color => color.id === id))])]
      : ['orange'];
    const savedEquipped = shop.equippedCatColor || 'orange';
    equippedCatColor = ownedCatColors.includes(savedEquipped) ? savedEquipped : 'orange';
    const savedAccessories = shop.ownedAccessories || [];
    ownedAccessories = Array.isArray(savedAccessories)
      ? [...new Set(savedAccessories.filter(id => catAccessories.some(accessory => accessory.id === id)))]
      : [];
    const savedAccessory = shop.equippedAccessory;
    equippedAccessory = ownedAccessories.includes(savedAccessory) ? savedAccessory : null;
    const savedAbilities = shop.ownedAbilities || [];
    ownedAbilities = Array.isArray(savedAbilities)
      ? [...new Set(savedAbilities.filter(id => shopAbilities.some(ability => ability.id === id)))]
      : [];
  } catch {
    fishWallet = 0;
    ownedCatColors = ['orange'];
    equippedCatColor = 'orange';
    ownedAccessories = [];
    equippedAccessory = null;
    ownedAbilities = [];
  }
  updateShopWallet();
}

function updateShopWallet() {
  shopWallet.textContent = fishWallet.toLocaleString('de-DE');
  shopBalance.textContent = fishWallet.toLocaleString('de-DE');
}

function saveCatShopData() {
  const account = activePlayer();
  if (!account) return;
  account.shop = {
    fishWallet,
    ownedCatColors,
    equippedCatColor,
    ownedAccessories,
    equippedAccessory,
    ownedAbilities,
  };
  persistPlayerStore();
}

function readGameSave() {
  const saved = activePlayer()?.gameSave;
  if (!saved || saved.version !== 1 || !Number.isInteger(saved.activeLevel) ||
    saved.activeLevel < 0 || saved.activeLevel >= levels.length || !saved.player ||
    !Array.isArray(saved.fish) || !Array.isArray(saved.enemies) || !Array.isArray(saved.flyingEnemies)) {
    return null;
  }
  return saved;
}

function updateContinueButton() {
  continueButton.classList.toggle('hidden', !readGameSave());
}

function saveGame() {
  const account = activePlayer();
  if (!account || (!running && !levelCompletePending) || (finished && !levelCompletePending)) return;
  const saved = {
    version: 1,
    activeLevel,
    levelCompletePending,
    player: { ...player },
    cameraX,
    collected,
    levelCollected,
    lives,
    elapsedSeconds,
    fish: fish.map(item => ({ ...item })),
    enemies: enemies.map(enemy => ({ ...enemy })),
    flyingEnemies: flyingEnemies.map(enemy => ({ ...enemy })),
    questionBlocks: questionBlocks.map(block => ({ ...block })),
    cardboardBoxes: cardboardBoxes.map(box => ({ ...box })),
    powerupDrops: powerupDrops.map(drop => ({ ...drop })),
    woolballs: woolballs.map(ball => ({ ...ball })),
    waterballs: waterballs.map(ball => ({ ...ball })),
    boss: boss ? { ...boss } : null,
    heldPowerup,
    activeEffect,
    effectTime,
    bonusMode,
    bonusTime,
    bonusFish: bonusFish.map(item => ({ ...item })),
    bonusFishCollected,
    bonusReturnState: bonusReturnState ? { ...bonusReturnState } : null,
  };
  account.gameSave = saved;
  persistPlayerStore();
  updateContinueButton();
}

function clearGameSave() {
  const account = activePlayer();
  if (account) {
    account.gameSave = null;
    persistPlayerStore();
  }
  levelCompletePending = false;
  updateContinueButton();
}

function continueGame() {
  if (!activePlayer()) {
    openPlayerPanel();
    return;
  }
  const saved = readGameSave();
  if (!saved) {
    updateContinueButton();
    return;
  }
  loadLevel(saved.activeLevel);
  Object.assign(player, saved.player);
  cameraX = Number(saved.cameraX) || 0;
  collected = Number(saved.collected) || 0;
  levelCollected = Number(saved.levelCollected) || 0;
  lives = Math.max(1, Number(saved.lives) || 1);
  elapsedSeconds = Number(saved.elapsedSeconds) || 0;
  fish = saved.fish;
  enemies = saved.enemies;
  flyingEnemies = saved.flyingEnemies;
  if (Array.isArray(saved.questionBlocks)) questionBlocks = saved.questionBlocks;
  if (Array.isArray(saved.cardboardBoxes)) cardboardBoxes = saved.cardboardBoxes;
  if (Array.isArray(saved.powerupDrops)) powerupDrops = saved.powerupDrops;
  if (Array.isArray(saved.woolballs)) woolballs = saved.woolballs;
  if (Array.isArray(saved.waterballs)) waterballs = saved.waterballs;
  boss = saved.boss || null;
  heldPowerup = saved.heldPowerup || null;
  activeEffect = saved.activeEffect || null;
  effectTime = Number(saved.effectTime) || 0;
  bonusMode = Boolean(saved.bonusMode && saved.bonusReturnState);
  bonusTime = Number(saved.bonusTime) || 0;
  bonusFish = Array.isArray(saved.bonusFish) ? saved.bonusFish : [];
  bonusFishCollected = Number(saved.bonusFishCollected) || 0;
  bonusReturnState = bonusMode ? saved.bonusReturnState : null;
  levelCompletePending = Boolean(saved.levelCompletePending);
  lifeCount.textContent = String(lives);
  fishCount.textContent = bonusMode
    ? `BONUS ${bonusFishCollected} / 10`
    : `${levelCollected} / ${fish.length}`;
  updatePowerupDisplay();
  introCard.classList.add('hidden');
  shopPanel.classList.add('hidden');
  resultCard.classList.add('hidden');
  finished = false;
  running = !levelCompletePending;
  hudReturnToMenuButton.classList.toggle('hidden', !running);
  if (levelCompletePending) showResult({ won: true, campaignComplete: activeLevel === levels.length - 1 });
  else startBackgroundMusic();
}

function addFishToWallet(amount = 1) {
  fishWallet += amount;
  updateShopWallet();
  saveCatShopData();
  if (!shopPanel.classList.contains('hidden')) renderCatShop();
}

function renderCatShop() {
  colorShopList.replaceChildren();
  for (const option of catColors) {
    const card = document.createElement('article');
    card.className = `color-card${equippedCatColor === option.id ? ' equipped' : ''}${option.legendary ? ' legendary-card' : ''}${option.mythic ? ' mythic-card' : ''}${option.rare ? ' rare-card' : ''}${option.pattern ? ' pattern-card' : ''}`;
    const swatch = document.createElement('div');
    swatch.className = `cat-swatch${option.legendary ? ' legendary-swatch' : ''}${option.rare ? ' rare-swatch' : ''}${option.pattern ? ' pattern-swatch' : ''}`;
    swatch.style.background = option.id === 'slumber'
      ? 'linear-gradient(145deg, #5d86ad 0 42%, #f5e5c4 43% 72%, #405f82 73%)'
      : option.id === 'lavender-cloud'
        ? 'linear-gradient(135deg, #e1ccf6, #a98bd6 55%, #f4dff2)'
        : option.id === 'cinnamon'
          ? 'repeating-linear-gradient(135deg, #d9935e 0 8px, #8f4f3d 8px 11px, #efc18a 11px 17px)'
          : option.id === 'coral-reef'
            ? 'radial-gradient(circle at 30% 30%, #ffd38d 0 5%, transparent 6%), radial-gradient(circle at 70% 65%, #b95070 0 5%, transparent 6%), linear-gradient(145deg, #ef8b79, #f8c47e 55%, #d96f8c)'
            : option.id === 'forest-moss'
              ? 'linear-gradient(135deg, #b6cb75, #628b59 48%, #355c50)'
              : option.id === 'aurora'
                ? 'linear-gradient(135deg, #174f75, #46a99c 42%, #a4d990 68%, #755ab0)'
                : option.id === 'stardust'
                  ? 'radial-gradient(circle at 25% 30%, #fff2bd 0 4%, transparent 5%), radial-gradient(circle at 70% 65%, #fff2bd 0 3%, transparent 4%), linear-gradient(145deg, #343b70, #6872a8 55%, #b28be0)'
                  : option.id === 'cherry-blossom'
                    ? 'radial-gradient(circle at 28% 30%, #fff1f4 0 6%, transparent 7%), radial-gradient(circle at 72% 68%, #fff1f4 0 5%, transparent 6%), linear-gradient(145deg, #ec9ab5, #f6c6d1 58%, #b86f9a)'
                    : option.id === 'lagoon-shell'
                      ? 'linear-gradient(145deg, #baf7e7 0 24%, #55bfd0 25% 58%, #e6bd78 59% 76%, #936044 77%)'
      : option.id === 'rainbow'
      ? 'linear-gradient(135deg, #ff625d, #ffca55, #6dcf82, #55b8ee, #a777e8, #f079b6)'
      : option.id === 'galaxy'
        ? 'linear-gradient(135deg, #282452, #7558bd, #ed8bd0)'
        : option.id === 'gold'
          ? 'linear-gradient(135deg, #ffe98a, #e4a927, #fff2bd)'
            : option.id === 'thunder'
              ? 'linear-gradient(135deg, #fff58a 0 28%, #f6d84a 29% 62%, #fff2a1 63% 78%, #d89c32)'
              : option.id === 'phoenix'
                ? 'linear-gradient(145deg, #fff18a, #f0783c 48%, #c83d54 78%, #6f3a89)'
                : option.id === 'deep-sea'
                  ? 'radial-gradient(circle at 30% 25%, #aaf8e8 0 5%, transparent 6%), radial-gradient(circle at 70% 68%, #65e3dc 0 4%, transparent 5%), linear-gradient(145deg, #175b93, #32b9c9 55%, #b0f4dc)'
                  : option.id === 'crystal'
                    ? 'linear-gradient(135deg, #f9d4ff 0 20%, #b58bec 21% 47%, #f5e5ff 48% 62%, #8061c7 63% 78%, #d4b8ff)'
                    : option.id === 'emerald'
                      ? 'linear-gradient(135deg, #c1ffd0, #48b77b 45%, #167356 72%, #b4f1a4)'
            : option.id === 'tiger'
            ? 'repeating-linear-gradient(135deg, #f3a04d 0 7px, #4f3428 7px 10px, #f3a04d 10px 16px)'
            : option.id === 'leopard'
              ? 'radial-gradient(ellipse at 30% 30%, #4d3025 0 4%, transparent 5%), radial-gradient(ellipse at 70% 65%, #4d3025 0 5%, transparent 6%), radial-gradient(ellipse at 65% 25%, #7c4c2c 0 4%, transparent 5%), #d8a34b'
              : option.id === 'tuxedo'
                ? 'linear-gradient(135deg, #f1eee8 0 45%, #51485f 46% 65%, #f1eee8 66%)'
                : option.id === 'calico'
                  ? 'linear-gradient(135deg, #f0d7a5 0 35%, #e87543 36% 58%, #51485f 59% 75%, #f0d7a5 76%)'
                  : option.id === 'candy'
                    ? 'repeating-linear-gradient(135deg, #ef91be 0 8px, #fff0fb 8px 13px, #8bc7eb 13px 19px)'
                        : option.id === 'blue-tiger'
                          ? 'repeating-linear-gradient(135deg, #83d2f3 0 7px, #315c91 7px 10px, #83d2f3 10px 16px)'
                          : option.id === 'lavender-tiger'
                            ? 'repeating-linear-gradient(135deg, #d2a7f3 0 7px, #654888 7px 10px, #d2a7f3 10px 16px)'
                            : option.id === 'rose-leopard'
                              ? 'radial-gradient(ellipse at 30% 30%, #9a4664 0 4%, transparent 5%), radial-gradient(ellipse at 70% 65%, #9a4664 0 5%, transparent 6%), radial-gradient(ellipse at 65% 25%, #c16b80 0 4%, transparent 5%), #ef9fbd'
                              : option.id === 'arctic'
                                ? 'linear-gradient(135deg, #f8ffff 0 35%, #bdebf0 36% 62%, #e6f8ff 63% 78%, #bdebf0 79%)'
                                : option.id === 'sunset'
                                  ? 'linear-gradient(135deg, #f6c451, #f08c62 48%, #c96a91 78%, #705d9e)'
          : option.color;
    swatch.textContent = '🐱';
    const title = document.createElement('h3');
    title.textContent = option.name;
    const price = document.createElement('p');
    price.textContent = option.rare
      ? `💎 SELTEN · 🐟 ${option.price} Fische`
      : option.mythic
      ? `🔮 MYTHISCH · 🐟 ${option.price} Fische`
      : option.legendary ? `✨ LEGENDÄR · 🐟 ${option.price} Fische` : option.price === 0 ? 'Gratis' : `🐟 ${option.price} Fische`;
    const action = document.createElement('button');
    if (equippedCatColor === option.id) {
      action.textContent = 'Ausgerüstet';
      action.disabled = true;
    } else if (ownedCatColors.includes(option.id)) {
      action.textContent = 'Ausrüsten';
      action.addEventListener('click', () => equipCatColor(option.id));
    } else {
      action.textContent = fishWallet >= option.price ? 'Kaufen' : 'Zu wenig Fische';
      action.disabled = fishWallet < option.price;
      action.addEventListener('click', () => buyCatColor(option.id));
    }
    card.append(swatch, title, price, action);
    colorShopList.append(card);
  }
  accessoryShopList.replaceChildren();
  for (const option of catAccessories) {
    const card = document.createElement('article');
    card.className = `color-card${equippedAccessory === option.id ? ' equipped' : ''}`;
    const swatch = document.createElement('div');
    swatch.className = 'cat-swatch accessory-swatch pet-preview';
    swatch.style.background = 'transparent';
    swatch.textContent = option.icon;
    const title = document.createElement('h3');
    title.textContent = option.name;
    const price = document.createElement('p');
    price.textContent = `🐟 ${option.price} Fische`;
    const action = document.createElement('button');
    if (equippedAccessory === option.id) {
      action.textContent = 'Ausgerüstet';
      action.disabled = true;
    } else if (ownedAccessories.includes(option.id)) {
      action.textContent = 'Ausrüsten';
      action.addEventListener('click', () => equipAccessory(option.id));
    } else {
      action.textContent = fishWallet >= option.price ? 'Kaufen' : 'Zu wenig Fische';
      action.disabled = fishWallet < option.price;
      action.addEventListener('click', () => buyAccessory(option.id));
    }
    card.append(swatch, title, price, action);
    accessoryShopList.append(card);
  }
  abilityShopList.replaceChildren();
  for (const ability of shopAbilities) {
    const card = document.createElement('article');
    const swatch = document.createElement('div');
    swatch.className = 'cat-swatch accessory-swatch';
    swatch.style.background = 'linear-gradient(145deg, #fff5d8, #f3d9a1)';
    swatch.textContent = ability.icon;
    const title = document.createElement('h3');
    title.textContent = ability.name;
    const description = document.createElement('p');
    description.className = 'ability-description';
    description.textContent = ability.description;
    const price = document.createElement('p');
    price.textContent = `🐟 ${ability.price} Fische`;
    const action = document.createElement('button');
    if (ownedAbilities.includes(ability.id)) {
      card.className = 'color-card ability-card equipped';
      action.textContent = 'Gekauft ✓';
      action.disabled = true;
    } else {
      card.className = 'color-card ability-card';
      action.textContent = fishWallet >= ability.price ? 'Kaufen' : 'Zu wenig Fische';
      action.disabled = fishWallet < ability.price;
      action.addEventListener('click', () => buyAbility(ability.id));
    }
    card.append(swatch, title, description, price, action);
    abilityShopList.append(card);
  }
}

function buyCatColor(id) {
  const option = catColors.find(color => color.id === id);
  if (!option || ownedCatColors.includes(id) || fishWallet < option.price) return;
  fishWallet -= option.price;
  ownedCatColors.push(id);
  equippedCatColor = id;
  saveCatShopData();
  updateShopWallet();
  renderCatShop();
}

function equipCatColor(id) {
  if (!ownedCatColors.includes(id)) return;
  equippedCatColor = id;
  saveCatShopData();
  renderCatShop();
}

function buyAccessory(id) {
  const option = catAccessories.find(accessory => accessory.id === id);
  if (!option || ownedAccessories.includes(id) || fishWallet < option.price) return;
  fishWallet -= option.price;
  ownedAccessories.push(id);
  equippedAccessory = id;
  saveCatShopData();
  updateShopWallet();
  renderCatShop();
}

function equipAccessory(id) {
  if (id !== null && !ownedAccessories.includes(id)) return;
  equippedAccessory = id;
  saveCatShopData();
  renderCatShop();
}

function buyAbility(id) {
  const ability = shopAbilities.find(option => option.id === id);
  if (!ability || ownedAbilities.includes(id) || fishWallet < ability.price) return;
  fishWallet -= ability.price;
  ownedAbilities.push(id);
  saveCatShopData();
  updateShopWallet();
  renderCatShop();
}

function getEquippedCatColor() {
  return catColors.find(color => color.id === equippedCatColor)?.color || catColors[0].color;
}

function openCatShop() {
  if (!activePlayer()) return;
  renderCatShop();
  shopPanel.classList.remove('hidden');
  document.querySelector('#close-shop-button').focus();
}

function closeCatShop() {
  shopPanel.classList.add('hidden');
  document.querySelector('#open-shop-button').focus();
}

function playSound(name) {
  if (!soundEnabled) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  try {
    audioContext ||= new AudioContextClass();
    if (audioContext.state === 'suspended') audioContext.resume();
    const now = audioContext.currentTime;
    const patterns = {
      start: [[440, .09, 'sine'], [660, .1, 'sine'], [880, .16, 'sine']],
      jump: [[300, .11, 'triangle'], [460, .1, 'sine']],
      land: [[145, .055, 'triangle']],
      fish: [[740, .07, 'sine'], [1100, .12, 'sine']],
      block: [[250, .07, 'square'], [180, .09, 'triangle']],
      powerup: [[520, .09, 'sine'], [660, .09, 'sine'], [880, .16, 'sine']],
      activate: [[620, .1, 'triangle'], [920, .17, 'sine']],
      throw: [[330, .07, 'triangle'], [190, .12, 'sawtooth']],
      stomp: [[190, .12, 'triangle'], [135, .12, 'sine']],
      splash: [[520, .08, 'sine'], [310, .16, 'triangle']],
      hurt: [[300, .14, 'sawtooth'], [190, .2, 'triangle']],
      bonus: [[540, .09, 'sine'], [760, .09, 'sine'], [1020, .16, 'sine']],
      exit: [[760, .1, 'sine'], [520, .15, 'sine']],
      win: [[523, .14, 'sine'], [659, .14, 'sine'], [784, .14, 'sine'], [1046, .28, 'sine']],
    };
    const notes = patterns[name];
    if (!notes) return;
    let offset = 0;
    for (const [frequency, duration, type] of notes) {
      const oscillator = audioContext.createOscillator();
      const volume = audioContext.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now + offset);
      volume.gain.setValueAtTime(.0001, now + offset);
      volume.gain.exponentialRampToValueAtTime(.12, now + offset + .012);
      volume.gain.exponentialRampToValueAtTime(.0001, now + offset + duration);
      oscillator.connect(volume);
      volume.connect(audioContext.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + duration + .015);
      offset += duration * .72;
    }
  } catch {
    // Audio ist optional; blockierte oder nicht unterstützte Wiedergabe stoppt das Spiel nicht.
  }
}

function midiFrequency(note) {
  return 440 * 2 ** ((note - 69) / 12);
}

function scheduleMusicNote(frequency, startTime, duration, wave, volume) {
  if (!audioContext || !soundEnabled) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = wave;
  oscillator.frequency.setValueAtTime(midiFrequency(frequency), startTime);
  gain.gain.setValueAtTime(.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + .025);
  gain.gain.setValueAtTime(volume, Math.max(startTime + .03, startTime + duration - .06));
  gain.gain.exponentialRampToValueAtTime(.0001, startTime + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + .02);
}

function isNearBoss() {
  return Boolean(boss && !boss.defeated && Math.abs(player.x + player.w / 2 - (boss.x + boss.w / 2)) < 620);
}

function scheduleBossDrum(startTime, duration) {
  if (!audioContext || !soundEnabled) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(130, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(48, startTime + duration);
  gain.gain.setValueAtTime(.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(.075, startTime + .008);
  gain.gain.exponentialRampToValueAtTime(.0001, startTime + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + .01);
}

function scheduleMusic() {
  if (!audioContext || !soundEnabled || !running || finished) return;
  const nextMode = isNearBoss() ? 'boss' : 'level';
  if (musicMode !== nextMode) {
    musicMode = nextMode;
    musicStep = 0;
    nextMusicStepTime = audioContext.currentTime + .04;
  }
  const music = musicMode === 'boss' ? bossMusic : levelMusic[activeLevel];
  const stepDuration = 60 / music.bpm / 2;
  const scheduleAhead = .14;
  while (nextMusicStepTime < audioContext.currentTime + scheduleAhead) {
    const note = music.notes[musicStep];
    if (note !== null) {
      scheduleMusicNote(60 + note, nextMusicStepTime, stepDuration * .86, music.wave, .035);
    }
    const bassNote = music.bass[musicStep];
    if (bassNote !== null) {
      scheduleMusicNote((musicMode === 'boss' ? 36 : 43) + bassNote, nextMusicStepTime, stepDuration * 1.7, 'sine', musicMode === 'boss' ? .075 : .055);
    }
    if (musicMode === 'boss' && musicStep % 4 === 0) {
      scheduleBossDrum(nextMusicStepTime, stepDuration * .72);
    }
    nextMusicStepTime += stepDuration;
    musicStep = (musicStep + 1) % music.notes.length;
  }
}

function stopBackgroundMusic() {
  if (musicTimer !== null) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }
}

function startBackgroundMusic() {
  stopBackgroundMusic();
  if (!soundEnabled || !running || finished) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  try {
    audioContext ||= new AudioContextClass();
    if (audioContext.state === 'suspended') audioContext.resume();
    musicStep = 0;
    musicMode = null;
    nextMusicStepTime = audioContext.currentTime + .04;
    scheduleMusic();
    musicTimer = window.setInterval(scheduleMusic, 80);
  } catch {
    // Audio bleibt optional; das Spiel läuft auch ohne Hintergrundmusik weiter.
  }
}

function roundedRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function drawCloud(x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = 'rgba(255,255,255,.58)';
  ctx.beginPath();
  ctx.arc(0, 12, 22, 0, Math.PI * 2);
  ctx.arc(25, 2, 29, 0, Math.PI * 2);
  ctx.arc(57, 14, 21, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBackground() {
  const config = levels[activeLevel];
  const sky = ctx.createLinearGradient(0, 0, 0, 540);
  sky.addColorStop(0, config.sky[0]);
  sky.addColorStop(1, config.sky[1]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 960, 540);

  ctx.fillStyle = '#fff2bb';
  ctx.beginPath();
  ctx.arc(790, 105, 37, 0, Math.PI * 2);
  ctx.fill();
  drawCloud(125 - cameraX * .12 % 1120, 112, .85);
  drawCloud(515 - cameraX * .12 % 1120, 166, .64);
  drawCloud(905 - cameraX * .12 % 1120, 102, .9);

  ctx.fillStyle = config.hill;
  for (let i = 0; i < 7; i++) {
    const x = ((i * 190 - cameraX * .22) % 1330 + 1330) % 1330 - 190;
    ctx.beginPath();
    ctx.ellipse(x, 444, 150, 100 + (i % 3) * 15, 0, Math.PI, 0);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,255,255,.55)';
  for (let i = 0; i < 18; i++) {
    const x = ((i * 81 - cameraX * .35) % 1100 + 1100) % 1100;
    const y = 205 + (i * 47) % 195;
    ctx.beginPath();
    ctx.arc(x, y, 2 + i % 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawIsland(x, y, w, h) {
  const config = levels[activeLevel];
  ctx.fillStyle = config.dirt;
  roundedRect(x, y, w, h, 11);
  ctx.fill();
  ctx.fillStyle = config.grass;
  roundedRect(x, y - 5, w, 14, 8);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.32)';
  for (let i = 12; i < w - 8; i += 28) {
    ctx.beginPath();
    ctx.arc(x + i, y - 4, 3, Math.PI, 0);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,214,158,.42)';
  for (let i = 17; i < w - 8; i += 36) {
    ctx.beginPath();
    ctx.arc(x + i, y + 22 + (i % 3) * 7, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawFish(item, time) {
  if (item.collected) return;
  const bobY = Math.sin(time / 300 + item.bob) * 4;
  ctx.save();
  ctx.translate(item.x, item.y + bobY);
  ctx.fillStyle = '#f59a4a';
  ctx.beginPath();
  ctx.ellipse(0, 0, 11, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-8, 0); ctx.lineTo(-16, -6); ctx.lineTo(-16, 6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fff3cd';
  ctx.beginPath(); ctx.arc(5, -2, 1.6, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#d9743a'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(0, 0, 13, -.8, .8); ctx.stroke();
  ctx.restore();
}

function drawQuestionBlock(block, time) {
  ctx.save();
  const bounce = block.used ? 0 : Math.sin(time / 180 + block.x) * 1.5;
  ctx.translate(block.x, block.y + bounce);
  ctx.fillStyle = block.used ? '#b7a58d' : '#f6b742';
  roundedRect(0, 0, block.w, block.h, 7);
  ctx.fill();
  ctx.strokeStyle = block.used ? '#9a8872' : '#db9130';
  ctx.lineWidth = 2;
  roundedRect(1, 1, block.w - 2, block.h - 2, 6);
  ctx.stroke();
  ctx.fillStyle = block.used ? '#d5c9b9' : '#fff4cf';
  ctx.font = 'bold 24px "DM Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(block.used ? '·' : '?', block.w / 2, block.h / 2 + 1);
  ctx.restore();
}

function drawCardboardBox(box, time) {
  if (box.used) return;
  const x = box.x;
  const y = box.y + Math.sin(time / 300 + box.x) * 1.5;
  ctx.fillStyle = '#a86e40';
  roundedRect(x, y, box.w, box.h, 5);
  ctx.fill();
  ctx.strokeStyle = '#75482f';
  ctx.lineWidth = 2;
  roundedRect(x + 1, y + 1, box.w - 2, box.h - 2, 4);
  ctx.stroke();
  ctx.fillStyle = '#d9a66c';
  ctx.beginPath();
  ctx.moveTo(x + 4, y + 7); ctx.lineTo(x + 17, y + 3); ctx.lineTo(x + 22, y + 8);
  ctx.lineTo(x + 27, y + 3); ctx.lineTo(x + 40, y + 7); ctx.lineTo(x + 37, y + 13);
  ctx.lineTo(x + 7, y + 13); ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#6f452f';
  ctx.font = 'bold 17px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('?', x + box.w / 2, y + 24);
}

function drawBonusArea(time) {
  const sky = ctx.createLinearGradient(0, 0, 0, 540);
  sky.addColorStop(0, '#f8d7a4');
  sky.addColorStop(1, '#fff0d3');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255,255,255,.62)';
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.arc(55 + i * 77, 95 + (i % 3) * 52, 3 + i % 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#d5a16d';
  roundedRect(0, 465, canvas.width, 75, 0); ctx.fill();
  ctx.fillStyle = '#f1c48c';
  roundedRect(0, 452, canvas.width, 18, 8); ctx.fill();
  ctx.fillStyle = 'rgba(132,83,48,.15)';
  for (let x = 25; x < canvas.width; x += 90) {
    ctx.beginPath(); ctx.arc(x, 497 + (x % 3) * 4, 3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.textAlign = 'center';
  ctx.fillStyle = '#815638';
  ctx.font = 'bold 20px "DM Sans", sans-serif';
  ctx.fillText('KARTON-BONUSRAUM', 480, 60);
  ctx.font = '13px "DM Sans", sans-serif';
  ctx.fillText('Sammle so viele Fische wie möglich!', 480, 83);
  for (const item of bonusFish) drawFish(item, time);
}

function enterBonusArea(box) {
  playSound('bonus');
  box.used = true;
  bonusReturnState = {
    x: player.x,
    y: player.y,
    vx: player.vx,
    vy: player.vy,
    grounded: player.grounded,
    facing: player.facing,
    cameraX,
  };
  bonusFishCollected = 0;
  bonusTime = 10;
  bonusFish = Array.from({ length: 10 }, (_, index) => ({
    x: 65 + index * 91,
    y: 430,
    collected: false,
    bob: Math.random() * Math.PI * 2,
  }));
  player.x = 35;
  player.y = 417;
  player.vx = 0;
  player.vy = 0;
  player.grounded = true;
  cameraX = 0;
  bonusMode = true;
  fishCount.textContent = 'BONUS 0 / 10';
  saveGame();
}

function leaveBonusArea() {
  playSound('exit');
  bonusMode = false;
  collected += bonusFishCollected;
  player.x = bonusReturnState.x;
  player.y = bonusReturnState.y;
  player.vx = bonusReturnState.vx;
  player.vy = bonusReturnState.vy;
  player.grounded = bonusReturnState.grounded;
  player.facing = bonusReturnState.facing;
  player.invulnerable = Math.max(player.invulnerable, 45);
  cameraX = bonusReturnState.cameraX;
  bonusReturnState = null;
  bonusFish = [];
  fishCount.textContent = `${levelCollected} / ${fish.length}`;
  saveGame();
}

function updateBonusArea(dt, frame) {
  bonusTime = Math.max(0, bonusTime - dt / 1000);
  const speedBoost = ownedAbilities.includes('quick-paws') ? 1.2 : 1;
  player.vx = ((keys.right ? 1 : 0) - (keys.left ? 1 : 0)) * 4.1 * speedBoost;
  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x + player.vx * frame));
  if (jumpQueued && player.grounded) {
    player.vy = -12.8;
    player.grounded = false;
    playSound('jump');
  }
  jumpQueued = false;
  player.y += player.vy * frame;
  player.vy = Math.min(15, player.vy + GRAVITY * frame);
  if (player.y + player.h >= 465) {
    player.y = 465 - player.h;
    player.vy = 0;
    player.grounded = true;
  }
  for (const item of bonusFish) {
    if (!item.collected && Math.abs(player.x + player.w / 2 - item.x) < 24 &&
      Math.abs(player.y + player.h / 2 - item.y) < 32) {
      item.collected = true;
      bonusFishCollected++;
      addFishToWallet();
      playSound('fish');
      fishCount.textContent = `BONUS ${bonusFishCollected} / 10`;
      saveGame();
    }
  }
  if (bonusTime <= 0) leaveBonusArea();
}

function drawPowerupDrop(drop, time) {
  const bob = Math.sin(time / 150 + drop.bob) * 4;
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,.82)';
  ctx.beginPath();
  ctx.arc(drop.x + 17, drop.y + bob + 17, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = '22px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(drop.powerup.icon, drop.x + 17, drop.y + bob + 17);
  ctx.restore();
}

function updatePowerupDisplay() {
  if (activeEffect && effectTime > 0) {
    const type = powerupTypes.find(powerup => powerup.id === activeEffect);
    powerupIcon.textContent = type.icon;
    powerupLabel.textContent = `${type.name} · ${Math.ceil(effectTime)}s`;
    powerupDisplay.classList.remove('empty');
  } else if (heldPowerup) {
    powerupIcon.textContent = heldPowerup.icon;
    powerupLabel.textContent = heldPowerup.id === 'woolball'
      ? `${heldPowerup.name} · ${heldPowerup.charges} übrig`
      : `${heldPowerup.name} bereit`;
    powerupDisplay.classList.remove('empty');
  } else {
    powerupIcon.textContent = '✨';
    powerupLabel.textContent = 'Kein Power-up';
    powerupDisplay.classList.add('empty');
  }
}

function collectPowerup(block) {
  if (block.used) return;
  block.used = true;
  playSound('block');
  powerupDrops.push({
    x: block.x + (block.w - 34) / 2,
    y: block.y + block.h - 18,
    w: 34,
    h: 34,
    bob: Math.random() * Math.PI * 2,
    powerup: block.powerup,
  });
}

function activatePowerup() {
  if (!heldPowerup || !running || finished) return;
  if (heldPowerup.id === 'woolball') {
    playSound('throw');
    woolballs.push({
      x: player.x + (player.facing > 0 ? player.w : -14),
      y: player.y + 17,
      vx: player.facing * 7.5,
      vy: -2.5,
      radius: 13,
    });
    heldPowerup.charges--;
    if (heldPowerup.charges <= 0) heldPowerup = null;
    updatePowerupDisplay();
    return;
  }
  playSound('activate');
  activeEffect = heldPowerup.id;
  effectTime = heldPowerup.duration;
  heldPowerup = null;
  updatePowerupDisplay();
}

function drawRainbowWings() {
  const colors = ['#ff625d', '#ffca55', '#6dcf82', '#55b8ee', '#a777e8', '#f079b6'];
  const wingGradient = ctx.createLinearGradient(-42, -8, 42, 30);
  colors.forEach((color, index) => wingGradient.addColorStop(index / (colors.length - 1), color));

  for (const side of [-1, 1]) {
    ctx.fillStyle = wingGradient;
    ctx.strokeStyle = 'rgba(255,255,255,.92)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(side * 9, 29);
    ctx.bezierCurveTo(side * 14, 11, side * 29, -8, side * 40, -8);
    ctx.quadraticCurveTo(side * 43, 0, side * 37, 5);
    ctx.quadraticCurveTo(side * 45, 5, side * 42, 12);
    ctx.quadraticCurveTo(side * 37, 20, side * 31, 20);
    ctx.quadraticCurveTo(side * 34, 27, side * 26, 29);
    ctx.quadraticCurveTo(side * 18, 33, side * 10, 36);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,.75)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(side * 13, 30); ctx.quadraticCurveTo(side * 25, 16, side * 37, -4);
    ctx.moveTo(side * 17, 31); ctx.quadraticCurveTo(side * 29, 22, side * 41, 8);
    ctx.moveTo(side * 20, 32); ctx.quadraticCurveTo(side * 27, 29, side * 33, 22);
    ctx.stroke();
  }
}

function drawFloatingRainbows(x, y, time, scale = 1) {
  const colors = ['#ff625d', '#ff9e4f', '#ffdc58', '#6dcf82', '#55b8ee', '#a777e8'];
  const phase = time / 850;

  for (let index = 0; index < 3; index++) {
    const angle = phase + index * Math.PI * 2 / 3;
    const rainbowX = x + 5 * scale + Math.cos(angle) * 38 * scale;
    const rainbowY = y + 17 * scale + Math.sin(angle) * 27 * scale;
    const size = (13 + Math.sin(phase * 1.8 + index) * 1.2) * scale;

    ctx.save();
    ctx.translate(rainbowX, rainbowY);
    ctx.rotate(Math.sin(angle) * .32);
    ctx.globalAlpha = .9;
    colors.forEach((color, band) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.4 * scale;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 4 * scale, size - band * 1.8 * scale, Math.PI, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();
  }
}

function drawFloatingPlanets(x, y, time, scale = 1) {
  const phase = time / 1100;
  const planets = [
    { color: '#62d8ef', highlight: '#c5f8ff', size: 5.5 },
    { color: '#f5a1c8', highlight: '#ffe0ed', size: 6.5 },
    { color: '#ffc85b', highlight: '#fff0b5', size: 4.5 },
  ];

  planets.forEach((planet, index) => {
    const angle = phase + index * Math.PI * 2 / planets.length;
    const planetX = x + 5 * scale + Math.cos(angle) * 39 * scale;
    const planetY = y + 18 * scale + Math.sin(angle) * 30 * scale;
    const size = planet.size * scale;

    ctx.save();
    ctx.globalAlpha = .95;
    if (index === 1) {
      ctx.strokeStyle = 'rgba(255,230,174,.9)';
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.ellipse(planetX, planetY, size * 1.65, size * .58, -.35, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = planet.color;
    ctx.beginPath();
    ctx.arc(planetX, planetY, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = planet.highlight;
    ctx.beginPath();
    ctx.arc(planetX - size * .3, planetY - size * .3, size * .24, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawCat(x, y, scale = 1, color = '#f08c50', facing = 1, enemy = false, furStyle = null) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing * scale, scale);
  if (!enemy && furStyle === 'rainbow') {
    drawRainbowWings();
  }
  if (!enemy && furStyle === 'thunder') {
    ctx.fillStyle = '#b98024';
    ctx.beginPath();
    ctx.moveTo(-7, 35); ctx.lineTo(-20, 33); ctx.lineTo(-28, 25);
    ctx.lineTo(-19, 22); ctx.lineTo(-24, 9); ctx.lineTo(-8, 18);
    ctx.lineTo(-14, 27); ctx.lineTo(-7, 29); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f6d84a';
    ctx.beginPath();
    ctx.moveTo(-8, 33); ctx.lineTo(-19, 31); ctx.lineTo(-25, 25);
    ctx.lineTo(-16, 23); ctx.lineTo(-20, 13); ctx.lineTo(-10, 19);
    ctx.lineTo(-16, 28); ctx.lineTo(-8, 30); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,225,.85)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-18, 19); ctx.lineTo(-14, 22); ctx.stroke();
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = enemy ? 6 : 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-9, 34);
    ctx.bezierCurveTo(-22, 31, -22, 14, -12, 17);
    ctx.stroke();
  }
  if (!enemy && furStyle === 'phoenix') {
    ctx.fillStyle = '#9b3f58';
    ctx.beginPath();
    ctx.moveTo(-7, 24); ctx.quadraticCurveTo(-24, 6, -34, 13);
    ctx.quadraticCurveTo(-31, 19, -26, 22); ctx.quadraticCurveTo(-34, 21, -37, 26);
    ctx.quadraticCurveTo(-27, 31, -18, 32); ctx.lineTo(-7, 37); ctx.closePath();
    ctx.fill();
    ctx.moveTo(15, 23); ctx.quadraticCurveTo(29, 5, 39, 12);
    ctx.quadraticCurveTo(37, 19, 31, 22); ctx.quadraticCurveTo(39, 22, 42, 27);
    ctx.quadraticCurveTo(32, 32, 23, 32); ctx.lineTo(13, 37); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f0783c';
    ctx.beginPath();
    ctx.moveTo(-10, 25); ctx.quadraticCurveTo(-23, 12, -30, 16);
    ctx.quadraticCurveTo(-26, 24, -19, 28); ctx.lineTo(-9, 33); ctx.closePath();
    ctx.fill();
    ctx.moveTo(17, 25); ctx.quadraticCurveTo(28, 12, 35, 16);
    ctx.quadraticCurveTo(31, 24, 24, 28); ctx.lineTo(15, 33); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffd36e';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-27, 19); ctx.quadraticCurveTo(-20, 22, -15, 29);
    ctx.moveTo(-29, 25); ctx.lineTo(-19, 30);
    ctx.moveTo(32, 19); ctx.quadraticCurveTo(25, 22, 20, 29);
    ctx.moveTo(34, 25); ctx.lineTo(24, 30);
    ctx.stroke();
  }
  ctx.fillStyle = color;
  if (!enemy && furStyle === 'thunder') {
    ctx.beginPath();
    ctx.moveTo(-11, 15); ctx.lineTo(-8, -18); ctx.lineTo(4, 9); ctx.closePath(); ctx.fill();
    ctx.moveTo(10, 13); ctx.lineTo(21, -20); ctx.lineTo(25, 16); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#3b302d';
    ctx.beginPath();
    ctx.moveTo(-9, -7); ctx.lineTo(-8, -18); ctx.lineTo(-3, -6); ctx.closePath(); ctx.fill();
    ctx.moveTo(17, -8); ctx.lineTo(21, -20); ctx.lineTo(23, -7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f2bf42';
    ctx.beginPath();
    ctx.moveTo(-7, 6); ctx.lineTo(-6, -2); ctx.lineTo(0, 8); ctx.closePath(); ctx.fill();
    ctx.moveTo(15, 6); ctx.lineTo(19, -6); ctx.lineTo(21, 8); ctx.closePath(); ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(-10, 14); ctx.lineTo(-9, -1); ctx.lineTo(3, 9); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(11, 13); ctx.lineTo(17, -1); ctx.lineTo(23, 16); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffc5a2';
    ctx.beginPath(); ctx.moveTo(-6, 9); ctx.lineTo(-7, 4); ctx.lineTo(-2, 9); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(15, 10); ctx.lineTo(17, 5); ctx.lineTo(19, 11); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(3, 34, enemy ? 15 : 17, enemy ? 12 : 14, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(5, 16, enemy ? 16 : 18, 0, Math.PI * 2); ctx.fill();
  if (!enemy && furStyle) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(3, 34, 17, 14, 0, 0, Math.PI * 2);
    ctx.arc(5, 16, 18, 0, Math.PI * 2);
    ctx.clip();
    if (['slumber', 'lavender-cloud', 'cinnamon', 'coral-reef', 'forest-moss', 'aurora', 'stardust', 'cherry-blossom', 'lagoon-shell'].includes(furStyle)) {
      ctx.fillStyle = color;
      ctx.fillRect(-18, -5, 45, 59);
      if (furStyle === 'slumber') {
        ctx.fillStyle = '#f5e5c4';
        ctx.beginPath(); ctx.ellipse(6, 35, 14, 14, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#405f82'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(-10, 7); ctx.quadraticCurveTo(-3, 13, -9, 20); ctx.moveTo(15, 28); ctx.quadraticCurveTo(8, 34, 15, 40); ctx.stroke();
        ctx.fillStyle = '#d8b978';
        ctx.beginPath(); ctx.arc(18, 8, 5, 0, Math.PI * 2); ctx.fill();
      } else if (furStyle === 'lavender-cloud') {
        ctx.fillStyle = 'rgba(255,255,255,.82)';
        for (const [cloudX, cloudY] of [[-8, 9], [12, 4], [-7, 34], [15, 39]]) {
          ctx.beginPath(); ctx.arc(cloudX, cloudY, 5, 0, Math.PI * 2); ctx.fill();
        }
      } else if (furStyle === 'cinnamon') {
        ctx.strokeStyle = '#754438'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        for (const [stripeX, stripeY] of [[-10, 7], [13, 3], [-12, 29], [16, 34], [0, 45]]) {
          ctx.beginPath(); ctx.moveTo(stripeX - 3, stripeY); ctx.lineTo(stripeX + 3, stripeY + 8); ctx.stroke();
        }
      } else if (furStyle === 'coral-reef') {
        ctx.fillStyle = '#ffe0a0';
        for (const [spotX, spotY] of [[-9, 8], [14, 5], [-12, 33], [15, 39]]) {
          ctx.beginPath(); ctx.arc(spotX, spotY, 2.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.strokeStyle = '#b95070'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-8, 30); ctx.lineTo(-8, 22); ctx.lineTo(-12, 18);
        ctx.moveTo(-8, 22); ctx.lineTo(-4, 18);
        ctx.moveTo(11, 42); ctx.lineTo(11, 34); ctx.lineTo(7, 30);
        ctx.moveTo(11, 34); ctx.lineTo(15, 30);
        ctx.stroke();
        ctx.strokeStyle = '#ffdf9a'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(5, 10); ctx.lineTo(5, 4); ctx.lineTo(2, 1);
        ctx.moveTo(5, 4); ctx.lineTo(8, 1);
        ctx.stroke();
      } else if (furStyle === 'forest-moss') {
        ctx.strokeStyle = '#d0d98a'; ctx.lineWidth = 2;
        for (const [leafX, leafY] of [[-9, 9], [13, 7], [-11, 34], [12, 39]]) {
          ctx.beginPath(); ctx.moveTo(leafX - 4, leafY + 4); ctx.quadraticCurveTo(leafX, leafY - 5, leafX + 4, leafY + 1); ctx.quadraticCurveTo(leafX + 1, leafY + 8, leafX - 4, leafY + 4); ctx.stroke();
        }
      } else if (furStyle === 'aurora') {
        const lights = ctx.createLinearGradient(-18, 0, 22, 48);
        lights.addColorStop(0, 'rgba(82,229,199,.1)'); lights.addColorStop(.4, 'rgba(82,229,199,.9)'); lights.addColorStop(.7, 'rgba(197,255,150,.9)'); lights.addColorStop(1, 'rgba(192,139,255,.2)');
        ctx.fillStyle = lights; ctx.fillRect(-18, -5, 45, 59);
        ctx.strokeStyle = 'rgba(225,255,207,.85)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-13, 38); ctx.quadraticCurveTo(-4, 17, 4, 32); ctx.quadraticCurveTo(12, 44, 21, 15); ctx.stroke();
      } else if (furStyle === 'stardust') {
        const shimmer = ctx.createLinearGradient(-18, -5, 24, 54);
        shimmer.addColorStop(0, 'rgba(255,255,255,.25)');
        shimmer.addColorStop(.38, 'rgba(255,242,189,.1)');
        shimmer.addColorStop(.55, 'rgba(255,255,255,.72)');
        shimmer.addColorStop(.72, 'rgba(190,205,255,.08)');
        shimmer.addColorStop(1, 'rgba(255,255,255,.42)');
        ctx.fillStyle = shimmer;
        ctx.fillRect(-18, -5, 45, 59);
        ctx.fillStyle = '#fff9df';
        for (const [starX, starY, radius] of [[-9, 8, 2.2], [14, 5, 2], [-12, 30, 2.1], [15, 39, 2.4], [2, 47, 1.8], [-1, 25, 1.3], [9, 29, 1.2], [20, 17, 1.4]]) {
          ctx.beginPath(); ctx.arc(starX, starY, radius, 0, Math.PI * 2); ctx.fill();
        }
        ctx.strokeStyle = 'rgba(255,255,235,.95)';
        ctx.lineWidth = 1.1;
        for (const [sparkX, sparkY, size] of [[-9, 8, 4], [15, 39, 4.5], [2, 47, 3]]) {
          ctx.beginPath();
          ctx.moveTo(sparkX - size, sparkY); ctx.lineTo(sparkX + size, sparkY);
          ctx.moveTo(sparkX, sparkY - size); ctx.lineTo(sparkX, sparkY + size);
          ctx.stroke();
        }
      } else if (furStyle === 'cherry-blossom') {
        ctx.fillStyle = '#fff1f4';
        for (const [flowerX, flowerY] of [[-9, 9], [13, 6], [-12, 35], [14, 40]]) {
          for (let petal = 0; petal < 5; petal++) {
            const angle = petal * Math.PI * 2 / 5;
            ctx.beginPath(); ctx.arc(flowerX + Math.cos(angle) * 2.4, flowerY + Math.sin(angle) * 2.4, 1.8, 0, Math.PI * 2); ctx.fill();
          }
          ctx.fillStyle = '#e8b34f';
          ctx.beginPath(); ctx.arc(flowerX, flowerY, 1.2, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fff1f4';
        }
      } else if (furStyle === 'lagoon-shell') {
        ctx.fillStyle = '#b9814b';
        ctx.beginPath();
        ctx.ellipse(3, 36, 15, 11, -.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e6bd78';
        ctx.beginPath();
        ctx.ellipse(3, 35, 13, 9.5, -.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#936044';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(3, 35, 13, 9.5, -.08, 0, Math.PI * 2);
        ctx.moveTo(3, 26); ctx.lineTo(3, 44);
        ctx.moveTo(-8, 31); ctx.lineTo(-3, 34);
        ctx.moveTo(14, 31); ctx.lineTo(9, 34);
        ctx.moveTo(-8, 39); ctx.lineTo(-3, 37);
        ctx.moveTo(14, 39); ctx.lineTo(9, 37);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,239,184,.72)';
        ctx.beginPath();
        ctx.ellipse(-4, 30, 3.5, 1.5, -.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(230,255,255,.75)';
        ctx.beginPath(); ctx.ellipse(-8, 8, 2.2, 7, -.5, 0, Math.PI * 2); ctx.fill();
      }
    } else if (furStyle === 'rainbow') {
      const rainbow = ctx.createLinearGradient(-14, 0, 22, 38);
      rainbow.addColorStop(0, '#ff625d'); rainbow.addColorStop(.2, '#ffca55');
      rainbow.addColorStop(.4, '#6dcf82'); rainbow.addColorStop(.6, '#55b8ee');
      rainbow.addColorStop(.8, '#a777e8'); rainbow.addColorStop(1, '#f079b6');
      ctx.fillStyle = rainbow;
      ctx.fillRect(-18, -5, 45, 59);
    } else if (furStyle === 'galaxy') {
      const galaxy = ctx.createLinearGradient(-12, 0, 21, 40);
      galaxy.addColorStop(0, '#282452'); galaxy.addColorStop(.5, '#7558bd'); galaxy.addColorStop(1, '#ed8bd0');
      ctx.fillStyle = galaxy;
      ctx.fillRect(-18, -5, 45, 59);
      ctx.fillStyle = '#fff3c9';
      for (const [starX, starY] of [[-5, 8], [14, 4], [-8, 29], [16, 36], [7, 45]]) {
        ctx.beginPath(); ctx.arc(starX, starY, 1.2, 0, Math.PI * 2); ctx.fill();
      }
    } else if (furStyle === 'gold') {
      const shimmer = performance.now() / 900;
      const gold = ctx.createLinearGradient(-18, -5, 27, 54);
      gold.addColorStop(0, '#fff3a3');
      gold.addColorStop(.24 + Math.sin(shimmer) * .08, '#ffe16a');
      gold.addColorStop(.52, '#d99416');
      gold.addColorStop(.76 + Math.cos(shimmer) * .08, '#fff0a0');
      gold.addColorStop(1, '#e4a51e');
      ctx.fillStyle = gold;
      ctx.fillRect(-18, -5, 45, 59);
      for (const [shineX, shineY] of [[-5, 8], [14, 5], [-8, 30], [15, 37], [5, 45]]) {
        const twinkle = .55 + (Math.sin(shimmer * 2 + shineX) + 1) * .45;
        ctx.globalAlpha = twinkle;
        ctx.fillStyle = '#fffde0';
        ctx.beginPath(); ctx.arc(shineX, shineY, 1.3 + twinkle * .8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else if (furStyle === 'thunder') {
      const lightning = ctx.createLinearGradient(-18, -5, 24, 50);
      lightning.addColorStop(0, '#fff58a'); lightning.addColorStop(.5, '#f6d84a'); lightning.addColorStop(1, '#d89c32');
      ctx.fillStyle = lightning;
      ctx.fillRect(-18, -5, 45, 59);
      ctx.fillStyle = '#fffbe0';
      ctx.beginPath(); ctx.moveTo(6, 2); ctx.lineTo(-2, 20); ctx.lineTo(5, 20); ctx.lineTo(0, 34); ctx.lineTo(15, 14); ctx.lineTo(8, 14); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-12, 35); ctx.lineTo(-17, 45); ctx.lineTo(-11, 44); ctx.lineTo(-14, 52); ctx.lineTo(-5, 41); ctx.lineTo(-10, 42); ctx.closePath(); ctx.fill();
    } else if (furStyle === 'phoenix') {
      const flame = ctx.createLinearGradient(-12, -5, 17, 54);
      flame.addColorStop(0, '#fff18a'); flame.addColorStop(.42, '#f0783c'); flame.addColorStop(1, '#983e79');
      ctx.fillStyle = flame;
      ctx.fillRect(-18, -5, 45, 59);
      ctx.strokeStyle = '#ffe58a'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      for (const [flameX, flameY] of [[-10, 20], [3, 5], [17, 24], [-6, 39], [13, 45]]) {
        ctx.beginPath(); ctx.moveTo(flameX, flameY + 8); ctx.quadraticCurveTo(flameX + 5, flameY + 2, flameX + 2, flameY - 5); ctx.stroke();
      }
    } else if (furStyle === 'deep-sea') {
      const ocean = ctx.createLinearGradient(-18, -5, 20, 54);
      ocean.addColorStop(0, '#175b93'); ocean.addColorStop(.55, '#32b9c9'); ocean.addColorStop(1, '#b0f4dc');
      ctx.fillStyle = ocean;
      ctx.fillRect(-18, -5, 45, 59);
      ctx.fillStyle = 'rgba(210,255,239,.85)';
      for (const [bubbleX, bubbleY, radius] of [[-8, 9, 2], [15, 3, 1.5], [-11, 32, 1.5], [14, 42, 2.5], [4, 48, 1.3]]) {
        ctx.beginPath(); ctx.arc(bubbleX, bubbleY, radius, 0, Math.PI * 2); ctx.fill();
      }
      ctx.strokeStyle = 'rgba(170,255,232,.8)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-13, 17); ctx.quadraticCurveTo(-3, 12, 4, 18); ctx.moveTo(8, 30); ctx.quadraticCurveTo(14, 25, 20, 29); ctx.stroke();
    } else if (furStyle === 'crystal') {
      const crystal = ctx.createLinearGradient(-18, -5, 27, 54);
      crystal.addColorStop(0, '#f9d4ff'); crystal.addColorStop(.38, '#b58bec'); crystal.addColorStop(.7, '#8061c7'); crystal.addColorStop(1, '#e8d5ff');
      ctx.fillStyle = crystal;
      ctx.fillRect(-18, -5, 45, 59);
      ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-12, 11); ctx.lineTo(-4, 3); ctx.lineTo(2, 13); ctx.lineTo(-2, 24); ctx.closePath();
      ctx.moveTo(8, 5); ctx.lineTo(18, 12); ctx.lineTo(12, 23); ctx.lineTo(5, 17); ctx.closePath();
      ctx.moveTo(-10, 34); ctx.lineTo(-2, 28); ctx.lineTo(4, 40); ctx.lineTo(-5, 48); ctx.closePath();
      ctx.stroke();
    } else if (furStyle === 'emerald') {
      const emerald = ctx.createLinearGradient(-18, -5, 22, 54);
      emerald.addColorStop(0, '#e1ffe4'); emerald.addColorStop(.22, '#79e9a1'); emerald.addColorStop(.42, '#48b77b'); emerald.addColorStop(.68, '#167356'); emerald.addColorStop(.86, '#57c987'); emerald.addColorStop(1, '#ddffc0');
      ctx.fillStyle = emerald;
      ctx.fillRect(-18, -5, 45, 59);
      ctx.fillStyle = 'rgba(240,255,220,.76)';
      ctx.beginPath();
      ctx.ellipse(-8, 8, 3, 10, -.45, 0, Math.PI * 2);
      ctx.ellipse(14, 33, 2.4, 7, .4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(220,255,185,.96)'; ctx.lineWidth = 2;
      for (const [leafX, leafY] of [[-9, 11], [14, 8], [-10, 34], [13, 39]]) {
        ctx.beginPath(); ctx.moveTo(leafX - 4, leafY + 4); ctx.quadraticCurveTo(leafX, leafY - 5, leafX + 4, leafY + 1); ctx.quadraticCurveTo(leafX + 1, leafY + 8, leafX - 4, leafY + 4); ctx.moveTo(leafX - 3, leafY + 3); ctx.lineTo(leafX + 2, leafY); ctx.stroke();
      }
      ctx.fillStyle = '#f4ffd2';
      for (const [sparkX, sparkY, radius] of [[-4, 4, 1.8], [17, 18, 1.4], [-13, 28, 1.5], [5, 45, 1.7]]) {
        ctx.beginPath(); ctx.arc(sparkX, sparkY, radius, 0, Math.PI * 2); ctx.fill();
      }
      ctx.strokeStyle = 'rgba(246,255,215,.95)'; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-4, 1); ctx.lineTo(-4, 7); ctx.moveTo(-7, 4); ctx.lineTo(-1, 4);
      ctx.moveTo(5, 42); ctx.lineTo(5, 48); ctx.moveTo(2, 45); ctx.lineTo(8, 45);
      ctx.stroke();
    } else if (furStyle === 'tiger') {
      ctx.fillStyle = '#f3a04d';
      ctx.fillRect(-18, -5, 45, 59);
      ctx.strokeStyle = '#4f3428'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      for (const [stripeX, stripeY] of [[-10, 5], [2, 1], [16, 5], [-12, 27], [20, 25], [-5, 45], [12, 43]]) {
        ctx.beginPath(); ctx.moveTo(stripeX, stripeY); ctx.lineTo(stripeX - 4, stripeY + 9); ctx.stroke();
      }
    } else if (furStyle === 'leopard') {
      ctx.fillStyle = '#d8a34b';
      ctx.fillRect(-18, -5, 45, 59);
      ctx.fillStyle = '#4d3025';
      for (const [spotX, spotY] of [[-8, 7], [6, 3], [18, 9], [-12, 24], [14, 27], [-2, 42], [20, 44]]) {
        ctx.beginPath(); ctx.ellipse(spotX, spotY, 2.4, 3.2, .4, 0, Math.PI * 2); ctx.fill();
      }
    } else if (furStyle === 'tuxedo') {
      ctx.fillStyle = '#f1eee8';
      ctx.fillRect(-18, -5, 45, 59);
      ctx.fillStyle = '#51485f';
      ctx.beginPath(); ctx.ellipse(3, 35, 10, 13, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(14, 15, 7, 12, -.3, 0, Math.PI * 2); ctx.fill();
    } else if (furStyle === 'calico') {
      ctx.fillStyle = '#f0d7a5';
      ctx.fillRect(-18, -5, 45, 59);
      ctx.fillStyle = '#e87543';
      ctx.beginPath(); ctx.ellipse(-3, 12, 9, 8, -.4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(10, 37, 10, 8, .4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#51485f';
      ctx.beginPath(); ctx.ellipse(15, 12, 7, 9, .3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(-5, 39, 8, 7, -.5, 0, Math.PI * 2); ctx.fill();
    } else if (furStyle === 'candy') {
      const candy = ctx.createLinearGradient(-18, -5, 27, 54);
      candy.addColorStop(0, '#ef91be'); candy.addColorStop(.35, '#fff0fb');
      candy.addColorStop(.68, '#8bc7eb'); candy.addColorStop(1, '#ef91be');
      ctx.fillStyle = candy;
      ctx.fillRect(-18, -5, 45, 59);
      ctx.strokeStyle = 'rgba(255,255,255,.82)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-12, 29); ctx.quadraticCurveTo(3, 16, 19, 27); ctx.stroke();
    } else if (furStyle === 'blue-tiger' || furStyle === 'lavender-tiger') {
      const base = furStyle === 'blue-tiger' ? '#83d2f3' : '#d2a7f3';
      const stripe = furStyle === 'blue-tiger' ? '#315c91' : '#654888';
      ctx.fillStyle = base;
      ctx.fillRect(-18, -5, 45, 59);
      ctx.strokeStyle = stripe; ctx.lineWidth = 4; ctx.lineCap = 'round';
      for (const [stripeX, stripeY] of [[-10, 5], [2, 1], [16, 5], [-12, 27], [20, 25], [-5, 45], [12, 43]]) {
        ctx.beginPath(); ctx.moveTo(stripeX, stripeY); ctx.lineTo(stripeX - 4, stripeY + 9); ctx.stroke();
      }
    } else if (furStyle === 'rose-leopard') {
      ctx.fillStyle = '#ef9fbd';
      ctx.fillRect(-18, -5, 45, 59);
      ctx.fillStyle = '#9a4664';
      for (const [spotX, spotY] of [[-8, 7], [6, 3], [18, 9], [-12, 24], [14, 27], [-2, 42], [20, 44]]) {
        ctx.beginPath(); ctx.ellipse(spotX, spotY, 2.4, 3.2, .4, 0, Math.PI * 2); ctx.fill();
      }
    } else if (furStyle === 'arctic') {
      const ice = ctx.createLinearGradient(-18, -5, 27, 54);
      ice.addColorStop(0, '#f8ffff'); ice.addColorStop(.45, '#bdebf0'); ice.addColorStop(.72, '#e6f8ff'); ice.addColorStop(1, '#9edeea');
      ctx.fillStyle = ice;
      ctx.fillRect(-18, -5, 45, 59);
      ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-8, 4); ctx.lineTo(1, 21); ctx.lineTo(-5, 35); ctx.moveTo(14, 2); ctx.lineTo(7, 17); ctx.lineTo(17, 31); ctx.stroke();
    } else if (furStyle === 'sunset') {
      const sunset = ctx.createLinearGradient(-18, -5, 27, 54);
      sunset.addColorStop(0, '#f6c451'); sunset.addColorStop(.48, '#f08c62'); sunset.addColorStop(.78, '#c96a91'); sunset.addColorStop(1, '#705d9e');
      ctx.fillStyle = sunset;
      ctx.fillRect(-18, -5, 45, 59);
      ctx.fillStyle = 'rgba(255,243,204,.75)';
      ctx.beginPath(); ctx.arc(13, 8, 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  if (!enemy && furStyle === 'deep-sea') {
    ctx.fillStyle = '#123f70';
    roundedRect(-9, 28, 24, 16, 5); ctx.fill();
    ctx.fillStyle = '#258bd0';
    roundedRect(-8, 29, 22, 13, 4); ctx.fill();
    ctx.fillStyle = '#8de8f2';
    roundedRect(-1, 30, 4, 10, 2); ctx.fill();
    ctx.strokeStyle = '#d7fbff';
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(-8, 33); ctx.lineTo(-12, 31); ctx.moveTo(13, 33); ctx.lineTo(17, 30); ctx.stroke();
    ctx.fillStyle = '#164a7a';
    roundedRect(16, 24, 7, 17, 3); ctx.fill();
    ctx.fillStyle = '#52bce7';
    roundedRect(17.5, 26, 4, 12, 2); ctx.fill();
    ctx.fillStyle = '#e5faff';
    roundedRect(18, 22, 3, 3, 1); ctx.fill();
    ctx.strokeStyle = '#123f70';
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-5, 15); ctx.lineTo(-11, 13); ctx.moveTo(16, 15); ctx.lineTo(22, 13); ctx.stroke();
    ctx.fillStyle = '#123f70';
    ctx.beginPath(); ctx.roundRect(-5, 9, 11, 12, 4); ctx.roundRect(5, 9, 11, 12, 4); ctx.fill();
    ctx.fillStyle = '#66cbe7';
    ctx.beginPath(); ctx.roundRect(-3, 11, 7, 8, 3); ctx.roundRect(7, 11, 7, 8, 3); ctx.fill();
    ctx.fillStyle = 'rgba(226,255,255,.85)';
    ctx.beginPath(); ctx.ellipse(-1, 13, 1.3, 2, -.4, 0, Math.PI * 2); ctx.ellipse(9, 13, 1.3, 2, -.4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#123f70';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(4, 15); ctx.lineTo(7, 15); ctx.stroke();
  }
  ctx.fillStyle = '#fff7e9';
  ctx.beginPath(); ctx.ellipse(5, 22, 9, 6, 0, 0, Math.PI * 2); ctx.fill();
  if (!enemy && furStyle === 'slumber') {
    ctx.strokeStyle = '#453830';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-2, 15); ctx.quadraticCurveTo(0, 17, 2, 15);
    ctx.moveTo(9, 15); ctx.quadraticCurveTo(11, 17, 13, 15);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#453830';
    ctx.beginPath(); ctx.ellipse(0, 15, 1.7, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(11, 15, 1.7, 2.5, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#d77f70';
  ctx.beginPath(); ctx.moveTo(4, 20); ctx.lineTo(7, 20); ctx.lineTo(5.5, 22); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#5c4337'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(5.5, 22); ctx.lineTo(5.5, 24); ctx.quadraticCurveTo(3, 27, 1, 24); ctx.moveTo(5.5, 24); ctx.quadraticCurveTo(8, 27, 10, 24); ctx.stroke();
  ctx.strokeStyle = 'rgba(77,57,47,.65)'; ctx.lineWidth = .8;
  ctx.beginPath(); ctx.moveTo(-1, 22); ctx.lineTo(-9, 20); ctx.moveTo(-1, 24); ctx.lineTo(-9, 25); ctx.moveTo(12, 22); ctx.lineTo(20, 20); ctx.moveTo(12, 24); ctx.lineTo(20, 25); ctx.stroke();
  if (!enemy && furStyle === 'gold') {
    const coinFloat = Math.sin(performance.now() / 260) * 1.2;
    for (const [coinX, coinY, radius] of [[-1, -3, 5], [8, -7, 5.5], [17, -3, 4.5]]) {
      ctx.fillStyle = '#b87512';
      ctx.beginPath(); ctx.ellipse(coinX, coinY + coinFloat, radius + 1, radius * .82 + 1, -.15, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffd95b';
      ctx.beginPath(); ctx.ellipse(coinX, coinY + coinFloat, radius, radius * .82, -.15, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#fff2a1';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.ellipse(coinX, coinY + coinFloat, radius * .62, radius * .5, -.15, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#fff8c9';
      ctx.beginPath(); ctx.arc(coinX - radius * .28, coinY - radius * .3 + coinFloat, 1.2, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (!enemy && furStyle === 'thunder') {
    ctx.fillStyle = '#ed5b5b';
    ctx.beginPath(); ctx.arc(-8, 22, 3.5, 0, Math.PI * 2); ctx.arc(19, 22, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,235,218,.75)';
    ctx.beginPath(); ctx.arc(-9, 21, 1, 0, Math.PI * 2); ctx.arc(18, 21, 1, 0, Math.PI * 2); ctx.fill();
  }
  if (!enemy) {
    ctx.fillStyle = '#fff4da';
    roundedRect(-5, 39, 16, 8, 4); ctx.fill();
    ctx.fillStyle = '#ef9d59';
    roundedRect(3, 38, 4, 3, 2); ctx.fill();
    if (equippedAccessory === 'blue-woolball') {
      const pet = catAccessories.find(accessory => accessory.id === equippedAccessory);
      ctx.fillStyle = pet.color;
      ctx.beginPath(); ctx.arc(29, 38, 9, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(29, 38, 5, -.8, 2.4); ctx.stroke();
      ctx.fillStyle = '#473b37';
      ctx.beginPath(); ctx.arc(26, 36, 1, 0, Math.PI * 2); ctx.arc(32, 36, 1, 0, Math.PI * 2); ctx.fill();
    } else if (equippedAccessory === 'crown') {
      ctx.fillStyle = '#f1bf4a';
      ctx.beginPath();
      ctx.moveTo(-5, 5); ctx.lineTo(-3, -6); ctx.lineTo(3, 0); ctx.lineTo(8, -8);
      ctx.lineTo(14, 0); ctx.lineTo(20, -6); ctx.lineTo(21, 5); ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fff2b0';
      ctx.beginPath(); ctx.arc(3, 2, 1.3, 0, Math.PI * 2); ctx.arc(8, 0, 1.3, 0, Math.PI * 2); ctx.arc(15, 2, 1.3, 0, Math.PI * 2); ctx.fill();
    } else if (equippedAccessory === 'bow') {
      ctx.fillStyle = '#eb83ad';
      ctx.beginPath();
      ctx.moveTo(12, 31); ctx.lineTo(4, 25); ctx.lineTo(5, 34); ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(14, 31); ctx.lineTo(22, 25); ctx.lineTo(21, 34); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(13, 30, 3, 0, Math.PI * 2); ctx.fill();
    } else if (equippedAccessory === 'glasses') {
      ctx.strokeStyle = '#467b9e'; ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 15, 5, 0, Math.PI * 2); ctx.arc(11, 15, 5, 0, Math.PI * 2);
      ctx.moveTo(5, 15); ctx.lineTo(6, 15); ctx.moveTo(-5, 14); ctx.lineTo(-9, 13);
      ctx.moveTo(16, 14); ctx.lineTo(20, 13); ctx.stroke();
    }
  }
  ctx.restore();
}

function drawPetCompanion(x, y, time, scale = 1) {
  if (!equippedAccessory || equippedAccessory === 'crown' || equippedAccessory === 'bow' || equippedAccessory === 'glasses') return;
  const pet = catAccessories.find(accessory => accessory.id === equippedAccessory);
  if (!pet) return;
  const bob = Math.sin(time / 180) * 4;
  ctx.save();
  ctx.translate(x + 45 * scale, y + 20 * scale + bob * scale);
  ctx.scale(scale, scale);
  ctx.font = '24px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(pet.icon, 0, 0);
  ctx.restore();
}

function drawFlyingEnemy(enemy, time) {
  ctx.save();
  ctx.translate(enemy.x + 8, enemy.y + 24);
  ctx.fillStyle = 'rgba(255,255,255,.82)';
  ctx.beginPath();
  ctx.ellipse(-10, Math.sin(time / 95 + enemy.phase) * 3, 10, 5, -.35, 0, Math.PI * 2);
  ctx.ellipse(10, -Math.sin(time / 95 + enemy.phase) * 3, 10, 5, .35, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  drawCat(enemy.x, enemy.y, .72, '#9b82cb', enemy.direction, true);
}

function drawGoal() {
  const x = 3120;
  ctx.fillStyle = 'rgba(93,92,80,.12)';
  ctx.beginPath(); ctx.ellipse(x + 54, 466, 75, 12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ddaa78';
  roundedRect(x, 365, 108, 100, 15); ctx.fill();
  ctx.fillStyle = '#f6c88e';
  ctx.beginPath(); ctx.moveTo(x - 9, 373); ctx.lineTo(x + 54, 320); ctx.lineTo(x + 117, 373); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fff1cb';
  roundedRect(x + 40, 411, 29, 54, 14); ctx.fill();
  if (boss && !boss.defeated) {
    ctx.fillStyle = '#a77858';
    roundedRect(x + 40, 411, 29, 54, 14); ctx.fill();
    ctx.fillStyle = '#ffe39a';
    ctx.beginPath(); ctx.arc(x + 54, 433, 4, 0, Math.PI * 2); ctx.fill();
    roundedRect(x + 52, 433, 5, 12, 2); ctx.fill();
  }
  ctx.fillStyle = '#efbd7c';
  roundedRect(x + 13, 385, 18, 23, 8); ctx.fill();
  roundedRect(x + 77, 385, 18, 23, 8); ctx.fill();
  ctx.fillStyle = '#fff1cb';
  ctx.beginPath(); ctx.arc(x + 22, 394, 3, 0, Math.PI * 2); ctx.arc(x + 86, 394, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff8e6';
  ctx.beginPath(); ctx.arc(x + 54, 346, 8, 0, Math.PI * 2); ctx.fill();
  ctx.font = 'bold 12px "DM Sans", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#9b6a48';
  ctx.fillText('WOLLSCHLOSS', x + 54, 395);
  if (boss && !boss.defeated) {
    ctx.font = 'bold 9px "DM Sans", sans-serif';
    ctx.fillStyle = '#9b6a48';
    ctx.fillText('BOSS BESIEGEN!', x + 54, 405);
  }
}

function drawBoss() {
  if (!boss || boss.defeated) return;
  drawCat(boss.x, boss.y, 1.8, '#8063a6', -1, true);
  ctx.save();
  ctx.translate(boss.x + 14, boss.y - 20);
  ctx.fillStyle = '#f6c65e';
  ctx.beginPath();
  ctx.moveTo(0, 20); ctx.lineTo(3, 0); ctx.lineTo(15, 11); ctx.lineTo(26, -3);
  ctx.lineTo(36, 11); ctx.lineTo(48, 0); ctx.lineTo(51, 20); ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fff0bd';
  ctx.beginPath(); ctx.arc(15, 12, 2, 0, Math.PI * 2); ctx.arc(36, 12, 2, 0, Math.PI * 2); ctx.fill();
  ctx.font = 'bold 12px "DM Sans", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#6f4f82';
  ctx.fillText(`BOSS · ${boss.hits}/3`, 26, -14);
  ctx.restore();
}

function drawProjectiles(time) {
  for (const ball of woolballs) {
    ctx.save();
    ctx.fillStyle = '#e5a5d1';
    ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#a75d9a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(ball.x, ball.y, 7, time / 170, time / 170 + Math.PI * 1.6); ctx.stroke();
    ctx.restore();
  }
  for (const ball of waterballs) {
    ctx.save();
    ctx.fillStyle = '#64c8ed';
    ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.82)';
    ctx.beginPath(); ctx.arc(ball.x - 4, ball.y - 5, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function resetPlayer() {
  player.x = 70; player.y = 390; player.vx = 0; player.vy = 0;
  player.grounded = false; player.invulnerable = 100;
  cameraX = 0;
}

function update(dt) {
  const frame = Math.min(dt / 16.67, 2);
  elapsedSeconds += dt / 1000;
  if (bonusMode) {
    updateBonusArea(dt, frame);
    return;
  }
  if (effectTime > 0) {
    effectTime = Math.max(0, effectTime - dt / 1000);
    if (effectTime === 0) activeEffect = null;
  }
  player.vx = ((keys.right ? 1 : 0) - (keys.left ? 1 : 0)) * 4.1;
  if (activeEffect === 'zoomies') player.vx *= 1.65;
  if (ownedAbilities.includes('quick-paws')) player.vx *= 1.2;
  if (player.vx !== 0) player.facing = Math.sign(player.vx);
  const wasGrounded = player.grounded;
  if (activeEffect === 'flight') {
    if (keys.jump) player.vy = -3.2;
    else player.vy = Math.min(player.vy + .12 * frame, 1.8);
    player.grounded = false;
  } else if (jumpQueued && player.grounded) {
    player.vy = activeEffect === 'jump' ? -17 : -12.8;
    player.grounded = false;
    playSound('jump');
  }
  jumpQueued = false;

  const oldTop = player.y;
  const oldBottom = player.y + player.h;
  player.x = Math.max(0, Math.min(WORLD_WIDTH - player.w, player.x + player.vx * frame));
  player.y += player.vy * frame;
  player.vy = Math.min(15, player.vy + GRAVITY * frame);
  const fallingSpeed = player.vy;
  player.grounded = false;

  if (fallingSpeed < 0) {
    for (const block of questionBlocks) {
      if (oldTop >= block.y + block.h && player.y <= block.y + block.h &&
        player.x + player.w > block.x && player.x < block.x + block.w) {
        player.y = block.y + block.h;
        player.vy = 0;
        collectPowerup(block);
      }
    }
  }

  const surfaces = [...ground.map(g => ({ x: g.x, y: 470, w: g.w, h: 100 })), ...platforms.map(p => ({ ...p, h: 18 }))];
  for (const surface of surfaces) {
    if (player.vy >= 0 && oldBottom <= surface.y + 6 && player.y + player.h >= surface.y && player.x + player.w > surface.x && player.x < surface.x + surface.w) {
      player.y = surface.y - player.h;
      player.vy = 0;
      player.grounded = true;
    }
  }
  if (player.grounded && !wasGrounded) playSound('land');

  if (boss && !boss.defeated) {
    const bossHead = { x: boss.x + 8, y: boss.y, w: boss.w - 16, h: 24 };
    const playerBox = { x: player.x + 4, y: player.y, w: player.w - 8, h: player.h };
    const stompedBoss = fallingSpeed > 1 && oldBottom <= bossHead.y + 9 &&
      player.y + player.h >= bossHead.y && rectsOverlap(playerBox, bossHead);
    if (stompedBoss) {
      boss.hits++;
      playSound('stomp');
      player.y = boss.y - player.h;
      player.vy = -9.5;
      player.grounded = false;
      if (boss.hits >= 3) {
        boss.defeated = true;
        waterballs = [];
        playSound('win');
      }
    } else {
      const bossBody = { x: boss.x + 4, y: boss.y + 22, w: boss.w - 8, h: boss.h - 22 };
      if (rectsOverlap(playerBox, bossBody) && player.invulnerable <= 0 && activeEffect !== 'shield') {
        loseLife();
      }
    }

    if (!boss.defeated) {
      player.x = Math.min(player.x, boss.x - player.w + 14);
      boss.shotTimer -= dt / 1000;
      if (boss.shotTimer <= 0) {
        const dx = player.x + player.w / 2 - (boss.x + boss.w / 2);
        const dy = player.y + player.h / 2 - (boss.y + 36);
        const distance = Math.hypot(dx, dy) || 1;
        waterballs.push({
          x: boss.x + boss.w / 2,
          y: boss.y + 38,
          vx: dx / distance * 3.8,
          vy: dy / distance * 3.8,
          radius: 13,
        });
        playSound('splash');
        boss.shotTimer = 10;
      }
    }
  }

  for (const enemy of flyingEnemies) {
    if (!enemy.alive) continue;
    enemy.x += enemy.speed * enemy.direction * frame;
    if (enemy.x <= enemy.min || enemy.x >= enemy.max) {
      enemy.x = Math.max(enemy.min, Math.min(enemy.max, enemy.x));
      enemy.direction *= -1;
    }
    const enemyBox = { x: enemy.x - 4, y: enemy.y + 5, w: 34, h: 31 };
    const playerBox = { x: player.x + 5, y: player.y + 7, w: player.w - 10, h: player.h - 7 };
    if (!rectsOverlap(playerBox, enemyBox) || player.invulnerable > 0 || activeEffect === 'shield') continue;
    if (fallingSpeed > 1 && oldBottom <= enemyBox.y + 13) {
      enemy.alive = false;
      playSound('stomp');
      player.y = enemyBox.y - player.h;
      player.vy = -8;
      player.grounded = false;
    } else {
      loseLife();
    }
  }

  for (const enemy of enemies) {
    if (!enemy.alive) continue;
    enemy.x += enemy.speed * enemy.direction * frame;
    if (enemy.x < enemy.min || enemy.x > enemy.max) enemy.direction *= -1;
    const enemyBox = { x: enemy.x - 12, y: 432, w: 31, h: 36 };
    const playerBox = { x: player.x + 5, y: player.y + 8, w: player.w - 10, h: player.h - 8 };
    if (rectsOverlap(playerBox, enemyBox) && player.invulnerable <= 0 && activeEffect !== 'shield') {
      if (fallingSpeed > 2 && oldBottom < enemyBox.y + 14) {
        enemy.alive = false;
        playSound('stomp');
        player.vy = -8;
      } else {
        loseLife();
      }
    }
  }

  for (const item of fish) {
    const magnetRange = Math.max(activeEffect === 'magnet' ? 135 : 23, ownedAbilities.includes('fish-sense') ? 65 : 23);
    const verticalRange = Math.max(activeEffect === 'magnet' ? 115 : 30, ownedAbilities.includes('fish-sense') ? 55 : 30);
    if (!item.collected && Math.abs(player.x + player.w / 2 - item.x) < magnetRange && Math.abs(player.y + player.h / 2 - item.y) < verticalRange) {
      item.collected = true;
      collected++;
      levelCollected++;
      addFishToWallet();
      playSound('fish');
      fishCount.textContent = `${levelCollected} / ${fish.length}`;
      saveGame();
    }
  }

  for (let i = powerupDrops.length - 1; i >= 0; i--) {
    const drop = powerupDrops[i];
    const itemBox = { x: drop.x, y: drop.y, w: drop.w, h: drop.h };
    const playerBox = { x: player.x, y: player.y, w: player.w, h: player.h };
    if (rectsOverlap(playerBox, itemBox) && !heldPowerup) {
      heldPowerup = drop.powerup;
      playSound('powerup');
      powerupDrops.splice(i, 1);
    }
  }

  for (let i = woolballs.length - 1; i >= 0; i--) {
    const ball = woolballs[i];
    ball.x += ball.vx * frame;
    ball.y += ball.vy * frame;
    ball.vy += .16 * frame;
    let hitEnemy = false;
    for (const enemy of enemies) {
      if (enemy.alive && rectsOverlap(
        { x: ball.x - ball.radius, y: ball.y - ball.radius, w: ball.radius * 2, h: ball.radius * 2 },
        { x: enemy.x - 12, y: 432, w: 31, h: 36 },
      )) {
        enemy.alive = false;
        hitEnemy = true;
        playSound('stomp');
        break;
      }
    }
    if (!hitEnemy) {
      for (const enemy of flyingEnemies) {
        if (enemy.alive && rectsOverlap(
          { x: ball.x - ball.radius, y: ball.y - ball.radius, w: ball.radius * 2, h: ball.radius * 2 },
          { x: enemy.x - 4, y: enemy.y + 5, w: 34, h: 31 },
        )) {
          enemy.alive = false;
          hitEnemy = true;
          playSound('stomp');
          break;
        }
      }
    }
    if (hitEnemy || ball.x < cameraX - 40 || ball.x > cameraX + 1000 || ball.y > 560) woolballs.splice(i, 1);
  }

  for (let i = waterballs.length - 1; i >= 0; i--) {
    const ball = waterballs[i];
    ball.x += ball.vx * frame;
    ball.y += ball.vy * frame;
    const ballBox = { x: ball.x - ball.radius, y: ball.y - ball.radius, w: ball.radius * 2, h: ball.radius * 2 };
    const playerBox = { x: player.x + 5, y: player.y + 7, w: player.w - 10, h: player.h - 7 };
    if (rectsOverlap(ballBox, playerBox)) {
      waterballs.splice(i, 1);
      playSound('splash');
      if (player.invulnerable <= 0 && activeEffect !== 'shield') loseLife();
      continue;
    }
    if (ball.x < cameraX - 60 || ball.x > cameraX + 1020 || ball.y < -40 || ball.y > 580) waterballs.splice(i, 1);
  }

  if (player.invulnerable > 0) player.invulnerable -= frame;
  if (player.y > 590 && player.invulnerable <= 0) loseLife();
  updatePowerupDisplay();
  cameraX = Math.max(0, Math.min(WORLD_WIDTH - 960, player.x - 340));
  for (const box of cardboardBoxes) {
    const playerBox = { x: player.x + 5, y: player.y + 8, w: player.w - 10, h: player.h - 8 };
    const boxArea = { x: box.x, y: box.y, w: box.w, h: box.h };
    if (!box.used && player.grounded && rectsOverlap(playerBox, boxArea)) {
      enterBonusArea(box);
      return;
    }
  }
  if (player.x > 3090 && (!boss || boss.defeated)) finishLevel();
}

function loseLife() {
  playSound('hurt');
  lives--;
  lifeCount.textContent = String(lives);
  if (lives <= 0) {
    clearGameSave();
    showResult({ won: false });
  } else {
    resetPlayer();
    saveGame();
  }
}

function showResult({ won, campaignComplete = false }) {
  if (finished) return;
  finished = true;
  running = false;
  stopBackgroundMusic();
  hudReturnToMenuButton.classList.add('hidden');
  resultCard.classList.remove('hidden');
  const nextButton = document.querySelector('#next-level-button');
  const restartButton = document.querySelector('#restart-button');
  const returnToMenuButton = document.querySelector('#return-to-menu-button');
  scoreForm.classList.toggle('hidden', !campaignComplete);
  if (campaignComplete) document.querySelector('#player-name').value = activePlayer()?.name || '';
  nextButton.classList.toggle('hidden', !won || campaignComplete);
  restartButton.classList.toggle('hidden', won && !campaignComplete);
  returnToMenuButton.classList.toggle('hidden', won);
  document.querySelector('#result-emoji').textContent = won ? (campaignComplete ? '🏆' : '🎉') : '😿';
  document.querySelector('#result-eyebrow').textContent = campaignComplete ? 'ALLE LEVEL GESCHAFFT' : won ? 'LEVEL GESCHAFFT' : 'PAUSENPFOTE';
  document.querySelector('#result-title').textContent = campaignComplete ? 'Du bist Pfoten-Profi!' : won ? 'Miau-tastisch!' : 'Oh nein, Miez!';
  document.querySelector('#result-copy').textContent = campaignComplete
    ? `Alle ${levels.length} Level geschafft! Du hast ${collected} Fische gesammelt. Trag dich in die Bestenliste ein!`
    : won
      ? `${levels[activeLevel].name} geschafft! ${levelCollected} Fische gesammelt — bereit fürs nächste Abenteuer?`
      : 'Die Insel wartet auf einen neuen Versuch.';
}

function returnToMenu() {
  saveGame();
  stopBackgroundMusic();
  running = false;
  finished = false;
  levelCompletePending = false;
  bonusMode = false;
  bonusReturnState = null;
  bonusFish = [];
  keys.left = false;
  keys.right = false;
  keys.jump = false;
  jumpQueued = false;
  loadLevel(0);
  collected = 0;
  levelCollected = 0;
  lives = ownedAbilities.includes('extra-heart') ? 4 : 3;
  elapsedSeconds = 0;
  lifeCount.textContent = String(lives);
  fishCount.textContent = `0 / ${fish.length}`;
  resetPlayer();
  resultCard.classList.add('hidden');
  shopPanel.classList.add('hidden');
  hudReturnToMenuButton.classList.add('hidden');
  introCard.classList.remove('hidden');
  updateContinueButton();
}

function finishLevel() {
  playSound('win');
  levelCompletePending = true;
  saveGame();
  if (activeLevel === levels.length - 1) showResult({ won: true, campaignComplete: true });
  else showResult({ won: true });
}

function advanceLevel() {
  levelCompletePending = false;
  loadLevel(activeLevel + 1);
  levelCollected = 0;
  resetPlayer();
  finished = false;
  running = true;
  resultCard.classList.add('hidden');
  hudReturnToMenuButton.classList.remove('hidden');
  saveGame();
  startBackgroundMusic();
}

function readLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem('miezonauten-leaderboard') || '[]');
  } catch {
    return [];
  }
}

function renderLeaderboard() {
  const entries = readLeaderboard().slice(0, 10);
  leaderboardList.replaceChildren();
  if (!entries.length) {
    const empty = document.createElement('li');
    empty.className = 'leaderboard-empty';
    empty.textContent = 'Noch keine Pfoten-Champions — spiel alle sechs Level und werde die Nummer 1!';
    leaderboardList.append(empty);
    return;
  }
  entries.forEach((entry, index) => {
    const row = document.createElement('li');
    const rank = document.createElement('span');
    const name = document.createElement('span');
    const score = document.createElement('span');
    rank.className = 'leaderboard-rank';
    rank.textContent = `${index + 1}.`;
    name.textContent = entry.name;
    score.className = 'leaderboard-score';
    score.textContent = `${entry.score.toLocaleString('de-DE')} Pkt.`;
    row.append(rank, name, score);
    leaderboardList.append(row);
  });
}

function saveScore(name) {
  const score = collected * 100 + lives * 500 + Math.max(0, 6000 - Math.floor(elapsedSeconds) * 10);
  const entries = readLeaderboard();
  entries.push({ name: name.trim().slice(0, 16) || 'Miez', score });
  entries.sort((a, b) => b.score - a.score);
  try {
    localStorage.setItem('miezonauten-leaderboard', JSON.stringify(entries.slice(0, 10)));
  } catch {
    // Spiel bleibt auch nutzbar, wenn der Browser lokalen Speicher blockiert.
  }
  renderLeaderboard();
  clearGameSave();
  scoreForm.classList.add('hidden');
  document.querySelector('#result-copy').textContent = `Dein Ergebnis: ${score.toLocaleString('de-DE')} Punkte. Viel Glück in der Bestenliste!`;
  document.querySelector('#restart-button').classList.remove('hidden');
}

function draw(time) {
  if (bonusMode) {
    drawBonusArea(time);
    const colorOption = catColors.find(color => color.id === equippedCatColor);
    if (colorOption?.id === 'rainbow') drawFloatingRainbows(player.x + 3, player.y, time);
    if (colorOption?.id === 'galaxy') drawFloatingPlanets(player.x + 3, player.y, time);
    drawCat(player.x + 3, player.y, 1, getEquippedCatColor(), player.facing, false, colorOption?.legendary || colorOption?.pattern || colorOption?.rare ? colorOption.id : null);
    drawPetCompanion(player.x + 3, player.y, time);
    ctx.fillStyle = 'rgba(255,251,243,.94)';
    roundedRect(28, 112, 220, 49, 12); ctx.fill();
    ctx.textAlign = 'left';
    ctx.fillStyle = '#815638';
    ctx.font = 'bold 14px "DM Sans", sans-serif';
    ctx.fillText(`Zeit: ${bonusTime.toFixed(1)} Sekunden`, 42, 133);
    ctx.fillStyle = '#f2dfc8';
    roundedRect(42, 141, 190, 9, 5); ctx.fill();
    ctx.fillStyle = '#e99b54';
    roundedRect(42, 141, 190 * bonusTime / 10, 9, 5); ctx.fill();
    return;
  }
  drawBackground();
  ctx.save();
  ctx.translate(-cameraX, 0);
  for (const g of ground) drawIsland(g.x, 470, g.w, 100);
  for (const p of platforms) drawIsland(p.x, p.y, p.w, 20);
  for (const box of cardboardBoxes) drawCardboardBox(box, time);
  for (const block of questionBlocks) drawQuestionBlock(block, time);
  for (const item of fish) drawFish(item, time);
  for (const drop of powerupDrops) drawPowerupDrop(drop, time);
  drawBoss();
  drawProjectiles(time);
  for (const enemy of flyingEnemies) {
    if (enemy.alive) drawFlyingEnemy(enemy, time);
  }
  for (const enemy of enemies) {
    if (enemy.alive) drawCat(enemy.x, 423, .85, '#b988d1', enemy.direction, true);
  }
  drawGoal();
  if (activeEffect === 'flight') {
    ctx.fillStyle = 'rgba(255,255,255,.82)';
    ctx.beginPath();
    ctx.ellipse(player.x + 1, player.y + 21, 12, 6, -.35, 0, Math.PI * 2);
    ctx.ellipse(player.x + 37, player.y + 21, 12, 6, .35, 0, Math.PI * 2);
    ctx.fill();
  }
  if (activeEffect) {
    ctx.strokeStyle = activeEffect === 'shield' ? 'rgba(126,205,245,.85)' : 'rgba(255,232,153,.85)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(player.x + 19, player.y + 23, 31 + Math.sin(time / 100) * 2, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = player.invulnerable > 0 ? .62 : 1;
  const colorOption = catColors.find(color => color.id === equippedCatColor);
  if (colorOption?.id === 'rainbow') drawFloatingRainbows(player.x + 3, player.y, time);
  if (colorOption?.id === 'galaxy') drawFloatingPlanets(player.x + 3, player.y, time);
  drawCat(player.x + 3, player.y, 1, getEquippedCatColor(), player.facing, false, colorOption?.legendary || colorOption?.pattern || colorOption?.rare ? colorOption.id : null);
  drawPetCompanion(player.x + 3, player.y, time);
  ctx.globalAlpha = 1;
  ctx.restore();
  if (boss) {
    ctx.save();
    ctx.fillStyle = 'rgba(255,251,243,.9)';
    roundedRect(690, 14, 252, 43, 12); ctx.fill();
    ctx.fillStyle = '#6f4f82';
    ctx.font = 'bold 12px "DM Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(boss.defeated ? 'BOSS BESIEGT! Schloss frei!' : `BOSS · ${boss.hits}/3 Treffer`, 704, 32);
    if (!boss.defeated) {
      ctx.fillStyle = '#e9d8ec';
      roundedRect(704, 39, 220, 8, 4); ctx.fill();
      ctx.fillStyle = '#a775b1';
      roundedRect(704, 39, 220 * boss.hits / 3, 8, 4); ctx.fill();
      ctx.fillStyle = '#8e7692';
      ctx.font = '10px "DM Sans", sans-serif';
      ctx.fillText(`Wasserball in ${Math.ceil(boss.shotTimer)}s`, 828, 32);
    }
    ctx.restore();
  }
}

function frame(time) {
  const dt = previousTime ? time - previousTime : 16.67;
  previousTime = time;
  if (running && !finished) update(dt);
  if ((running || levelCompletePending) && time - lastSaveAt >= 1000) {
    saveGame();
    lastSaveAt = time;
  }
  draw(time);
  requestAnimationFrame(frame);
}

function startGame() {
  if (!activePlayer()) {
    openPlayerPanel();
    return;
  }
  clearGameSave();
  playSound('start');
  collected = 0;
  levelCollected = 0;
  lives = ownedAbilities.includes('extra-heart') ? 4 : 3;
  elapsedSeconds = 0;
  heldPowerup = null;
  activeEffect = null;
  effectTime = 0;
  bonusMode = false;
  levelCompletePending = false;
  loadLevel(0);
  lifeCount.textContent = String(lives);
  resetPlayer();
  finished = false;
  running = true;
  introCard.classList.add('hidden');
  resultCard.classList.add('hidden');
  hudReturnToMenuButton.classList.remove('hidden');
  lastSaveAt = 0;
  saveGame();
  startBackgroundMusic();
}

document.querySelector('#start-button').addEventListener('click', startGame);
continueButton.addEventListener('click', continueGame);
document.querySelector('#choose-player-button').addEventListener('click', openPlayerPanel);
document.querySelector('#close-player-panel-button').addEventListener('click', closePlayerPanel);
addPlayerButton.addEventListener('click', () => {
  playerForm.classList.remove('hidden');
  addPlayerButton.classList.add('hidden');
  playerNameInput.focus();
});
playerForm.addEventListener('submit', event => {
  event.preventDefault();
  addPlayer(playerNameInput.value);
});
document.querySelector('#restart-button').addEventListener('click', startGame);
document.querySelector('#return-to-menu-button').addEventListener('click', returnToMenu);
hudReturnToMenuButton.addEventListener('click', returnToMenu);
document.querySelector('#next-level-button').addEventListener('click', advanceLevel);
document.querySelector('#open-shop-button').addEventListener('click', openCatShop);
document.querySelector('#close-shop-button').addEventListener('click', closeCatShop);
soundToggle.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  try {
    localStorage.setItem('miezonauten-sound', soundEnabled ? 'on' : 'off');
  } catch {
    // Die Stummschaltung bleibt für diese Sitzung aktiv.
  }
  updateSoundButton();
  if (soundEnabled) {
    playSound('activate');
    startBackgroundMusic();
  } else {
    stopBackgroundMusic();
  }
});
scoreForm.addEventListener('submit', event => {
  event.preventDefault();
  saveScore(document.querySelector('#player-name').value);
});
window.addEventListener('keydown', event => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', ' '].includes(event.key)) event.preventDefault();
  if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') keys.left = true;
  if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') keys.right = true;
  if (event.key === 'ArrowUp' || event.key === ' ' || event.key.toLowerCase() === 'w') {
    keys.jump = true;
    if (!event.repeat) jumpQueued = true;
  }
  if (event.key.toLowerCase() === 'y' && !event.repeat) activatePowerup();
  if (event.key === 'Escape' && !playerPanel.classList.contains('hidden')) closePlayerPanel();
  if (event.key === 'Escape' && !shopPanel.classList.contains('hidden')) closeCatShop();
  if (event.key === 'Enter' && !running && !finished &&
    playerPanel.classList.contains('hidden') && shopPanel.classList.contains('hidden')) startGame();
});
window.addEventListener('keyup', event => {
  if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') keys.left = false;
  if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') keys.right = false;
  if (event.key === 'ArrowUp' || event.key === ' ' || event.key.toLowerCase() === 'w') keys.jump = false;
});
window.addEventListener('blur', () => { keys.left = false; keys.right = false; keys.jump = false; });
window.addEventListener('pagehide', saveGame);
window.addEventListener('beforeunload', saveGame);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') saveGame();
});

for (const button of document.querySelectorAll('[data-control]')) {
  const control = button.dataset.control;
  const down = event => {
    event.preventDefault();
    if (control === 'jump') {
      keys.jump = true;
      jumpQueued = true;
    }
    else keys[control] = true;
  };
  const up = () => { keys[control] = false; };
  button.addEventListener('pointerdown', down);
  button.addEventListener('pointerup', up);
  button.addEventListener('pointercancel', up);
  button.addEventListener('pointerleave', up);
}

document.querySelector('[data-powerup]').addEventListener('pointerdown', event => {
  event.preventDefault();
  activatePowerup();
});

if ('serviceWorker' in navigator && ['http:', 'https:'].includes(location.protocol)) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(error => {
      console.error('Offline-App konnte nicht eingerichtet werden:', error);
    });
  });
}

loadLevel(0);
loadPlayerStore();
loadCatShopData();
renderCatShop();
updateActivePlayerUI();
renderPlayerList();
updateSoundButton();
updatePowerupDisplay();
renderLeaderboard();
requestAnimationFrame(frame);
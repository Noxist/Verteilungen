// app.js: Modular Steuerung für die Lern-App mit dynamischem Level-Discovery.
// Lädt automatisch levelXX.js Module aus ./levels, ohne Build-Tooling.

const levelListEl = document.getElementById('levelList');
const levelTitleEl = document.getElementById('levelTitle');
const levelConceptEl = document.getElementById('levelConcept');
const moduleBadgeEl = document.getElementById('moduleBadge');
const interactionAreaEl = document.getElementById('interactionArea');
const formulaEl = document.getElementById('formula');
const progressBarEl = document.getElementById('progressBar');
const progressLabelEl = document.getElementById('progressLabel');
const prevLevelButton = document.getElementById('prevLevelButton');
const nextLevelButton = document.getElementById('nextLevelButton');
const chartHintEl = document.getElementById('chartHint');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebarSection = document.getElementById('sidebarSection');
const mobileOverlay = document.getElementById('mobileOverlay');

let chart;
let levels = [];
let activeLevelIndex = 0;
let unlockedLevels = parseInt(localStorage.getItem('dp-unlocked') || '1', 10);
let mobileMenuOpen = false;

const baseChartOptions = {
  responsive: true,
  plugins: { legend: { labels: { color: '#e2e8f0' } } },
  scales: {
    x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.06)' } },
    y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.06)' } }
  }
};

function saveProgress() {
  localStorage.setItem('dp-unlocked', unlockedLevels.toString());
}

function combination(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  k = Math.min(k, n - k);
  let c = 1;
  for (let i = 0; i < k; i++) {
    c = (c * (n - i)) / (i + 1);
  }
  return c;
}

function binomialPMF(n, p) {
  const labels = [];
  const data = [];
  for (let k = 0; k <= n; k++) {
    labels.push(k);
    const prob = combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    data.push(Number(prob.toFixed(4)));
  }
  return { labels, data };
}

function normalPDF(mu, sigma, x) {
  const factor = 1 / (sigma * Math.sqrt(2 * Math.PI));
  const exponent = -0.5 * Math.pow((x - mu) / sigma, 2);
  return factor * Math.exp(exponent);
}

function renderChart({ type = 'bar', labels = [], datasets = [], options = {} }) {
  const ctx = document.getElementById('chartCanvas').getContext('2d');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type,
    data: { labels, datasets },
    options: { ...baseChartOptions, ...options }
  });
  return chart;
}

function updateProgress() {
  if (!levels.length) {
    progressBarEl.style.width = '0%';
    progressLabelEl.textContent = 'Keine Levels';
    return;
  }
  const progress = Math.round((unlockedLevels / levels.length) * 100);
  progressBarEl.style.width = `${progress}%`;
  progressLabelEl.textContent = `${unlockedLevels} / ${levels.length} Levels`;
}

function setFormula(html) {
  formulaEl.innerHTML = html || '';
  if (window.MathJax?.typesetPromise) {
    MathJax.typesetPromise([formulaEl]);
  }
}

function renderLevelList() {
  levelListEl.innerHTML = '';
  let currentModule = '';
  levels.forEach((level, idx) => {
    if (level.module !== currentModule) {
      currentModule = level.module;
      const heading = document.createElement('p');
      heading.className = 'text-xs uppercase tracking-[0.2em] text-slate-400 mt-2';
      heading.textContent = currentModule;
      levelListEl.appendChild(heading);
    }

    const card = document.createElement('div');
    card.className = `level-card rounded-2xl border border-slate-800 p-3 flex items-center gap-3 bg-slate-800/40 ${
      idx + 1 > unlockedLevels ? 'locked' : 'cursor-pointer'
    }`;
    card.innerHTML = `
      <div class="w-10 h-10 rounded-xl bg-slate-700 grid place-items-center text-sm font-bold">${level.id}</div>
      <div class="flex-1">
        <p class="text-sm font-semibold">${level.title}</p>
        <p class="text-xs text-slate-400">${level.interaction || 'Interaktion'}</p>
      </div>
    `;
    card.addEventListener('click', () => {
      if (idx + 1 <= unlockedLevels) {
        activeLevelIndex = idx;
        renderLevel();
        if (mobileMenuOpen) {
          closeMobileMenu();
        }
      }
    });
    levelListEl.appendChild(card);
  });
}

function renderLevel() {
  const level = levels[activeLevelIndex];
  if (!level) return;
  interactionAreaEl.innerHTML = '';

  levelTitleEl.textContent = `Level ${level.id}: ${level.title}`;
  levelConceptEl.textContent = level.concept || '';
  moduleBadgeEl.textContent = level.module || 'Modul';
  prevLevelButton.disabled = activeLevelIndex === 0;
  nextLevelButton.disabled = activeLevelIndex >= levels.length - 1;
  nextLevelButton.textContent = activeLevelIndex >= levels.length - 1 ? 'Alle Levels gemeistert' : 'Nächstes Level';
  chartHintEl.textContent = level.interaction || '';
  setFormula(level.formula);

  const helpers = {
    renderChart,
    binomialPMF,
    normalPDF,
    combination,
    clearChart: () => chart?.destroy?.()
  };

  try {
    level.setup(interactionAreaEl, helpers);
  } catch (err) {
    interactionAreaEl.innerHTML = `<p class="text-sm text-amber-300">Fehler beim Laden dieses Levels: ${err.message}</p>`;
    console.error('Level setup failed', err);
  }

  updateProgress();
}

function goToPreviousLevel() {
  if (activeLevelIndex <= 0) return;
  activeLevelIndex -= 1;
  renderLevel();
}

function goToNextLevel() {
  if (!levels.length || activeLevelIndex >= levels.length - 1) return;
  const nextIndex = activeLevelIndex + 1;
  if (nextIndex + 1 > unlockedLevels) {
    unlockedLevels = Math.min(levels.length, nextIndex + 1);
    saveProgress();
  }
  activeLevelIndex = nextIndex;
  renderLevelList();
  renderLevel();
}

prevLevelButton.addEventListener('click', goToPreviousLevel);
nextLevelButton.addEventListener('click', goToNextLevel);

function openMobileMenu() {
  mobileMenuOpen = true;
  sidebarSection.classList.remove('hidden', '-translate-x-full');
  mobileOverlay.classList.remove('hidden');
}

function closeMobileMenu() {
  mobileMenuOpen = false;
  if (window.innerWidth < 768) {
    sidebarSection.classList.add('-translate-x-full');
    mobileOverlay.classList.add('hidden');
    sidebarSection.classList.add('hidden');
  }
}

mobileMenuToggle?.addEventListener('click', () => {
  if (mobileMenuOpen) {
    closeMobileMenu();
  } else {
    sidebarSection.classList.remove('hidden');
    // trigger animation frame to allow transition
    requestAnimationFrame(() => {
      openMobileMenu();
    });
  }
});

mobileOverlay?.addEventListener('click', closeMobileMenu);

window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    sidebarSection.classList.remove('hidden', '-translate-x-full');
    mobileOverlay.classList.add('hidden');
    mobileMenuOpen = false;
  } else if (!mobileMenuOpen) {
    sidebarSection.classList.add('hidden');
  }
});

async function discoverLevels() {
  const found = [];
  let index = 1;
  while (true) {
    const suffix = String(index).padStart(2, '0');
    try {
      const module = await import(`./levels/level${suffix}.js`);
      if (module?.default) {
        found.push(module.default);
        index += 1;
        continue;
      }
    } catch (err) {
      console.info(`Discovery stopped at level${suffix}.js`, err?.message || err);
      break;
    }
    index += 1;
  }
  return found;
}

async function bootstrap() {
  levels = await discoverLevels();
  if (!levels.length) {
    levelListEl.innerHTML =
      '<p class="text-sm text-amber-300 bg-slate-800/60 border border-slate-700 rounded-xl p-3">Keine Level-Dateien gefunden. Bitte lege level01.js in ./levels/ ab.</p>';
    updateProgress();
    return;
  }
  unlockedLevels = Math.max(1, Math.min(unlockedLevels, levels.length));
  renderLevelList();
  renderLevel();
}

bootstrap();

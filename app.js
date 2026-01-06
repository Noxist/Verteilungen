// app.js: Steuerung der Lern-App. Nutzt Inhalte aus content.js.

const levelListEl = document.getElementById('levelList');
const levelTitleEl = document.getElementById('levelTitle');
const levelConceptEl = document.getElementById('levelConcept');
const moduleBadgeEl = document.getElementById('moduleBadge');
const interactionAreaEl = document.getElementById('interactionArea');
const formulaEl = document.getElementById('formula');
const progressBarEl = document.getElementById('progressBar');
const progressLabelEl = document.getElementById('progressLabel');
const unlockButton = document.getElementById('unlockButton');
const chartHintEl = document.getElementById('chartHint');

let activeLevelIndex = 0;
let unlockedLevels = parseInt(localStorage.getItem('dp-unlocked') || '1', 10);
let chart;

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

function updateChart(labels, datasets) {
  const ctx = document.getElementById('chartCanvas').getContext('2d');
  // Destroy previous instance to avoid glitches when switching chart types
  if (chart) {
    chart.destroy();
  }
  chart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#e2e8f0' } } },
      scales: {
        x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.06)' } },
        y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.06)' } }
      }
    }
  });
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
        <p class="text-xs text-slate-400">${level.interaction}</p>
      </div>
    `;
    card.addEventListener('click', () => {
      if (idx + 1 <= unlockedLevels) {
        activeLevelIndex = idx;
        renderLevel();
      }
    });
    levelListEl.appendChild(card);
  });
}

function updateProgress() {
  const progress = Math.round((unlockedLevels / levels.length) * 100);
  progressBarEl.style.width = `${progress}%`;
  progressLabelEl.textContent = `${unlockedLevels} / ${levels.length} Levels`;
}

function setFormula(html) {
  formulaEl.innerHTML = html;
  if (window.MathJax && window.MathJax.typesetPromise) {
    MathJax.typesetPromise([formulaEl]);
  }
}

function renderLLN() {
  interactionAreaEl.innerHTML = `
    <p class="text-sm text-slate-200">Simuliere Würfe und beobachte die relative Häufigkeit.</p>
    <div class="flex flex-wrap items-center gap-3">
      <button id="throwBtn" class="px-4 py-2 rounded-xl bg-indigo-500 text-white font-semibold shadow">50 Würfe</button>
      <p id="llnInfo" class="text-sm text-slate-300">Starte die Simulation.</p>
    </div>
  `;
  const throwBtn = document.getElementById('throwBtn');
  const info = document.getElementById('llnInfo');
  let counts = [0, 0, 0, 0, 0, 0];

  const update = () => {
    const total = counts.reduce((a, b) => a + b, 0) || 1;
    const freqs = counts.map((c) => Number((c / total).toFixed(3)));
    info.textContent = `n = ${total} · Relative Häufigkeit ~ ${freqs.join(' | ')}`;
    updateChart(['1', '2', '3', '4', '5', '6'], [
      {
        label: 'Relative Häufigkeit',
        data: freqs,
        backgroundColor: '#22c55e99',
        borderRadius: 8
      }
    ]);
  };

  throwBtn.addEventListener('click', () => {
    for (let i = 0; i < 50; i++) {
      const roll = Math.floor(Math.random() * 6);
      counts[roll] += 1;
    }
    update();
  });
  update();
}

function renderTree() {
  interactionAreaEl.innerHTML = `
    <p class="text-sm text-slate-200">Passe Pfadwahrscheinlichkeiten an und sieh das Produkt.</p>
    <div class="grid gap-3">
      <label class="text-xs text-slate-300">P(A)
        <input id="pa" type="range" min="0" max="1" step="0.05" value="0.5" class="w-full" />
      </label>
      <label class="text-xs text-slate-300">P(B | A)
        <input id="pba" type="range" min="0" max="1" step="0.05" value="0.5" class="w-full" />
      </label>
      <p id="pathInfo" class="text-sm text-emerald-200 font-semibold"></p>
    </div>
  `;
  const pa = document.getElementById('pa');
  const pba = document.getElementById('pba');
  const pathInfo = document.getElementById('pathInfo');
  const update = () => {
    const paV = Number(pa.value);
    const pbaV = Number(pba.value);
    const path = Number((paV * pbaV).toFixed(3));
    pathInfo.textContent = `P(A ∩ B) = ${path}`;
    updateChart(['P(A)', 'P(B|A)', 'Pfad'], [
      { label: 'Wert', data: [paV, pbaV, path], backgroundColor: ['#38bdf899', '#c084fc99', '#22c55eaa'], borderRadius: 8 }
    ]);
  };
  pa.addEventListener('input', update);
  pba.addEventListener('input', update);
  update();
}

function renderMapping() {
  interactionAreaEl.innerHTML = `
    <p class="text-sm text-slate-200">Ordne Ereignisse Zahlen zu. Ziehe die Karten in den Slot.</p>
    <div class="flex flex-wrap gap-2" id="dragPool"></div>
    <div class="drop-zone" id="dropZone">Ziehe hierhin</div>
  `;
  const pool = document.getElementById('dragPool');
  const dropZone = document.getElementById('dropZone');
  const items = [
    { label: 'Sechser würfeln → 6', value: 6 },
    { label: 'Ungerade → 1', value: 1 },
    { label: 'Augensumme 4 → 4', value: 4 }
  ];
  items.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'drag-item text-sm';
    el.textContent = item.label;
    el.draggable = true;
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', item.value.toString());
    });
    pool.appendChild(el);
  });
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('active');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('active'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const value = e.dataTransfer.getData('text/plain');
    dropZone.textContent = `X = ${value}`;
    dropZone.classList.remove('active');
    updateChart(['Slot'], [{ label: 'zugeordneter Wert', data: [Number(value)], backgroundColor: '#a855f799', borderRadius: 10 }]);
  });
  updateChart(['Slot'], [{ label: 'zugeordneter Wert', data: [0], backgroundColor: '#a855f799', borderRadius: 10 }]);
}

function renderDiscrete() {
  interactionAreaEl.innerHTML = `
    <p class="text-sm text-slate-200">Trage Wahrscheinlichkeiten ein (z.B. 0.1, 0.3, 0.6). Es wird automatisch normiert.</p>
    <input id="probInput" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2" value="0.2,0.3,0.5" />
    <p id="sumInfo" class="text-xs text-slate-400"></p>
  `;
  const input = document.getElementById('probInput');
  const sumInfo = document.getElementById('sumInfo');
  const update = () => {
    const raw = input.value.split(',').map((x) => Number(x.trim())).filter((x) => !Number.isNaN(x));
    const total = raw.reduce((a, b) => a + b, 0) || 1;
    const normalized = raw.map((x) => x / total);
    sumInfo.textContent = `Summe (normiert) = 1 | Originalsumme = ${total.toFixed(2)}`;
    updateChart(normalized.map((_, i) => `x${i}`), [
      { label: 'P(X=x_i)', data: normalized, backgroundColor: '#22d3ee99', borderRadius: 8 }
    ]);
  };
  input.addEventListener('input', update);
  update();
}

function renderMean() {
  interactionAreaEl.innerHTML = `
    <p class="text-sm text-slate-200">Verschiebe Gewichte auf der rechten Seite. Die Schwerpunkt-Linie springt mit.</p>
    <input id="weightSlider" type="range" min="0" max="1" step="0.05" value="0.5" class="w-full" />
    <p id="meanInfo" class="text-sm text-emerald-200"></p>
  `;
  const slider = document.getElementById('weightSlider');
  const info = document.getElementById('meanInfo');
  const values = [-2, -1, 0, 1, 2];
  const update = () => {
    const bias = Number(slider.value);
    const probs = values.map((v) => (v >= 0 ? bias / 3 : (1 - bias) / 2));
    const norm = probs.reduce((a, b) => a + b, 0);
    const p = probs.map((x) => x / norm);
    const mean = values.reduce((acc, v, i) => acc + v * p[i], 0);
    info.textContent = `E(X) ≈ ${mean.toFixed(2)}`;
    updateChart(values, [{ label: 'Punkte', data: p, backgroundColor: '#fbbf2499', borderRadius: 8 }]);
  };
  slider.addEventListener('input', update);
  update();
}

function renderVariance() {
  interactionAreaEl.innerHTML = `
    <p class="text-sm text-slate-200">Je größer die Streuung, desto breiter die Verteilung.</p>
    <input id="spreadSlider" type="range" min="0.2" max="2.5" step="0.1" value="1" class="w-full" />
    <p id="varInfo" class="text-sm text-emerald-200"></p>
  `;
  const slider = document.getElementById('spreadSlider');
  const info = document.getElementById('varInfo');
  const update = () => {
    const sigma = Number(slider.value);
    const xs = [];
    const ys = [];
    for (let x = -4; x <= 4; x += 0.5) {
      xs.push(x.toFixed(1));
      ys.push(normalPDF(0, sigma, x));
    }
    const mean = 0;
    const variance = sigma * sigma;
    info.textContent = `σ ≈ ${sigma.toFixed(2)}, Var(X) ≈ ${variance.toFixed(2)}`;
    updateChart(xs, [{ label: 'Dichte', data: ys, backgroundColor: '#22c55e99', borderRadius: 6 }]);
  };
  slider.addEventListener('input', update);
  update();
}

function renderGalton() {
  interactionAreaEl.innerHTML = `
    <p class="text-sm text-slate-200">Starte eine schnelle Galton-Simulation mit n=8 Reihen.</p>
    <button id="galtonBtn" class="px-4 py-2 rounded-xl bg-emerald-500 text-slate-900 font-semibold shadow">200 Kugeln fallen lassen</button>
    <p id="galtonInfo" class="text-xs text-slate-300"></p>
  `;
  const btn = document.getElementById('galtonBtn');
  const info = document.getElementById('galtonInfo');
  const n = 8;
  const simulate = () => {
    const counts = Array(n + 1).fill(0);
    for (let i = 0; i < 200; i++) {
      let k = 0;
      for (let j = 0; j < n; j++) {
        if (Math.random() < 0.5) k++;
      }
      counts[k] += 1;
    }
    const total = counts.reduce((a, b) => a + b, 0);
    const probs = counts.map((c) => c / total);
    info.textContent = `Maximale Klasse: ${counts.indexOf(Math.max(...counts))}`;
    updateChart(
      counts.map((_, i) => i),
      [{ label: 'Häufigkeit', data: probs, backgroundColor: '#38bdf899', borderRadius: 8 }]
    );
  };
  btn.addEventListener('click', simulate);
  simulate();
}

function renderFormulaBuilder() {
  interactionAreaEl.innerHTML = `
    <p class="text-sm text-slate-200">Ziehe die Bausteine in die Slots.</p>
    <div class="flex flex-wrap gap-2 mb-2" id="formulaPool"></div>
    <div class="flex flex-wrap gap-2" id="formulaSlots"></div>
    <p id="formulaFeedback" class="text-sm text-emerald-200"></p>
  `;
  const pool = document.getElementById('formulaPool');
  const slots = document.getElementById('formulaSlots');
  const feedback = document.getElementById('formulaFeedback');
  const pieces = ['C', 'P', 'Q'];
  const labels = {
    C: '⟮n über k⟯',
    P: 'p^k',
    Q: '(1-p)^{n-k}'
  };
  pieces.forEach((p) => {
    const el = document.createElement('div');
    el.className = 'drag-item text-sm';
    el.textContent = labels[p];
    el.draggable = true;
    el.dataset.key = p;
    el.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', p));
    pool.appendChild(el);
  });
  ['Slot 1', 'Slot 2', 'Slot 3'].forEach((name) => {
    const zone = document.createElement('div');
    zone.className = 'drop-zone flex-1 min-w-[120px]';
    zone.textContent = name;
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('active');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('active'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      const key = e.dataTransfer.getData('text/plain');
      zone.textContent = labels[key];
      zone.dataset.key = key;
      zone.classList.remove('active');
      check();
    });
    slots.appendChild(zone);
  });
  function check() {
    const keys = Array.from(slots.children).map((c) => c.dataset.key).join('');
    const correct = keys === 'CPQ';
    feedback.textContent = correct ? 'Vollständig! Das ist genau die Bernoulli-Formel.' : 'Reihenfolge ausprobieren...';
    feedback.className = correct ? 'text-sm text-emerald-300' : 'text-sm text-amber-300';
    updateChart(['Slot 1', 'Slot 2', 'Slot 3'], [
      {
        label: 'Platzierung',
        data: Array.from(slots.children).map((c) => (c.dataset.key ? 1 : 0)),
        backgroundColor: correct ? '#22c55e99' : '#f9731699',
        borderRadius: 8
      }
    ]);
  }
  updateChart(['Slot 1', 'Slot 2', 'Slot 3'], [{ label: 'Platzierung', data: [0, 0, 0], backgroundColor: '#f9731699', borderRadius: 8 }]);
}

function renderBinomial() {
  interactionAreaEl.innerHTML = `
    <p class="text-sm text-slate-200">Passe n und p an.</p>
    <div class="grid md:grid-cols-2 gap-3">
      <label class="text-xs text-slate-300">n
        <input id="nSlider" type="range" min="1" max="20" step="1" value="10" class="w-full" />
      </label>
      <label class="text-xs text-slate-300">p
        <input id="pSlider" type="range" min="0.05" max="0.95" step="0.05" value="0.5" class="w-full" />
      </label>
    </div>
    <p id="binomInfo" class="text-sm text-emerald-200"></p>
  `;
  const nSlider = document.getElementById('nSlider');
  const pSlider = document.getElementById('pSlider');
  const info = document.getElementById('binomInfo');
  const update = () => {
    const n = Number(nSlider.value);
    const p = Number(pSlider.value);
    const { labels, data } = binomialPMF(n, p);
    info.textContent = `n = ${n}, p = ${p.toFixed(2)}`;
    updateChart(labels, [{ label: 'P(X=k)', data, backgroundColor: '#22d3ee99', borderRadius: 8 }]);
  };
  nSlider.addEventListener('input', update);
  pSlider.addEventListener('input', update);
  update();
}

function renderCDF() {
  interactionAreaEl.innerHTML = `
    <p class="text-sm text-slate-200">Markiere alle k bis zu deinem Schwellenwert.</p>
    <div class="flex items-center gap-3">
      <label class="text-xs text-slate-300">k
        <input id="kSlider" type="range" min="0" max="10" step="1" value="5" class="w-full" />
      </label>
      <span id="cdfValue" class="text-sm font-semibold text-emerald-200"></span>
    </div>
  `;
  const kSlider = document.getElementById('kSlider');
  const cdfValue = document.getElementById('cdfValue');
  const n = 10;
  const p = 0.4;
  const base = binomialPMF(n, p);
  const update = () => {
    const k = Number(kSlider.value);
    let sum = 0;
    const colors = base.data.map((v, idx) => {
      if (idx <= k) {
        sum += v;
        return '#22c55eaa';
      }
      return '#334155cc';
    });
    cdfValue.textContent = `F(${k}) ≈ ${sum.toFixed(3)}`;
    updateChart(base.labels, [{ label: 'P(X=k)', data: base.data, backgroundColor: colors, borderRadius: 8 }]);
  };
  kSlider.addEventListener('input', update);
  update();
}

function renderSigma() {
  interactionAreaEl.innerHTML = `
    <p class="text-sm text-slate-200">Schalte Intervalle ein/aus.</p>
    <div class="flex gap-3 flex-wrap">
      <label class="flex items-center gap-2 text-sm"><input id="s1" type="checkbox" checked /> 1σ</label>
      <label class="flex items-center gap-2 text-sm"><input id="s2" type="checkbox" /> 2σ</label>
      <label class="flex items-center gap-2 text-sm"><input id="s3" type="checkbox" /> 3σ</label>
    </div>
    <p id="sigmaInfo" class="text-sm text-emerald-200"></p>
  `;
  const s1 = document.getElementById('s1');
  const s2 = document.getElementById('s2');
  const s3 = document.getElementById('s3');
  const info = document.getElementById('sigmaInfo');
  const xs = [];
  const ys = [];
  for (let x = -4; x <= 4; x += 0.2) {
    xs.push(x.toFixed(1));
    ys.push(normalPDF(0, 1, x));
  }
  function update() {
    const active = [s1.checked, s2.checked, s3.checked];
    const share = [0.68, 0.954, 0.997];
    const text = active
      .map((on, idx) => (on ? `${idx + 1}σ → ${Math.round(share[idx] * 1000) / 10}%` : null))
      .filter(Boolean)
      .join(' | ');
    info.textContent = text || 'Kein Intervall aktiv';
    const bg = ys.map((y, idx) => {
      const xVal = Number(xs[idx]);
      if (s3.checked && Math.abs(xVal) <= 3) return '#22c55e55';
      if (s2.checked && Math.abs(xVal) <= 2) return '#a855f766';
      if (s1.checked && Math.abs(xVal) <= 1) return '#38bdf877';
      return '#0f172acc';
    });
    updateChart(xs, [{ label: 'Normaldichte', data: ys, backgroundColor: bg, borderRadius: 6 }]);
  }
  [s1, s2, s3].forEach((c) => c.addEventListener('input', update));
  update();
}

function renderAtLeast() {
  interactionAreaEl.innerHTML = `
    <p class="text-sm text-slate-200">Finde kleinstes n mit P(X ≥ 1) ≥ Ziel.</p>
    <div class="grid md:grid-cols-2 gap-3">
      <label class="text-xs text-slate-300">Erfolgswahrscheinlichkeit p
        <input id="pSingle" type="range" min="0.05" max="0.9" step="0.05" value="0.2" class="w-full" />
      </label>
      <label class="text-xs text-slate-300">Zielwahrscheinlichkeit
        <input id="pTarget" type="range" min="0.5" max="0.99" step="0.01" value="0.9" class="w-full" />
      </label>
    </div>
    <p id="atleastInfo" class="text-sm text-emerald-200"></p>
  `;
  const pSingle = document.getElementById('pSingle');
  const pTarget = document.getElementById('pTarget');
  const info = document.getElementById('atleastInfo');
  const update = () => {
    const p = Number(pSingle.value);
    const target = Number(pTarget.value);
    let n = 1;
    while (1 - Math.pow(1 - p, n) < target && n < 200) {
      n += 1;
    }
    info.textContent = `p = ${p.toFixed(2)}, Ziel = ${target.toFixed(2)} → minimal n = ${n}`;
    const labels = Array.from({ length: 10 }, (_, i) => i + 1);
    const probs = labels.map((k) => 1 - Math.pow(1 - p, k));
    updateChart(labels, [{ label: 'P(X ≥ 1)', data: probs, backgroundColor: labels.map((k) => (k >= n ? '#22c55eaa' : '#38bdf877')), borderRadius: 8 }]);
  };
  pSingle.addEventListener('input', update);
  pTarget.addEventListener('input', update);
  update();
}

function renderApprox() {
  interactionAreaEl.innerHTML = `
    <p class="text-sm text-slate-200">Erhöhe n und beobachte die Glättung.</p>
    <label class="text-xs text-slate-300">n
      <input id="approxSlider" type="range" min="5" max="40" step="1" value="10" class="w-full" />
    </label>
  `;
  const slider = document.getElementById('approxSlider');
  const update = () => {
    const n = Number(slider.value);
    const p = 0.5;
    const { labels, data } = binomialPMF(n, p);
    const mu = n * p;
    const sigma = Math.sqrt(n * p * (1 - p));
    const curveX = [];
    const curveY = [];
    for (let x = 0; x <= n; x += 0.5) {
      curveX.push(x.toFixed(1));
      curveY.push(normalPDF(mu, sigma, x));
    }
    updateChart(labels, [
      { label: 'Binomial', data, backgroundColor: '#f9731699', borderRadius: 6 },
      { label: 'Normalapprox.', data: curveY, type: 'line', borderColor: '#22d3ee', borderWidth: 2, fill: false }
    ]);
  };
  slider.addEventListener('input', update);
  update();
}

function renderNormal() {
  interactionAreaEl.innerHTML = `
    <p class="text-sm text-slate-200">Passe µ und σ an und sieh die Glocke.</p>
    <div class="grid md:grid-cols-2 gap-3">
      <label class="text-xs text-slate-300">µ
        <input id="mu" type="range" min="-2" max="2" step="0.2" value="0" class="w-full" />
      </label>
      <label class="text-xs text-slate-300">σ
        <input id="sigma" type="range" min="0.5" max="2.5" step="0.1" value="1" class="w-full" />
      </label>
    </div>
    <p id="normalInfo" class="text-sm text-emerald-200"></p>
  `;
  const mu = document.getElementById('mu');
  const sigma = document.getElementById('sigma');
  const info = document.getElementById('normalInfo');
  const update = () => {
    const m = Number(mu.value);
    const s = Number(sigma.value);
    const xs = [];
    const ys = [];
    for (let x = m - 4 * s; x <= m + 4 * s; x += s / 6) {
      xs.push(Number(x.toFixed(2)));
      ys.push(normalPDF(m, s, x));
    }
    info.textContent = `µ = ${m.toFixed(2)}, σ = ${s.toFixed(2)}`;
    updateChart(xs, [{ label: 'Normaldichte', data: ys, borderColor: '#22c55e', backgroundColor: '#22c55e66', type: 'line', fill: true, tension: 0.2 }]);
  };
  mu.addEventListener('input', update);
  sigma.addEventListener('input', update);
  update();
}

function renderQuiz() {
  interactionAreaEl.innerHTML = `
    <p class="text-sm text-slate-200">Ziehe zufällige Aufgaben und prüfe dich selbst.</p>
    <button id="quizBtn" class="px-4 py-2 rounded-xl bg-indigo-500 text-white font-semibold shadow">Neue Frage</button>
    <p id="quizQuestion" class="text-sm text-slate-200"></p>
    <div id="quizOptions" class="flex flex-col gap-2"></div>
    <p id="quizFeedback" class="text-sm"></p>
  `;
  const quizBtn = document.getElementById('quizBtn');
  const quizQuestion = document.getElementById('quizQuestion');
  const quizOptions = document.getElementById('quizOptions');
  const quizFeedback = document.getElementById('quizFeedback');

  const pool = [
    {
      q: 'Welche Formel nutzt du für P(X=k) in B(n,p)?',
      options: ['Bernoulli-Formel', 'Sigma-Regel', 'Pfadregel'],
      correct: 0
    },
    {
      q: 'Was ist bei großem n mit B(n, p)?',
      options: ['Annäherung an Normalverteilung', 'Wird gleichförmig', 'Bleibt stets gleich schief'],
      correct: 0
    },
    {
      q: 'Wie erhält man F(k)?',
      options: ['Summe bis k', 'Produkt bis k', 'Differenz aus n und k'],
      correct: 0
    }
  ];

  function ask() {
    const item = pool[Math.floor(Math.random() * pool.length)];
    quizQuestion.textContent = item.q;
    quizOptions.innerHTML = '';
    item.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:border-emerald-400 text-left';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        const correct = idx === item.correct;
        quizFeedback.textContent = correct ? 'Richtig! Weiter so.' : 'Fast! Prüfe die Regel erneut.';
        quizFeedback.className = correct ? 'text-sm text-emerald-300' : 'text-sm text-amber-300';
        updateChart(['Richtig', 'Falsch'], [{ label: 'Score', data: [correct ? 1 : 0, correct ? 0 : 1], backgroundColor: ['#22c55e99', '#f9731699'], borderRadius: 8 }]);
      });
      quizOptions.appendChild(btn);
    });
  }
  quizBtn.addEventListener('click', ask);
  ask();
}

function renderLevel() {
  const level = levels[activeLevelIndex];
  levelTitleEl.textContent = `Level ${level.id}: ${level.title}`;
  levelConceptEl.textContent = level.concept;
  moduleBadgeEl.textContent = level.module;
  unlockButton.disabled = level.id > unlockedLevels;
  unlockButton.textContent = level.id === levels.length ? 'Alle Levels gemeistert' : 'Nächstes Level';
  chartHintEl.textContent = level.interaction;
  setFormula(level.formula);

  switch (level.type) {
    case 'lln':
      renderLLN();
      break;
    case 'tree':
      renderTree();
      break;
    case 'mapping':
      renderMapping();
      break;
    case 'discrete':
      renderDiscrete();
      break;
    case 'mean':
      renderMean();
      break;
    case 'variance':
      renderVariance();
      break;
    case 'galton':
      renderGalton();
      break;
    case 'formula':
      renderFormulaBuilder();
      break;
    case 'binomial':
      renderBinomial();
      break;
    case 'cdf':
      renderCDF();
      break;
    case 'sigma':
      renderSigma();
      break;
    case 'atleast':
      renderAtLeast();
      break;
    case 'approx':
      renderApprox();
      break;
    case 'normal':
      renderNormal();
      break;
    case 'quiz':
      renderQuiz();
      break;
    default:
      interactionAreaEl.textContent = 'Interaktion folgt...';
  }
  updateProgress();
}

unlockButton.addEventListener('click', () => {
  if (unlockedLevels < levels.length) {
    unlockedLevels = Math.min(levels.length, unlockedLevels + 1);
    saveProgress();
    renderLevelList();
    renderLevel();
  }
});

renderLevelList();
renderLevel();

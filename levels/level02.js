export default {
  id: 2,
  title: 'Zufallsvariablen & Verteilung bauen',
  module: 'Zufallsvariablen',
  type: 'chart-bar',
  concept: 'Ordne Ergebnissen Zahlen zu und normiere Wahrscheinlichkeiten automatisch.',
  interaction: 'Ziehe Ereignisse in den Slot oder trage Wahrscheinlichkeiten ein.',
  formula: String.raw`$$X: \Omega \to \mathbb{R},\quad \sum p_i = 1$$`,
  setup: (container, helpers) => {
    container.innerHTML = `
      <div class="space-y-4">
        <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
          <p class="text-sm text-slate-200 mb-2">Ordne Ereignissen Zahlen zu. Ziehe die Karten in den Slot.</p>
          <div class="flex flex-wrap gap-2" id="dragPool"></div>
          <div class="drop-zone mt-3" id="dropZone">Ziehe hierhin</div>
        </div>
        <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 space-y-3">
          <p class="text-sm text-slate-200">Trage Wahrscheinlichkeiten ein (z.B. 0.1, 0.3, 0.6). Es wird automatisch normiert.</p>
          <input id="probInput" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2" value="0.2,0.3,0.5" />
          <p id="sumInfo" class="text-xs text-slate-400"></p>
        </div>
      </div>
    `;

    const pool = container.querySelector('#dragPool');
    const dropZone = container.querySelector('#dropZone');
    const probInput = container.querySelector('#probInput');
    const sumInfo = container.querySelector('#sumInfo');

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
      el.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', item.value.toString()));
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
      helpers.renderChart({
        type: 'bar',
        labels: ['Slot'],
        datasets: [
          {
            label: 'zugeordneter Wert',
            data: [Number(value)],
            backgroundColor: '#a855f799',
            borderRadius: 10
          }
        ]
      });
    });

    const updateProbs = () => {
      const raw = probInput.value
        .split(',')
        .map((x) => Number(x.trim()))
        .filter((x) => !Number.isNaN(x));
      const total = raw.reduce((a, b) => a + b, 0) || 1;
      const normalized = raw.map((x) => x / total);
      sumInfo.textContent = `Summe (normiert) = 1 | Originalsumme = ${total.toFixed(2)}`;
      helpers.renderChart({
        type: 'bar',
        labels: normalized.map((_, i) => `x${i}`),
        datasets: [
          {
            label: 'P(X=x_i)',
            data: normalized,
            backgroundColor: '#22d3ee99',
            borderRadius: 8
          }
        ]
      });
    };

    probInput.addEventListener('input', updateProbs);
    updateProbs();
  }
};

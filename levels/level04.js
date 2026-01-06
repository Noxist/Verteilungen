export default {
  id: 4,
  title: 'Die Verteilungsfunktion',
  module: 'Zufallsvariablen',
  concept: 'Wahrscheinlichkeitsfunktion diskreter X: Summe aller Stützstellen = 1.',
  interaction: 'Gib Wahrscheinlichkeiten (durch Kommas getrennt) ein. Der Balken-Plot normiert automatisch.',
  formula: String.raw`$$P(X=x_i) = p_i,\quad \sum p_i = 1$$`,
  setup: (container, helpers) => {
    container.innerHTML = `
      <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 space-y-3">
        <p class="text-sm text-slate-200">Trage Wahrscheinlichkeiten ein (z.B. 0.1, 0.3, 0.6).</p>
        <input id="probInput" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" value="0.2, 0.3, 0.5" />
        <p id="sumInfo" class="text-xs text-slate-400"></p>
      </div>
    `;
    const input = container.querySelector('#probInput');
    const info = container.querySelector('#sumInfo');

    const update = () => {
      const raw = input.value.split(',').map(x => Number(x.trim())).filter(x => !isNaN(x) && x > 0);
      const total = raw.reduce((a, b) => a + b, 0) || 1;
      const normalized = raw.map(x => x / total);
      info.textContent = `Originalsumme: ${total.toFixed(2)} | Automatisch auf 1.0 normiert`;
      helpers.renderChart({
        type: 'bar',
        labels: normalized.map((_, i) => `x${i}`),
        datasets: [{ label: 'P(X=x_i)', data: normalized, backgroundColor: '#22d3ee99', borderRadius: 8 }]
      });
    };
    input.addEventListener('input', update);
    update();
  }
};

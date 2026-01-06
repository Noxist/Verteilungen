export default {
  id: 9,
  title: 'B(n, p) explorieren',
  module: 'Binomialverteilung',
  concept: 'Form der Binomialverteilung verändert sich mit n (Breite) und p (Schiefe).',
  interaction: 'Regle n und p. Der Balken-Plot zeigt sofort die neue Form.',
  formula: String.raw`$$X \sim B(n, p)$$`,
  setup: (container, helpers) => {
    container.innerHTML = `
      <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <label class="text-xs text-slate-300">n (Versuche)
            <input id="nS" type="range" min="1" max="50" value="20" class="w-full" />
          </label>
          <label class="text-xs text-slate-300">p (Erfolg)
            <input id="pS" type="range" min="0.01" max="0.99" step="0.01" value="0.5" class="w-full" />
          </label>
        </div>
        <p id="info" class="text-center text-emerald-300 text-sm font-semibold"></p>
      </div>
    `;
    const nS = container.querySelector('#nS');
    const pS = container.querySelector('#pS');
    const info = container.querySelector('#info');

    const update = () => {
      const n = parseInt(nS.value), p = parseFloat(pS.value);
      const { labels, data } = helpers.binomialPMF(n, p);
      info.textContent = `B(${n}; ${p.toFixed(2)})`;
      helpers.renderChart({
        type: 'bar',
        labels,
        datasets: [{ label: 'P(X=k)', data, backgroundColor: '#22d3ee99', borderRadius: 4 }]
      });
    };
    [nS, pS].forEach(s => s.addEventListener('input', update));
    update();
  }
};

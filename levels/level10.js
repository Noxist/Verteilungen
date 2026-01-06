export default {
  id: 10,
  title: 'Kumulierte Wahrscheinlichkeit F(k)',
  module: 'Binomialverteilung',
  concept: 'Summe bis zu einem Schwellenwert: „höchstens k“ leuchtet auf.',
  interaction: 'Wähle k. Alle Balken bis k werden markiert und aufsummiert.',
  formula: String.raw`$$F(k) = P(X \le k) = \sum_{i=0}^{k} \binom{n}{i} p^i (1-p)^{n-i}$$`,
  setup: (container, helpers) => {
    container.innerHTML = `
      <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 space-y-3">
        <label class="text-xs text-slate-300">Schwellenwert k
          <input id="kS" type="range" min="0" max="20" value="10" class="w-full" />
        </label>
        <p id="res" class="text-center text-emerald-300 font-bold"></p>
      </div>
    `;
    const kS = container.querySelector('#kS');
    const res = container.querySelector('#res');
    const n = 20, p = 0.4;

    const update = () => {
      const k = parseInt(kS.value);
      const { labels, data } = helpers.binomialPMF(n, p);
      let sum = 0;
      const colors = data.map((v, i) => {
        if (i <= k) { sum += v; return '#22c55eaa'; }
        return '#334155cc';
      });
      res.textContent = `P(X ≤ ${k}) ≈ ${sum.toFixed(4)}`;
      helpers.renderChart({
        type: 'bar', labels,
        datasets: [{ label: 'P(X=k)', data, backgroundColor: colors, borderRadius: 4 }]
      });
    };
    kS.addEventListener('input', update);
    update();
  }
};

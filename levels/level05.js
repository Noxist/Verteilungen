export default {
  id: 5,
  title: 'Erwartungswert E(X)',
  module: 'Zufallsvariablen',
  concept: 'Schwerpunkt der Verteilung. „Balancepunkt“ des Histogramms.',
  interaction: 'Verschiebe Wahrscheinlichkeiten und sieh, wie die Schwerpunkt-Linie wandert.',
  formula: String.raw`$$E(X) = \sum x_i \cdot p_i$$`,
  setup: (container, helpers) => {
    container.innerHTML = `
      <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 space-y-3">
        <p class="text-sm text-slate-200">Verschiebe die Gewichtung nach rechts oder links.</p>
        <input id="weightSlider" type="range" min="0" max="1" step="0.05" value="0.5" class="w-full" />
        <p id="meanInfo" class="text-sm text-emerald-200 font-bold text-center"></p>
      </div>
    `;
    const slider = container.querySelector('#weightSlider');
    const info = container.querySelector('#meanInfo');
    const values = [-2, -1, 0, 1, 2];

    const update = () => {
      const bias = Number(slider.value);
      const probs = values.map(v => (v >= 0 ? bias / 3 : (1 - bias) / 2));
      const norm = probs.reduce((a, b) => a + b, 0);
      const p = probs.map(x => x / norm);
      const mean = values.reduce((acc, v, i) => acc + v * p[i], 0);
      info.textContent = `Erwartungswert E(X) ≈ ${mean.toFixed(2)}`;
      helpers.renderChart({
        type: 'bar',
        labels: values,
        datasets: [{ label: 'Wahrscheinlichkeit', data: p, backgroundColor: '#fbbf2499', borderRadius: 8 }]
      });
    };
    slider.addEventListener('input', update);
    update();
  }
};

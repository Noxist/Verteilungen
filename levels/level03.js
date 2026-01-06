export default {
  id: 3,
  title: 'Binomialverteilung verstehen',
  module: 'Binomialverteilung',
  type: 'chart-composed',
  concept: 'Viele Wiederholungen eines Bernoulli-Experiments formen eine Verteilung.',
  interaction: 'Wähle n und p. Jeder Balken zeigt, wie oft k Treffer vorkommen.',
  formula: String.raw`$$X \sim B(n,p),\quad \mu=np,\ \sigma=\sqrt{np(1-p)}$$`,

  setup: (container, helpers) => {
    container.innerHTML = `
      <div class="space-y-3 bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
        <p class="text-sm text-slate-200">
          Jeder Balken zeigt: <b>Wie oft treten k Treffer auf</b>, wenn man das Experiment sehr oft wiederholt.
        </p>

        <div class="grid md:grid-cols-2 gap-3">
          <label class="text-xs text-slate-300">
            Anzahl Versuche n
            <input id="n" type="range" min="2" max="30" step="1" value="10" class="w-full">
          </label>
          <label class="text-xs text-slate-300">
            Trefferwahrscheinlichkeit p
            <input id="p" type="range" min="0.05" max="0.95" step="0.05" value="0.5" class="w-full">
          </label>
        </div>

        <label class="flex items-center gap-2 text-sm text-slate-200">
          <input id="normal" type="checkbox" class="accent-emerald-500">
          Glockenkurve (Normalapproximation) darüberlegen
        </label>

        <p id="legend" class="text-xs text-slate-300"></p>
      </div>
    `;

    const nEl = container.querySelector('#n');
    const pEl = container.querySelector('#p');
    const normalEl = container.querySelector('#normal');
    const legend = container.querySelector('#legend');

    const update = () => {
      const n = +nEl.value;
      const p = +pEl.value;

      const { labels, data } = helpers.binomialPMF(n, p);
      const mu = n * p;
      const sigma = Math.sqrt(n * p * (1 - p));

      const datasets = [{
        label: 'Häufigkeit von k Treffern',
        data,
        backgroundColor: '#22d3eecc',
        borderRadius: 6
      }];

      if (normalEl.checked) {
        datasets.push({
          label: 'Normalapproximation',
          data: labels.map(k => helpers.normalPDF(mu, sigma, k)),
          type: 'line',
          borderColor: '#f97316',
          borderWidth: 2,
          tension: 0.25,
          pointRadius: 0
        });
      }

      legend.textContent =
        `Balken: Anteil der Versuche mit genau k Treffern | Mittelwert µ=${mu.toFixed(1)} | Streuung σ=${sigma.toFixed(2)}`;

      helpers.renderChart({
        type: 'bar',
        labels,
        datasets
      });
    };

    nEl.addEventListener('input', update);
    pEl.addEventListener('input', update);
    normalEl.addEventListener('change', update);
    update();
  }
};

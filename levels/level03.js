export default {
  id: 3,
  title: 'Binomialverteilung verstehen',
  module: 'Binomialverteilung',
  type: 'chart-bar',
  concept: 'Balken zeigen P(X = k). Mit wachsendem n wird die Verteilung glatter und nähert sich der Normalverteilung.',
  setup: (container, helpers) => {
    container.innerHTML = `
      <div class="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-4">
        <p class="text-sm text-slate-200">
          Jeder Balken zeigt die Wahrscheinlichkeit für <b>genau k Treffer</b>.
          Verändere n und p und beobachte die Form.
        </p>

        <div class="grid md:grid-cols-2 gap-3">
          <label class="text-xs text-slate-300">
            Anzahl Versuche (n)
            <input id="n" type="range" min="5" max="50" step="1" value="10" class="w-full" />
          </label>

          <label class="text-xs text-slate-300">
            Trefferwahrscheinlichkeit (p)
            <input id="p" type="range" min="0.1" max="0.9" step="0.05" value="0.5" class="w-full" />
          </label>
        </div>

        <p id="explain" class="text-sm text-emerald-300"></p>
      </div>
    `;

    const nEl = container.querySelector('#n');
    const pEl = container.querySelector('#p');
    const explain = container.querySelector('#explain');

    const update = () => {
      const n = +nEl.value;
      const p = +pEl.value;

      const { labels, data } = helpers.binomialPMF(n, p);
      const mu = n * p;
      const sigma = Math.sqrt(n * p * (1 - p));

      const datasets = [{
        label: 'P(X = k)',
        data,
        backgroundColor: '#22d3eeaa',
        borderRadius: 6
      }];

      // Normal nur anzeigen, wenn sinnvoll
      if (n * p >= 5 && n * (1 - p) >= 5) {
        datasets.push({
          label: 'Normal-Approximation',
          data: labels.map(k => helpers.normalPDF(mu, sigma, Number(k))),
          type: 'line',
          borderColor: '#f97316',
          borderWidth: 2,
          tension: 0.25,
          pointRadius: 0
        });
      }

      explain.textContent =
        `µ = ${mu.toFixed(1)} (Erwartungswert), σ = ${sigma.toFixed(2)}. ` +
        `Die höchste Säule liegt in der Nähe von µ.`;

      helpers.renderChart({
        type: 'bar',
        labels,
        datasets,
        annotations: [
          { type: 'line', x: mu, label: 'µ' }
        ]
      });
    };

    nEl.addEventListener('input', update);
    pEl.addEventListener('input', update);
    update();
  }
};

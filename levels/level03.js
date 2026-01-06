export default {
  id: 3,
  title: 'Binomial erkunden & Normal-Approximation',
  module: 'Binomialverteilung',
  type: 'chart-bar',
  concept: 'Form der Binomialverteilung verändert sich mit n und p; für großes n nähert sie sich der Normalverteilung.',
  interaction: 'Regle n und p. Optional Normal-Approximation zuschalten.',
  formula: String.raw`$$P(X=k) = \binom{n}{k} p^k (1-p)^{n-k} \quad\Rightarrow\quad B(n,p) \approx \mathcal{N}(np, np(1-p))$$`,
  setup: (container, helpers) => {
    container.innerHTML = `
      <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 space-y-3">
        <p class="text-sm text-slate-200">Passe n und p an. Die Normal-Approximation kannst du bei Bedarf aktivieren.</p>
        <div class="grid md:grid-cols-2 gap-3">
          <label class="text-xs text-slate-300">n
            <input id="nSlider" type="range" min="2" max="30" step="1" value="10" class="w-full" />
          </label>
          <label class="text-xs text-slate-300">p
            <input id="pSlider" type="range" min="0.05" max="0.95" step="0.05" value="0.5" class="w-full" />
          </label>
        </div>
        <label class="flex items-center gap-2 text-sm text-slate-200">
          <input id="approxToggle" type="checkbox" class="accent-emerald-500" /> Normal-Approximation anzeigen
        </label>
        <p id="binomInfo" class="text-sm text-emerald-200"></p>
      </div>
    `;

    const nSlider = container.querySelector('#nSlider');
    const pSlider = container.querySelector('#pSlider');
    const approxToggle = container.querySelector('#approxToggle');
    const info = container.querySelector('#binomInfo');

    const update = () => {
      const n = Number(nSlider.value);
      const p = Number(pSlider.value);
      const { labels, data } = helpers.binomialPMF(n, p);
      const mu = n * p;
      const sigma = Math.sqrt(n * p * (1 - p));

      const datasets = [
        { label: 'P(X=k)', data, backgroundColor: '#22d3ee99', borderRadius: 8 }
      ];

      if (approxToggle.checked) {
        const curve = labels.map((x) => helpers.normalPDF(mu, sigma, Number(x)));
        datasets.push({
          label: 'Normalapprox.',
          data: curve,
          type: 'line',
          borderColor: '#f97316',
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.25
        });
      }

      info.textContent = `n = ${n}, p = ${p.toFixed(2)}, µ = ${(mu).toFixed(2)}, σ = ${sigma.toFixed(2)}`;
      helpers.renderChart({
        type: 'bar',
        labels,
        datasets
      });
    };

    nSlider.addEventListener('input', update);
    pSlider.addEventListener('input', update);
    approxToggle.addEventListener('change', update);
    update();
  }
};

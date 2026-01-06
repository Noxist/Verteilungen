export default {
  id: 14,
  title: 'Die Gauss-Glocke',
  module: 'Normalverteilung',
  concept: 'Parameter verschieben Lage (µ) und Breite (σ).',
  interaction: 'Regle µ und σ. Die Glockenkurve passt sich sofort an.',
  formula: String.raw`$$f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}$$`,
  setup: (container, helpers) => {
    container.innerHTML = `
      <div class="grid grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-2xl">
        <label class="text-xs text-slate-300">µ (Lage): <input id="mu" type="range" min="-3" max="3" step="0.1" value="0" class="w-full"/></label>
        <label class="text-xs text-slate-300">σ (Breite): <input id="sig" type="range" min="0.5" max="2" step="0.1" value="1" class="w-full"/></label>
      </div>
    `;
    const muI = container.querySelector('#mu'), sigI = container.querySelector('#sig');
    const update = () => {
      const mu = parseFloat(muI.value), sigma = parseFloat(sigI.value);
      const xs = [], ys = [];
      for (let x = -6; x <= 6; x += 0.2) { xs.push(x.toFixed(1)); ys.push(helpers.normalPDF(mu, sigma, x)); }
      helpers.renderChart({ type: 'line', labels: xs, datasets: [{ label: 'f(x)', data: ys, borderColor: '#22c55e', fill: true, backgroundColor: '#22c55e33' }] });
    };
    [muI, sigI].forEach(i => i.addEventListener('input', update));
    update();
  }
};

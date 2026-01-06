export default {
  id: 13,
  title: 'Von Diskret zu Stetig',
  module: 'Normalverteilung',
  concept: 'Mit wachsendem n nähert sich B(n,p) einer Normalverteilung.',
  interaction: 'Erhöhe n: Balken werden schmaler, die Kurve schmiegt sich an.',
  formula: String.raw`$$B(n,p) \approx \mathcal{N}(np, \sqrt{np(1-p)})$$`,
  setup: (container, helpers) => {
    container.innerHTML = `<input id="nS" type="range" min="5" max="100" value="20" class="w-full p-4" />`;
    const nS = container.querySelector('#nS');
    const update = () => {
      const n = parseInt(nS.value), p = 0.5;
      const { labels, data } = helpers.binomialPMF(n, p);
      const mu = n * p, sigma = Math.sqrt(n * p * (1 - p));
      const curve = labels.map(x => helpers.normalPDF(mu, sigma, x));
      helpers.renderChart({
        type: 'bar', labels,
        datasets: [
          { label: 'Binomial', data, backgroundColor: '#f9731688' },
          { label: 'Normal', data: curve, type: 'line', borderColor: '#22d3ee', tension: 0.4 }
        ]
      });
    };
    nS.addEventListener('input', update);
    update();
  }
};

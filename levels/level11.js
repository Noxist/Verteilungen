export default {
  id: 11,
  title: 'Sigma-Regeln',
  module: 'Binomialverteilung',
  concept: '68-95-99,7-Regel für angenäherte Normalverteilungen.',
  interaction: 'Aktiviere Intervalle, um die Wahrscheinlichkeitsbereiche zu sehen.',
  formula: String.raw`$$P(\mu \pm 1\sigma) \approx 0.68$$`,
  setup: (container, helpers) => {
    container.innerHTML = `
      <div class="flex gap-4 justify-center bg-slate-800/50 p-4 rounded-2xl">
        <label class="text-sm"><input type="checkbox" id="s1" checked /> 1σ</label>
        <label class="text-sm"><input type="checkbox" id="s2" /> 2σ</label>
        <label class="text-sm"><input type="checkbox" id="s3" /> 3σ</label>
      </div>
    `;
    const checks = ['s1', 's2', 's3'].map(id => container.querySelector(`#${id}`));
    const xs = [], ys = [];
    for (let x = -4; x <= 4; x += 0.2) { xs.push(x.toFixed(1)); ys.push(helpers.normalPDF(0, 1, x)); }

    const update = () => {
      const bg = ys.map((_, i) => {
        const x = parseFloat(xs[i]);
        if (checks[2].checked && Math.abs(x) <= 3) return '#22c55e55';
        if (checks[1].checked && Math.abs(x) <= 2) return '#a855f766';
        if (checks[0].checked && Math.abs(x) <= 1) return '#38bdf877';
        return '#0f172acc';
      });
      helpers.renderChart({ type: 'line', labels: xs, datasets: [{ label: 'Dichte', data: ys, backgroundColor: bg, fill: true, tension: 0.4 }] });
    };
    checks.forEach(c => c.addEventListener('change', update));
    update();
  }
};

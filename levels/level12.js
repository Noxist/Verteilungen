export default {
  id: 12,
  title: 'Mindestens-Mindestens',
  module: 'Binomialverteilung',
  concept: 'Finde die nötige Stichprobengröße für eine Zielwahrscheinlichkeit.',
  interaction: 'Stelle p und Ziel ein. Der Rechner findet das minimale n.',
  formula: String.raw`$$P(X \ge 1) = 1 - (1-p)^n \ge \text{Ziel}$$`,
  setup: (container, helpers) => {
    container.innerHTML = `
      <div class="grid grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-2xl">
        <label class="text-xs">p: <input id="pI" type="range" min="0.05" max="0.5" step="0.05" value="0.2" class="w-full"/></label>
        <label class="text-xs">Ziel: <input id="zI" type="range" min="0.8" max="0.99" step="0.01" value="0.9" class="w-full"/></label>
        <p id="out" class="col-span-2 text-center text-emerald-300 font-bold"></p>
      </div>
    `;
    const pI = container.querySelector('#pI'), zI = container.querySelector('#zI'), out = container.querySelector('#out');
    const update = () => {
      const p = parseFloat(pI.value), target = parseFloat(zI.value);
      let n = Math.ceil(Math.log(1 - target) / Math.log(1 - p));
      out.textContent = `Minimales n = ${n}`;
      const labels = Array.from({length: 15}, (_, i) => i + 1);
      const data = labels.map(k => 1 - Math.pow(1 - p, k));
      helpers.renderChart({ type: 'bar', labels, datasets: [{ label: 'P(X ≥ 1)', data, backgroundColor: labels.map(k => k >= n ? '#22c55eaa' : '#38bdf877') }] });
    };
    [pI, zI].forEach(i => i.addEventListener('input', update));
    update();
  }
};

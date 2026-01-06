export default {
  id: 1,
  title: 'Gesetz der großen Zahlen & Pfadregel',
  module: 'Grundlagen',
  type: 'chart-bar',
  concept: 'Relative Häufigkeiten stabilisieren sich, Pfade multiplizieren sich.',
  interaction: 'Simuliere Würfe oder bewege Pfad-Slider. Das Chart passt sich sofort an.',
  formula: String.raw`$$P(A \cap B) = P(A) \cdot P(B\,|\,A) \qquad P(\text{Ereignis}) \approx \frac{\text{günstig}}{\text{möglich}}$$`,
  setup: (container, helpers) => {
    container.innerHTML = `
      <div class="space-y-4">
        <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 space-y-3">
          <p class="text-sm text-slate-200">Simuliere 50 Würfe und beobachte die relative Häufigkeit der Augenzahlen.</p>
          <div class="flex items-center gap-3 flex-wrap">
            <button id="throwBtn" class="px-4 py-2 rounded-xl bg-indigo-500 text-white font-semibold shadow">50 Würfe</button>
            <p id="llnInfo" class="text-sm text-slate-300">Starte die Simulation.</p>
          </div>
        </div>
        <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 space-y-3">
          <p class="text-sm text-slate-200">Passe Pfadwahrscheinlichkeiten an und sieh das Produkt.</p>
          <div class="grid md:grid-cols-2 gap-3">
            <label class="text-xs text-slate-300">P(A)
              <input id="pa" type="range" min="0" max="1" step="0.05" value="0.5" class="w-full" />
            </label>
            <label class="text-xs text-slate-300">P(B | A)
              <input id="pba" type="range" min="0" max="1" step="0.05" value="0.5" class="w-full" />
            </label>
          </div>
          <p id="pathInfo" class="text-sm text-emerald-200 font-semibold"></p>
        </div>
      </div>
    `;

    const throwBtn = container.querySelector('#throwBtn');
    const llnInfo = container.querySelector('#llnInfo');
    const pa = container.querySelector('#pa');
    const pba = container.querySelector('#pba');
    const pathInfo = container.querySelector('#pathInfo');

    const counts = [0, 0, 0, 0, 0, 0];

    const updateLLN = () => {
      const total = counts.reduce((a, b) => a + b, 0) || 1;
      const freqs = counts.map((c) => Number((c / total).toFixed(3)));
      llnInfo.textContent = `n = ${total} · Relative Häufigkeit ~ ${freqs.join(' | ')}`;
      helpers.renderChart({
        type: 'bar',
        labels: ['1', '2', '3', '4', '5', '6'],
        datasets: [
          {
            label: 'Relative Häufigkeit',
            data: freqs,
            backgroundColor: '#22c55e99',
            borderRadius: 8
          }
        ]
      });
    };

    throwBtn.addEventListener('click', () => {
      for (let i = 0; i < 50; i++) {
        const roll = Math.floor(Math.random() * 6);
        counts[roll] += 1;
      }
      updateLLN();
    });

    const updateTree = () => {
      const paV = Number(pa.value);
      const pbaV = Number(pba.value);
      const path = Number((paV * pbaV).toFixed(3));
      pathInfo.textContent = `P(A ∩ B) = ${path}`;
      helpers.renderChart({
        type: 'bar',
        labels: ['P(A)', 'P(B|A)', 'Pfad'],
        datasets: [
          { label: 'Wert', data: [paV, pbaV, path], backgroundColor: ['#38bdf899', '#c084fc99', '#22c55eaa'], borderRadius: 8 }
        ]
      });
    };

    pa.addEventListener('input', updateTree);
    pba.addEventListener('input', updateTree);

    updateLLN();
    updateTree();
  }
};

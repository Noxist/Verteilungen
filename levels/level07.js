export default {
  id: 7,
  title: 'Das Bernoulli-Experiment',
  module: 'Binomialverteilung',
  concept: 'Zwei Ausgänge: Erfolg oder Misserfolg. Unabhängige Wiederholungen.',
  interaction: 'Simuliere ein Galton-Brett: 200 Kugeln fallen in Klassen.',
  formula: String.raw`$$P(X=k) = \binom{n}{k} p^k (1-p)^{n-k}$$`,
  setup: (container, helpers) => {
    container.innerHTML = `
      <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-center space-y-3">
        <button id="galtonBtn" class="px-6 py-2 rounded-xl bg-emerald-500 text-slate-900 font-bold shadow">200 Kugeln fallen lassen</button>
        <p id="galtonInfo" class="text-xs text-slate-300"></p>
      </div>
    `;
    const btn = container.querySelector('#galtonBtn');
    const info = container.querySelector('#galtonInfo');
    const n = 8;

    const simulate = () => {
      const counts = Array(n + 1).fill(0);
      for (let i = 0; i < 200; i++) {
        let k = 0;
        for (let j = 0; j < n; j++) if (Math.random() < 0.5) k++;
        counts[k]++;
      }
      info.textContent = `Simulation abgeschlossen. Die Mitte ist am wahrscheinlichsten.`;
      helpers.renderChart({
        type: 'bar',
        labels: counts.map((_, i) => i),
        datasets: [{ label: 'Häufigkeit', data: counts.map(c => c / 200), backgroundColor: '#38bdf899', borderRadius: 8 }]
      });
    };
    btn.addEventListener('click', simulate);
    simulate();
  }
};

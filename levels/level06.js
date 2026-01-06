export default {
  id: 6,
  title: 'Varianz & Standardabweichung',
  module: 'Zufallsvariablen',
  concept: 'Streuung misst Abstand der Werte zum Erwartungswert.',
  interaction: 'Streue die Daten weiter mit dem Slider. Die angezeigte σ reagiert sofort.',
  formula: String.raw`$$\sigma^2 = \mathrm{Var}(X) = \sum (x_i - E(X))^2 p_i$$`,
  setup: (container, helpers) => {
    container.innerHTML = `
      <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 space-y-3">
        <label class="text-xs text-slate-300">Streuung (Standardabweichung)
          <input id="spreadSlider" type="range" min="0.2" max="2.5" step="0.1" value="1" class="w-full" />
        </label>
        <p id="varInfo" class="text-sm text-emerald-200 text-center font-semibold"></p>
      </div>
    `;
    const slider = container.querySelector('#spreadSlider');
    const info = container.querySelector('#varInfo');

    const update = () => {
      const sigma = Number(slider.value);
      const xs = [], ys = [];
      for (let x = -4; x <= 4; x += 0.5) {
        xs.push(x.toFixed(1));
        ys.push(helpers.normalPDF(0, sigma, x));
      }
      info.textContent = `σ ≈ ${sigma.toFixed(2)} | Var(X) ≈ ${(sigma * sigma).toFixed(2)}`;
      helpers.renderChart({
        type: 'bar',
        labels: xs,
        datasets: [{ label: 'Dichte', data: ys, backgroundColor: '#22c55e99', borderRadius: 4 }]
      });
    };
    slider.addEventListener('input', update);
    update();
  }
};

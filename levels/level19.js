export default {
  id: 19,
  title: 'Hypothesentest & Fehler',
  module: 'Beurteilende Statistik',
  type: 'scatter',
  concept: 'Wir testen H0 (Würfel ist fair, p=1/6) gegen H1 (Würfel ist gezinkt, p > 1/6). Wo liegt die Grenze?',
  interaction: 'Lege den Ablehnungsbereich fest. Simuliere 100 Tests und sieh, wie oft du falsch entscheidest.',
  formula: String.raw`$$\alpha = P(X \ge k | p=p_0) \quad \text{(Fehler 1. Art)}$$`,
  setup: (container, helpers) => {
    container.innerHTML = `
      <div class="space-y-5">
        <div class="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
           <p class="text-sm text-slate-300 mb-2">Nullhypothese $H_0: p = 1/6$ (Fair). Stichprobe $n=60$.</p>
           <div class="flex items-center gap-4">
             <span class="text-xs text-slate-400">Ablehnungsbereich ab k = <span id="kVal" class="text-white font-bold text-lg">15</span></span>
             <input id="kSlider" type="range" min="10" max="25" value="15" class="flex-1 accent-rose-500">
           </div>
           <div class="flex justify-between text-xs mt-2">
             <span class="text-rose-400">$\alpha$ (Fehler 1. Art): <span id="alphaVal">--</span>%</span>
             <span class="text-indigo-400">$\beta$ (Fehler 2. Art für p=0.3): <span id="betaVal">--</span>%</span>
           </div>
        </div>

        <button id="simTests" class="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-bold text-white transition">
           100 Stichproben simulieren (50x Fair / 50x Gezinkt)
        </button>

        <div id="simRes" class="grid grid-cols-2 gap-2 text-center text-xs hidden animate-in fade-in slide-in-from-bottom-2">
           <div class="p-2 bg-emerald-900/30 border border-emerald-800 rounded">
             Korrekte Entscheidungen: <br> <span id="correctCount" class="text-lg font-bold text-emerald-400">0</span>
           </div>
           <div class="p-2 bg-rose-900/30 border border-rose-800 rounded">
             Fehlentscheidungen: <br> <span id="errorCount" class="text-lg font-bold text-rose-400">0</span>
           </div>
        </div>
      </div>
    `;

    const slider = container.querySelector('#kSlider');
    const kVal = container.querySelector('#kVal');
    const alphaVal = container.querySelector('#alphaVal');
    const betaVal = container.querySelector('#betaVal');
    const simBtn = container.querySelector('#simTests');

    const n = 60;
    const p0 = 1/6;
    const p1 = 0.30; // Gezinkter Würfel zum Vergleich

    // Helper: Cumulative Binomial P(X >= k)
    const probGe = (k, p) => {
      let sum = 0;
      for(let i=k; i<=n; i++) {
        sum += helpers.combination(n, i) * Math.pow(p, i) * Math.pow(1-p, n-i);
      }
      return sum;
    };
    
    // Helper: Cumulative Binomial P(X < k) -> Fehler 2. Art
    const probLt = (k, p) => {
      return 1 - probGe(k, p);
    };

    const updateCalc = () => {
      const k = parseInt(slider.value);
      kVal.textContent = k;
      
      const alpha = probGe(k, p0); // H0 ablehnen obwohl wahr
      const beta = probLt(k, p1);  // H0 annehmen obwohl H1 wahr

      alphaVal.textContent = (alpha * 100).toFixed(2);
      betaVal.textContent = (beta * 100).toFixed(2);

      // Visualisieren der Verteilungen
      const distH0 = helpers.binomialPMF(n, p0);
      const distH1 = helpers.binomialPMF(n, p1);

      helpers.renderChart({
        type: 'bar',
        labels: distH0.labels,
        datasets: [
          {
            label: 'H0 (Fair)',
            data: distH0.data,
            backgroundColor: distH0.labels.map(x => x >= k ? '#f43f5e' : '#94a3b8'), // Rot im Ablehnungsbereich
            order: 2
          },
          {
            label: 'H1 (Gezinkt)',
            data: distH1.data,
            type: 'line',
            borderColor: '#6366f1',
            borderWidth: 2,
            pointRadius: 0,
            order: 1
          }
        ]
      });
    };

    simBtn.addEventListener('click', () => {
      const k = parseInt(slider.value);
      let correct = 0;
      let errors = 0;

      // 50x Fair
      for(let i=0; i<50; i++) {
        let hits = 0;
        for(let j=0; j<n; j++) if(Math.random() < p0) hits++;
        if(hits < k) correct++; // H0 beibehalten (Richtig)
        else errors++; // Fehler 1. Art
      }

      // 50x Gezinkt
      for(let i=0; i<50; i++) {
        let hits = 0;
        for(let j=0; j<n; j++) if(Math.random() < p1) hits++;
        if(hits >= k) correct++; // H0 abgelehnt (Richtig)
        else errors++; // Fehler 2. Art
      }

      container.querySelector('#simRes').classList.remove('hidden');
      container.querySelector('#correctCount').textContent = correct;
      container.querySelector('#errorCount').textContent = errors;
    });

    slider.addEventListener('input', updateCalc);
    updateCalc();
  }
};

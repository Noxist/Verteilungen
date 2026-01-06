export default {
  id: 16,
  title: 'Vierfeldertafel & Bedingte Wkt.',
  module: 'Bedingte Wahrscheinlichkeit',
  type: 'doughnut',
  concept: 'Die Wahrscheinlichkeit von A ändert sich, wenn man weiß, dass B bereits eingetreten ist.',
  interaction: 'Führe einen medizinischen Test an der Bevölkerung durch. Sieh, wie viele "Positiven" wirklich krank sind.',
  formula: String.raw`$$P(K|T) = \frac{P(K \cap T)}{P(T)}$$`,
  setup: (container, helpers) => {
    container.innerHTML = `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4 text-xs text-center">
          <div class="bg-slate-800 p-2 rounded-xl border border-slate-700">
            <span class="block text-slate-400">Bevölkerung</span>
            <span class="text-xl font-bold text-white" id="popCount">200</span>
          </div>
          <div class="bg-slate-800 p-2 rounded-xl border border-slate-700">
            <span class="block text-slate-400">Prävalenz (Krankheit)</span>
            <span class="text-xl font-bold text-pink-400">10%</span>
          </div>
        </div>
        
        <div id="dotGrid" class="grid grid-cols-[repeat(20,1fr)] gap-1 h-48 content-start p-2 bg-slate-900/50 rounded-xl overflow-hidden">
          </div>

        <div class="flex justify-between items-center">
          <button id="runTestBtn" class="px-6 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
            Test durchführen
          </button>
          <div class="text-right">
            <p class="text-xs text-slate-400">Sensitivität: 90% | Spezifität: 80%</p>
          </div>
        </div>

        <div id="resultBox" class="hidden p-3 bg-slate-800/80 border border-slate-600 rounded-xl text-center animate-pulse">
          <p class="text-sm text-slate-300">Von den Positiv getesteten sind...</p>
          <p id="bayesResult" class="text-2xl font-bold text-emerald-400 mt-1">-- %</p>
          <p class="text-xs text-slate-400">...wirklich krank.</p>
        </div>
      </div>
    `;

    const grid = container.querySelector('#dotGrid');
    const btn = container.querySelector('#runTestBtn');
    const resultBox = container.querySelector('#resultBox');
    const bayesResult = container.querySelector('#bayesResult');

    // Config
    const total = 200;
    const prevalence = 0.10;
    const sensitivity = 0.90; // P(Pos|Krank)
    const specificity = 0.80; // P(Neg|Gesund) -> P(Pos|Gesund) = 0.20

    let people = [];

    // Init Population
    const init = () => {
      grid.innerHTML = '';
      people = [];
      for(let i=0; i<total; i++) {
        const isSick = Math.random() < prevalence;
        const person = { 
          id: i, 
          sick: isSick, 
          testedPos: false,
          el: document.createElement('div') 
        };
        person.el.className = `w-1.5 h-1.5 rounded-full transition-all duration-500 ${isSick ? 'bg-pink-500' : 'bg-slate-600'}`;
        grid.appendChild(person.el);
        people.push(person);
      }
      helpers.renderChart({
        type: 'doughnut',
        labels: ['Gesund', 'Krank'],
        datasets: [{ data: [1-prevalence, prevalence], backgroundColor: ['#475569', '#ec4899'], borderWidth: 0 }]
      });
    };

    btn.addEventListener('click', () => {
      let truePos = 0;
      let falsePos = 0;

      people.forEach((p, idx) => {
        // Test logic
        if (p.sick) {
          p.testedPos = Math.random() < sensitivity;
          if(p.testedPos) truePos++;
        } else {
          p.testedPos = Math.random() > specificity; // False positive
          if(p.testedPos) falsePos++;
        }

        // Visualize Test
        setTimeout(() => {
          if (p.testedPos) {
            p.el.classList.remove('bg-pink-500', 'bg-slate-600');
            p.el.classList.add('bg-indigo-400', 'scale-150', 'shadow-[0_0_8px_rgba(129,140,248,0.8)]');
          } else {
            p.el.style.opacity = '0.2';
          }
        }, idx * 5); // Staggered animation
      });

      const totalPos = truePos + falsePos;
      const probSickGivenPos = totalPos > 0 ? (truePos / totalPos) : 0;

      setTimeout(() => {
        resultBox.classList.remove('hidden');
        bayesResult.textContent = (probSickGivenPos * 100).toFixed(1) + ' %';
        
        helpers.renderChart({
          type: 'bar',
          labels: ['Richtig Positiv', 'Falsch Positiv'],
          datasets: [{
            label: 'Anzahl Personen',
            data: [truePos, falsePos],
            backgroundColor: ['#ec4899', '#94a3b8']
          }]
        });
      }, total * 5 + 200);
    });

    init();
  }
};

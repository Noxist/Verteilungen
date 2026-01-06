export default {
  id: 20,
  title: 'Casino Royale (Finale)',
  module: 'Anwendung',
  type: 'line',
  concept: 'Kombiniere Wahrscheinlichkeit und Erwartungswert. Lohnt sich das Risiko beim "Ziehen ohne Zurücklegen"?',
  interaction: 'Ein Deck mit Karten (Werte 1-10). Ziehe Karten, aber überschreite 21 nicht (Blackjack-Lite).',
  formula: String.raw`$$E(X) = \sum x_i \cdot P(X=x_i)$$`,
  setup: (container, helpers) => {
    container.innerHTML = `
      <div class="text-center space-y-4">
        <div id="deckInfo" class="text-xs text-slate-400">Deck: 40 Karten (4x 1-10)</div>
        
        <div class="flex justify-center gap-4 min-h-[100px] items-center">
           <div id="playerSum" class="text-5xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">0</div>
        </div>
        
        <div id="riskDisplay" class="h-2 bg-slate-800 rounded-full overflow-hidden w-2/3 mx-auto">
           <div id="riskBar" class="h-full bg-gradient-to-r from-emerald-500 to-rose-500 w-0 transition-all duration-500"></div>
        </div>
        <p class="text-xs text-slate-400">Crash Wahrscheinlichkeit: <span id="riskText">0%</span></p>

        <div class="flex justify-center gap-4 mt-4">
          <button id="hitBtn" class="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg transform transition active:scale-95">HIT (Karte ziehen)</button>
          <button id="standBtn" class="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg transform transition active:scale-95">STAND</button>
        </div>

        <div id="gameMsg" class="h-8 font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400"></div>
      </div>
    `;

    // Game Logic
    let deck = [];
    let currentSum = 0;
    const target = 21;

    const initDeck = () => {
      deck = [];
      for(let v=1; v<=10; v++) {
        for(let i=0; i<4; i++) deck.push(v); // 4 of each
      }
    };

    const updateRisk = () => {
      if (deck.length === 0) return;
      
      const needed = target - currentSum;
      // Count cards that would bust
      const busters = deck.filter(c => c > needed).length;
      const probBust = busters / deck.length;

      container.querySelector('#riskBar').style.width = `${probBust * 100}%`;
      container.querySelector('#riskText').textContent = Math.round(probBust * 100) + '%';
      
      // Update Chart visualization of remaining deck
      const counts = Array(11).fill(0);
      deck.forEach(x => counts[x]++);
      
      helpers.renderChart({
        type: 'bar',
        labels: ['1','2','3','4','5','6','7','8','9','10'],
        datasets: [{
          label: 'Verbleibende Karten',
          data: counts.slice(1),
          backgroundColor: counts.slice(1).map((c, i) => (i+1) > needed ? '#f43f5e' : '#34d399'),
          borderRadius: 4
        }],
        options: { scales: { y: { display: false } }, plugins: { legend: { display: false } } }
      });
    };

    const hit = () => {
      if(deck.length === 0) return;
      
      // Draw random
      const idx = Math.floor(Math.random() * deck.length);
      const card = deck.splice(idx, 1)[0];
      
      currentSum += card;
      container.querySelector('#playerSum').textContent = currentSum;
      
      // Animate card (simple DOM append temporarily)
      const cardEl = document.createElement('div');
      cardEl.className = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-yellow-300 animate-ping opacity-0';
      cardEl.textContent = `+${card}`;
      container.querySelector('#playerSum').appendChild(cardEl);

      if (currentSum > target) {
        endGame(false);
      } else {
        updateRisk();
      }
    };

    const endGame = (win) => {
      const msg = container.querySelector('#gameMsg');
      const hitBtn = container.querySelector('#hitBtn');
      const standBtn = container.querySelector('#standBtn');
      
      hitBtn.disabled = true;
      standBtn.disabled = true;
      hitBtn.classList.add('opacity-50', 'cursor-not-allowed');

      if (!win && currentSum > target) {
        msg.textContent = `💥 BUST! (${currentSum})`;
      } else {
        // Simple logic: if sum >= 18 considered "good" for this mini game
        if (currentSum >= 18) msg.textContent = `🏆 Gewonnen! (${currentSum})`;
        else msg.textContent = `⚠️ Zu wenig Risiko... (${currentSum})`;
      }

      setTimeout(() => {
        hitBtn.disabled = false; 
        standBtn.disabled = false;
        hitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        reset();
      }, 2500);
    };

    const reset = () => {
      initDeck();
      currentSum = 0;
      container.querySelector('#playerSum').textContent = 0;
      container.querySelector('#gameMsg').textContent = '';
      updateRisk();
    };

    container.querySelector('#hitBtn').addEventListener('click', hit);
    container.querySelector('#standBtn').addEventListener('click', () => endGame(true));

    reset();
  }
};

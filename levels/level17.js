export default {
  id: 17,
  title: 'Das Ziegenproblem (Monty Hall)',
  module: 'Klassiker',
  type: 'bar',
  concept: 'Wechseln verdoppelt die Gewinnchance von 1/3 auf 2/3. Intuitiv schwer zu greifen, statistisch eindeutig.',
  interaction: 'Wähle ein Tor. Monty öffnet eine Niete. Wechselst du? Spiele oft, um die Statistik zu sehen.',
  formula: String.raw`$$P(\text{Auto}|\text{Wechsel}) = \frac{2}{3} \quad \text{vs} \quad P(\text{Auto}|\text{Bleiben}) = \frac{1}{3}$$`,
  setup: (container, helpers) => {
    container.innerHTML = `
      <div class="flex flex-col items-center gap-6">
        <div class="flex gap-4 w-full justify-center perspective-[800px]">
          ${[0,1,2].map(i => `
            <div class="door-container relative w-24 h-36 cursor-pointer group" data-door="${i}">
              <div class="door-back absolute inset-0 bg-slate-800 rounded-xl flex items-center justify-center text-4xl border border-slate-700">
                <span class="content-icon">🐐</span>
              </div>
              <div class="door-front absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl flex items-center justify-center text-2xl font-bold text-white border-2 border-indigo-400 shadow-xl transition-transform duration-700 origin-left z-10 group-hover:brightness-110">
                ${i+1}
              </div>
            </div>
          `).join('')}
        </div>
        
        <p id="msg" class="text-center text-emerald-300 font-bold min-h-[1.5rem]">Wähle ein Tor!</p>

        <div class="flex gap-4">
           <div class="text-center">
             <div class="text-xs text-slate-400 uppercase tracking-wider">Mit Wechseln</div>
             <div class="text-xl font-mono" id="statSwitch">0% (0/0)</div>
           </div>
           <div class="w-px bg-slate-700"></div>
           <div class="text-center">
             <div class="text-xs text-slate-400 uppercase tracking-wider">Ohne Wechseln</div>
             <div class="text-xl font-mono" id="statStay">0% (0/0)</div>
           </div>
        </div>
      </div>
    `;

    // State
    let carDoor = -1;
    let selectedDoor = -1;
    let openedDoor = -1;
    let state = 'PICK'; // PICK, DECIDE, REVEAL
    let stats = { switchWins: 0, switchPlays: 0, stayWins: 0, stayPlays: 0 };

    const doors = container.querySelectorAll('.door-container');
    const msg = container.querySelector('#msg');

    const reset = () => {
      carDoor = Math.floor(Math.random() * 3);
      selectedDoor = -1;
      openedDoor = -1;
      state = 'PICK';
      msg.textContent = "Wähle ein Tor!";
      
      doors.forEach((d, i) => {
        d.querySelector('.door-front').style.transform = 'rotateY(0deg)';
        d.querySelector('.content-icon').textContent = (i === carDoor) ? '🏎️' : '🐐';
        d.querySelector('.door-front').classList.remove('opacity-20');
        d.onclick = () => handleDoorClick(i);
      });
    };

    const handleDoorClick = (idx) => {
      if (state === 'PICK') {
        selectedDoor = idx;
        // Monty opens a goat door (not car, not selected)
        const possibleOpens = [0,1,2].filter(i => i !== carDoor && i !== selectedDoor);
        openedDoor = possibleOpens[Math.floor(Math.random() * possibleOpens.length)];
        
        // Animate open
        doors[openedDoor].querySelector('.door-front').style.transform = 'rotateY(-110deg)';
        msg.innerHTML = `Tor ${openedDoor+1} ist eine Ziege! <br><span class="text-white">Klicke dein Tor (bleiben) oder das andere (wechseln).</span>`;
        state = 'DECIDE';
        
      } else if (state === 'DECIDE') {
        if (idx === openedDoor) return; // Can't choose opened
        
        const didSwitch = (idx !== selectedDoor);
        const win = (idx === carDoor);
        
        // Update Stats
        if (didSwitch) { stats.switchPlays++; if(win) stats.switchWins++; }
        else { stats.stayPlays++; if(win) stats.stayWins++; }
        
        // Reveal All
        doors.forEach((d, i) => d.querySelector('.door-front').style.transform = 'rotateY(-110deg)');
        msg.textContent = win ? "GEWONNEN! 🎉" : "LEIDER NEIN. 🐐";
        msg.className = win ? "text-center text-emerald-400 font-bold" : "text-center text-amber-400 font-bold";

        updateStatsUI();
        state = 'REVEAL';
        setTimeout(reset, 2500);
      }
    };

    const updateStatsUI = () => {
      const swRate = stats.switchPlays ? Math.round(stats.switchWins/stats.switchPlays*100) : 0;
      const stRate = stats.stayPlays ? Math.round(stats.stayWins/stats.stayPlays*100) : 0;
      
      container.querySelector('#statSwitch').textContent = `${swRate}% (${stats.switchWins}/${stats.switchPlays})`;
      container.querySelector('#statStay').textContent = `${stRate}% (${stats.stayWins}/${stats.stayPlays})`;

      helpers.renderChart({
        type: 'bar',
        labels: ['Gewinnquote Wechseln', 'Gewinnquote Bleiben'],
        datasets: [{
          label: 'Prozent',
          data: [swRate, stRate],
          backgroundColor: ['#818cf8', '#94a3b8']
        }]
      });
    };

    reset();
  }
};

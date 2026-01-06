export default {
  id: 15,
  title: 'Das große Finale (Quiz)',
  module: 'Normalverteilung',
  concept: 'Mische alles: wähle die passende Antwort zu zufälligen Aufgaben.',
  interaction: 'Beantworte die Fragen korrekt, um das Modul abzuschliessen.',
  formula: String.raw`$$\text{Viel Erfolg!}$$`,
  setup: (container, helpers) => {
    const questions = [
      { q: "Was ist das Gesetz der großen Zahlen?", a: ["Häufigkeiten stabilisieren sich", "Pfade addieren sich"], c: 0 },
      { q: "Wann nähert sich B(n,p) der Normalverteilung?", a: ["n klein", "n groß"], c: 1 }
    ];
    let cur = 0;
    const render = () => {
      const item = questions[cur % questions.length];
      container.innerHTML = `
        <p class="font-bold mb-3">${item.q}</p>
        <div class="flex flex-col gap-2">
          ${item.a.map((opt, i) => `<button class="opt px-4 py-2 bg-slate-700 rounded-xl hover:bg-indigo-600" data-idx="${i}">${opt}</button>`).join('')}
        </div>
        <p id="fb" class="mt-3 font-bold"></p>
      `;
      container.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => {
        const win = parseInt(b.dataset.idx) === item.c;
        container.querySelector('#fb').textContent = win ? "Richtig! Nächste Frage..." : "Leider falsch.";
        container.querySelector('#fb').className = win ? "text-emerald-400" : "text-amber-400";
        if(win) setTimeout(() => { cur++; render(); }, 1500);
      }));
    };
    render();
    helpers.clearChart();
  }
};

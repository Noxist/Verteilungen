const level = {
  id: 2,
  title: "Zufallsvariable beim Würfel",
  task: "Ein fairer Würfel wird einmal geworfen. Markiere alle Ergebnisse, die zum Ereignis «gerade Zahl» gehören. Die Wahrscheinlichkeit ergibt sich automatisch als Anteil der markierten Ergebnisse.",
  data: {
    outcomes: [1, 2, 3, 4, 5, 6],
    selected: [] // vom UI gesetzt
  },
  computeProbability: function () {
    return this.data.selected.length / this.data.outcomes.length;
  },
  check: function () {
    const p = this.computeProbability();
    if (Math.abs(p - 0.5) < 0.001) {
      return {
        correct: true,
        msg: "Richtig. 3 von 6 Ergebnissen sind günstig → 3/6 = 0.5."
      };
    }
    return {
      correct: false,
      msg: "Noch nicht. Eine gerade Zahl bedeutet 2, 4 oder 6."
    };
  },
  hint: "Zähle günstige Ergebnisse, nicht Wahrscheinlichkeiten."
};

// Export
if (typeof module !== "undefined") module.exports = level;
if (typeof window !== "undefined") window.level02 = level;

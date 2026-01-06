const level = {
  id: 1,
  title: "Der faire Münzwurf",
  task: "Eine faire Münze hat zwei gleich wahrscheinliche Seiten: Kopf und Zahl. Wir definieren Kopf als Erfolg. Wie gross ist die Wahrscheinlichkeit p für einen Erfolg? Gib p als Dezimalzahl an.",
  hint: "Beide Seiten sind gleich wahrscheinlich.",
  check: function (input) {
    const p = parseFloat(input);
    if (Math.abs(p - 0.5) < 0.001) {
      return {
        correct: true,
        msg: "Korrekt. Bei einer fairen Münze gilt p = 0.5."
      };
    }
    return {
      correct: false,
      msg: "Nein. Zwei gleich wahrscheinliche Ergebnisse teilen die Wahrscheinlichkeit."
    };
  },
  visuals: null // bewusst keine Visualisierung in Level 1
};

// Export
if (typeof module !== "undefined") module.exports = level;
if (typeof window !== "undefined") window.level01 = level;

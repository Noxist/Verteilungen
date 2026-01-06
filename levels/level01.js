const level = {
    id: 1,
    title: "Der faire Münzwurf",
    task: "Willkommen! Beginnen wir mit dem einfachsten Zufallsexperiment: Einem fairen Münzwurf. Wir betrachten das Ereignis 'Kopf' als Erfolg (1) und 'Zahl' als Misserfolg (0). Dies nennt man ein Bernoulli-Experiment. Wie hoch ist die Wahrscheinlichkeit p für einen Erfolg? Gib die Antwort als Dezimalzahl an.",
    check: function(input) {
        let val = parseFloat(input);
        // Wir akzeptieren 0.5
        if (Math.abs(val - 0.5) < 0.001) {
            return { correct: true, msg: "Richtig! Bei einer fairen Münze ist p = 0.5." };
        }
        return { correct: false, msg: "Nicht ganz. Eine Münze hat 2 Seiten. Eine davon ist Kopf." };
    }
};
// Export für Node.js oder Browser-Global
if (typeof module !== 'undefined') module.exports = level;
if (typeof window !== 'undefined') window.level01 = level;

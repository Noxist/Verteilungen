const level = {
    id: 2,
    title: "Der faire Würfel",
    task: "Ein fairer sechsseitiger Würfel wird geworfen. Die Ergebnismenge ist Ω = {1, 2, 3, 4, 5, 6}. Jede Seite ist gleich wahrscheinlich (Laplace-Experiment). Wie hoch ist die Wahrscheinlichkeit, eine gerade Zahl (2, 4 oder 6) zu würfeln?",
    check: function(input) {
        let val = parseFloat(input);
        // Lösung ist 3/6 = 0.5
        if (Math.abs(val - 0.5) < 0.01) {
            return { correct: true, msg: "Korrekt! Es gibt 3 günstige (2,4,6) und 6 mögliche Ergebnisse. 3/6 = 0.5" };
        }
        return { correct: false, msg: "Überlege: Wie viele gerade Zahlen gibt es auf einem Würfel? Teile diese Anzahl durch die Gesamtzahl der Seiten." };
    }
};
if (typeof module !== 'undefined') module.exports = level;
if (typeof window !== 'undefined') window.level02 = level;

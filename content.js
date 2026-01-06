// content.js: Enthält alle Level-Texte und Formeln in Deutsch.
// Passe die Texte hier an, ohne die App-Logik zu verändern.

window.levels = [
  {
    id: 1,
    module: 'Grundlagen',
    title: 'Zufall & Ereignis',
    concept: 'Gesetz der großen Zahlen: Relative Häufigkeiten stabilisieren sich.',
    interaction: 'Klicke auf „50 Würfe“, um viele Wiederholungen zu simulieren. Beobachte, wie sich die Balken angleichen.',
    formula: '$$\nP(\text{Ereignis}) \approx \frac{\text{günstig}}{\text{möglich}} \quad \text{für großes } n\n$$',
    type: 'lln'
  },
  {
    id: 2,
    module: 'Grundlagen',
    title: 'Bedingte Wahrscheinlichkeit (Baum)',
    concept: 'Pfadregel: Multipliziere entlang eines Pfades, addiere parallele Pfade.',
    interaction: 'Baue einen zweistufigen Baum: Wähle die Wahrscheinlichkeit für A und B|A. Der Rechner multipliziert automatisch.',
    formula: '$$P(A \cap B) = P(A) \cdot P(B\,|\,A)$$',
    type: 'tree'
  },
  {
    id: 3,
    module: 'Zufallsvariablen',
    title: 'Die Zufallsvariable X',
    concept: 'Ordne Ergebnissen Zahlen zu: Jede Ausprägung auf einer Zahlengeraden.',
    interaction: 'Ziehe Ereignis-Badges auf die Zahlengerade: „Sechser würfeln“ → 6, „ungerade“ → 1, usw.',
    formula: '$$X: \Omega \to \mathbb{R}$$',
    type: 'mapping'
  },
  {
    id: 4,
    module: 'Zufallsvariablen',
    title: 'Die Verteilungsfunktion',
    concept: 'Wahrscheinlichkeitsfunktion diskreter X: Summe aller Stützstellen = 1.',
    interaction: 'Gib Wahrscheinlichkeiten (durch Kommas getrennt) ein. Der Balken-Plot normiert automatisch.',
    formula: '$$\nP(X=x_i) = p_i,\quad \sum p_i = 1\n$$',
    type: 'discrete'
  },
  {
    id: 5,
    module: 'Zufallsvariablen',
    title: 'Erwartungswert E(X)',
    concept: 'Schwerpunkt der Verteilung. „Balancepunkt“ des Histogramms.',
    interaction: 'Verschiebe Wahrscheinlichkeiten und sieh, wie die Schwerpunkt-Linie wandert.',
    formula: '$$E(X) = \sum x_i \cdot p_i$$',
    type: 'mean'
  },
  {
    id: 6,
    module: 'Zufallsvariablen',
    title: 'Varianz & Standardabweichung',
    concept: 'Streuung misst Abstand der Werte zum Erwartungswert.',
    interaction: 'Streue die Daten weiter mit dem Slider. Die angezeigte $\sigma$ reagiert sofort.',
    formula: '$$\n\sigma^2 = Var(X) = \sum (x_i - E(X))^2 p_i\n$$',
    type: 'variance'
  },
  {
    id: 7,
    module: 'Binomialverteilung',
    title: 'Das Bernoulli-Experiment',
    concept: 'Zwei Ausgänge: Erfolg oder Misserfolg. Unabhängige Wiederholungen.',
    interaction: 'Starte eine Mini-Galton-Simulation: 200 Kugeln fallen und füllen einen Binomial-Histogramm.',
    formula: '$$P(X=k) = \binom{n}{k} p^k (1-p)^{n-k}$$',
    type: 'galton'
  },
  {
    id: 8,
    module: 'Binomialverteilung',
    title: 'Bernoulli-Formel bauen',
    concept: 'Baue die Formel aus ihren Faktoren: Kombinatorik, Treffer, Nieten.',
    interaction: 'Ziehe Bausteine ($\\binom{n}{k}$, $p^k$, $(1-p)^{n-k}$) in die Slots. Alle Slots = grün → korrekt.',
    formula: '$$P(X=k) = \binom{n}{k} \cdot p^k \cdot (1-p)^{n-k}$$',
    type: 'formula'
  },
  {
    id: 9,
    module: 'Binomialverteilung',
    title: 'B(n, p) explorieren',
    concept: 'Form der Binomialverteilung verändert sich mit n (Breite) und p (Schiefe).',
    interaction: 'Regle n und p. Der Balken-Plot zeigt sofort die neue Form.',
    formula: '$$X \sim B(n, p)$$',
    type: 'binomial'
  },
  {
    id: 10,
    module: 'Binomialverteilung',
    title: 'Kumulierte Wahrscheinlichkeit F(k)',
    concept: 'Summe bis zu einem Schwellenwert: „höchstens k“ leuchtet auf.',
    interaction: 'Wähle k. Alle Balken bis k werden markiert und aufsummiert.',
    formula: '$$F(k) = P(X \le k) = \sum_{i=0}^{k} \binom{n}{i} p^i (1-p)^{n-i}$$',
    type: 'cdf'
  },
  {
    id: 11,
    module: 'Binomialverteilung',
    title: 'Sigma-Regeln',
    concept: '68-95-99,7-Regel für angenäherte Normalverteilungen.',
    interaction: 'Aktiviere 1σ, 2σ, 3σ. Markierte Bereiche zeigen den Anteil.',
    formula: '$$\begin{aligned}P(\mu \pm 1\sigma) &\approx 0{,}68\\\\P(\mu \pm 2\sigma) &\approx 0{,}954\\\\P(\mu \pm 3\sigma) &\approx 0{,}997\end{aligned}$$',
    type: 'sigma'
  },
  {
    id: 12,
    module: 'Binomialverteilung',
    title: 'Mindestens-Mindestens',
    concept: 'Finde die nötige Stichprobengröße, um eine Zielwahrscheinlichkeit zu knacken.',
    interaction: 'Stelle p und Zielwahrscheinlichkeit ein. Der Rechner findet kleinstes n mit P(X ≥ 1) ≥ Ziel.',
    formula: '$$P(X \ge 1) = 1 - (1-p)^n$$',
    type: 'atleast'
  },
  {
    id: 13,
    module: 'Normalverteilung',
    title: 'Von Diskret zu Stetig',
    concept: 'Mit wachsendem n nähert sich B(n,p) einer Normalverteilung.',
    interaction: 'Erhöhe n: Balken werden schmaler, Kurve wird glatter.',
    formula: '$$B(n,p) \approx \mathcal{N}(np, np(1-p))$$',
    type: 'approx'
  },
  {
    id: 14,
    module: 'Normalverteilung',
    title: 'Die Gauss-Glocke',
    concept: 'Parameter verschieben Lage (µ) und Breite (σ).',
    interaction: 'Regle µ und σ. Die Glockenkurve passt sich sofort an.',
    formula: '$$f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}$$',
    type: 'normal'
  },
  {
    id: 15,
    module: 'Normalverteilung',
    title: 'Das große Finale (Quiz)',
    concept: 'Mische alles: wähle die passende Antwort zu zufälligen Aufgaben.',
    interaction: 'Klicke auf „Neue Frage“ und beantworte interaktiv. Sofortiges Feedback.',
    formula: '$$\text{Nutze alle Regeln: Pfade, Erwartungswert, } B(n,p), \mathcal{N}(\mu,\sigma)$$',
    type: 'quiz'
  }
];

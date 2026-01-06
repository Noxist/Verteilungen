export default {
  id: 8,
  title: 'Bernoulli-Formel bauen',
  module: 'Binomialverteilung',
  concept: 'Baue die Formel aus ihren Faktoren: Kombinatorik, Treffer, Nieten.',
  interaction: 'Ziehe Bausteine in die richtige Reihenfolge.',
  formula: String.raw`$$P(X=k) = \binom{n}{k} \cdot p^k \cdot (1-p)^{n-k}$$`,
  setup: (container, helpers) => {
    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex flex-wrap gap-2 justify-center" id="pool"></div>
        <div class="flex gap-2" id="slots"></div>
        <p id="feedback" class="text-center font-bold text-sm"></p>
      </div>
    `;
    const pool = container.querySelector('#pool');
    const slots = container.querySelector('#slots');
    const feedback = container.querySelector('#feedback');
    const parts = [
      { id: 'C', label: '(n über k)' },
      { id: 'P', label: 'p^k' },
      { id: 'Q', label: '(1-p)^{n-k}' }
    ];

    parts.sort(() => Math.random() - 0.5).forEach(p => {
      const el = document.createElement('div');
      el.className = 'drag-item text-xs';
      el.textContent = p.label;
      el.draggable = true;
      el.dataset.id = p.id;
      el.addEventListener('dragstart', e => e.dataTransfer.setData('text', p.id));
      pool.appendChild(el);
    });

    [0, 1, 2].forEach(i => {
      const slot = document.createElement('div');
      slot.className = 'drop-zone flex-1 text-xs';
      slot.textContent = `Faktor ${i+1}`;
      slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('active'); });
      slot.addEventListener('dragleave', () => slot.classList.remove('active'));
      slot.addEventListener('drop', e => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text');
        slot.dataset.id = id;
        slot.textContent = parts.find(p => p.id === id).label;
        slot.classList.remove('active');
        check();
      });
      slots.appendChild(slot);
    });

    const check = () => {
      const result = Array.from(slots.children).map(s => s.dataset.id).join('');
      if (result === 'CPQ') {
        feedback.textContent = 'Richtig! Das ist die Bernoulli-Formel.';
        feedback.className = 'text-emerald-400';
      } else if (result.length === 3) {
        feedback.textContent = 'Reihenfolge stimmt noch nicht.';
        feedback.className = 'text-amber-400';
      }
    };
    helpers.clearChart();
  }
};

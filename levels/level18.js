export default {
  id: 18,
  title: 'Das Galton-Brett',
  module: 'Normalverteilung',
  type: 'line',
  concept: 'Zufällige Pfade (links/rechts) summieren sich. Die Binomialverteilung nähert sich der Gauss-Kurve.',
  interaction: 'Lass Bälle fallen! Sie prallen an Nägeln ab und bilden live eine Glockenkurve.',
  formula: String.raw`$$f(x) \approx \frac{1}{\sqrt{2\pi}\sigma} e^{-\frac{1}{2}(\frac{x-\mu}{\sigma})^2}$$`,
  setup: (container, helpers) => {
    container.innerHTML = `
      <div class="relative w-full h-[320px] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-inner">
        <canvas id="galtonCanvas" class="absolute inset-0 w-full h-full"></canvas>
        <div class="absolute top-2 right-2 flex gap-2">
           <button id="addBall" class="px-3 py-1 bg-slate-700/80 hover:bg-emerald-600 text-xs rounded-lg backdrop-blur text-white transition">Ball +</button>
           <button id="rainBtn" class="px-3 py-1 bg-indigo-600/80 hover:bg-indigo-500 text-xs rounded-lg backdrop-blur text-white transition">Regen</button>
        </div>
      </div>
      <p class="text-xs text-slate-400 mt-2 text-center">Jeder Nagel ist eine Bernoulli-Entscheidung (50/50).</p>
    `;

    const canvas = container.querySelector('#galtonCanvas');
    const ctx = canvas.getContext('2d');
    
    // Resize handling
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize(); // Initial
    
    // Physics Config
    const rows = 12;
    const pegRadius = 3;
    const ballRadius = 4;
    const startX = canvas.width / 2;
    const startY = 30;
    const gapY = (canvas.height - 50) / rows;
    const gapX = canvas.width / (rows + 4); 

    let balls = [];
    let bins = new Array(rows + 1).fill(0);
    let pegs = [];

    // Create Pegs
    for(let r=0; r<rows; r++) {
      for(let c=0; c<=r; c++) {
        pegs.push({
          x: startX + (c - r/2) * gapX,
          y: startY + r * gapY
        });
      }
    }

    class Ball {
      constructor() {
        this.x = startX + (Math.random()-0.5)*2; 
        this.y = 10;
        this.vx = 0;
        this.vy = 0;
        this.row = 0;
        this.active = true;
        this.color = `hsl(${Math.random()*60 + 160}, 90%, 60%)`;
      }
      
      update() {
        if(!this.active) return;
        this.vy += 0.2; // Gravity
        this.y += this.vy;
        this.x += this.vx;

        // Collision logic (simplified for grid)
        const targetY = startY + this.row * gapY;
        if (this.y > targetY - pegRadius && this.row < rows) {
          // Hit peg
          if (Math.abs(this.x - (startX + (Math.round((this.x-startX)/gapX) * gapX))) < 10) { 
             this.vy *= -0.4; // Bounce damp
             this.y = targetY - pegRadius - 2;
             this.vx += (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 1 + 1.5); // Random kick left/right
             this.row++;
          }
        }
        
        // Friction
        this.vx *= 0.95;

        // Bottom
        if (this.y > canvas.height - 10) {
           this.active = false;
           // Calculate bin
           const binIdx = Math.round(((this.x - startX) / gapX) + rows/2);
           if(binIdx >= 0 && binIdx < bins.length) bins[binIdx]++;
           updateChart();
        }
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, ballRadius, 0, Math.PI*2);
        ctx.fill();
      }
    }

    const updateChart = () => {
      // Throttle chart updates slightly
      if(Math.random() > 0.2) return; 
      
      helpers.renderChart({
        type: 'bar',
        labels: bins.map((_,i) => i),
        datasets: [{
          label: 'Verteilung',
          data: bins,
          backgroundColor: '#34d399',
          borderRadius: 4
        }],
        options: { animation: false } // Disable chart animation for performance
      });
    };

    const animate = () => {
      if(!container.isConnected) return; // Stop if level changed
      ctx.clearRect(0,0, canvas.width, canvas.height);
      
      // Draw Pegs
      ctx.fillStyle = '#475569';
      pegs.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, pegRadius, 0, Math.PI*2);
        ctx.fill();
      });

      // Update/Draw Balls
      balls.forEach(b => { b.update(); b.draw(); });
      balls = balls.filter(b => b.y < canvas.height + 10);

      requestAnimationFrame(animate);
    };

    container.querySelector('#addBall').addEventListener('click', () => balls.push(new Ball()));
    container.querySelector('#rainBtn').addEventListener('click', () => {
      let count = 0;
      const int = setInterval(() => {
        balls.push(new Ball());
        count++;
        if(count > 50) clearInterval(int);
      }, 50);
    });

    animate();
  }
};

class Graph {
  constructor(cvs) {
    this.cvs = cvs;
    this.ctx = cvs.getContext('2d');
    this.ctx.translate(cvs.width / 2, cvs.height);
    this.ctx.scale(1, -1);
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);

    const drawBranch = (x, y, len, thick = 30, angle = 90) => {
      if (thick < 10 && Math.random() < 0.3) {
        return;
      }
      if (len < 8) {
        ctx.fillStyle = Math.random() < 0.1 ? 'rgba(255, 44, 00, 0.9)' : 'rgba(56, 240, 27, 0.5)';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
        return;
      }

      ctx.beginPath();
      ctx.moveTo(x, y);

      const x1 = x + len * Math.cos((angle / 180) * Math.PI);
      const y1 = y + len * Math.sin((angle / 180) * Math.PI);

      ctx.lineTo(x1, y1);

      ctx.lineWidth = thick;
      ctx.strokeStyle = 'rgba(255,255,255,1)';
      ctx.lineCap = 'round';
      ctx.stroke();

      requestAnimationFrame(() => {
        drawBranch(x1, y1, len * 0.8, thick * 0.7, angle - (Math.random() * 20 + 11));
      });

      requestAnimationFrame(() => {
        drawBranch(x1, y1, len * 0.8, thick * 0.7, angle + (Math.random() * 20 + 11));
      });
    };

    drawBranch(0, 0, 230);
  }

  animate() {
    const run = () => {
      requestAnimationFrame(run);

      this.draw();
    };
    run();
  }
}

export { Graph };

// import getRandom from '../../utils/getRandom';

import { Point } from './Point';

class Graph {
  cvs: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  points: Point[];
  maxDis: number;
  hasMousePoint: boolean;

  constructor(cvs: HTMLCanvasElement, count = 100, maxDis = 200) {
    this.cvs = cvs;
    this.ctx = cvs.getContext('2d')!;
    this.points = new Array(count).fill(0).map(() => new Point(cvs, 2));
    this.maxDis = maxDis;
    this.hasMousePoint = false;
  }

  draw() {
    const points = this.points;
    const len = points.length;
    const maxDis = this.maxDis;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);

    for (let i = 0; i < len; i++) {
      const p1 = points[i]!;
      const x1 = p1.x;
      const y1 = p1.y;
      p1.draw();

      for (let j = 0; j < len; j++) {
        const p2 = points[j]!;
        const x2 = p2.x;
        const y2 = p2.y;
        const dis = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

        if (dis > maxDis) {
          continue;
        }

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.lineWidth = 0.3;
        ctx.strokeStyle = `rgba(255,255,255,${1 - dis / maxDis})`;
        ctx.stroke();
      }
    }
  }

  animate() {
    const run = () => {
      requestAnimationFrame(run);

      this.points.forEach((p, i) => {
        if (!this.hasMousePoint || i != 0) {
          p.update();
        }
      });

      this.draw();
    };
    run();
  }

  mousePoint() {
    const dpr = window.devicePixelRatio || 1;

    this.cvs.addEventListener('mouseenter', () => {
      this.points.unshift(new Point(this.cvs, 1));
      this.hasMousePoint = true;
    });

    this.cvs.addEventListener('mouseleave', () => {
      this.points.shift();
      this.hasMousePoint = false;
    });

    this.cvs.addEventListener('mousemove', e => {
      this.points[0]!.update(e.clientX * dpr, e.clientY * dpr);
    });
  }
}

export { Graph };

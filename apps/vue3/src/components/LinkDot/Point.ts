import getRandom from '../../utils/getRandom';

class Point {
  cvs: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  r: number;
  x: number;
  y: number;
  moveAngle: number;

  constructor(cvs: HTMLCanvasElement, r = 2) {
    this.cvs = cvs;
    this.ctx = cvs.getContext('2d')!;
    this.r = r;
    this.x = getRandom(this.r, cvs.width - this.r);
    this.y = getRandom(this.r, cvs.height - this.r);

    this.moveAngle = (getRandom(0, 360) / 180) * Math.PI;
  }

  draw() {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }

  update(x?: number, y?: number) {
    if (x != null && y != null) {
      this.x = x;
      this.y = y;
    }

    const speedRate = 2;

    this.x += speedRate * Math.cos(this.moveAngle);
    this.y += speedRate * Math.sin(this.moveAngle);

    if (this.x < 0) {
      this.x = 0;
      this.moveAngle = Math.PI - this.moveAngle;
    }
    if (this.x > this.cvs.width) {
      this.x = this.cvs.width;
      this.moveAngle = Math.PI - this.moveAngle;
    }

    if (this.y < 0) {
      this.y = 0;
      this.moveAngle = -this.moveAngle;
    }
    if (this.y > this.cvs.height) {
      this.y = this.cvs.height;
      this.moveAngle = -this.moveAngle;
    }
  }
}

export { Point };

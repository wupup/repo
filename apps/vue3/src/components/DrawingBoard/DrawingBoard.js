import { throttle } from '@/utils/throttle.js';

import { yi, er, san, si, wu, lu, qi, ba, jiu, ling } from './graphicsArr.js';

const numMap = {
  0: ling,
  1: yi,
  2: er,
  3: san,
  4: si,
  5: wu,
  6: lu,
  7: qi,
  8: ba,
  9: jiu,
};

export class DrawingBoard {
  canvas = null; // canvas元素
  ctx = null; // canvas Context
  gridItemWidth = 12; // 小方格宽度
  gridItemHeight = 12; // 小方格高度
  gapSize = 2; // 方格间隙
  xCount = 15; // 横向方格个数
  yCount = 32; // 纵向方格个数
  canvasHeight = (this.gridItemHeight + this.gapSize) * this.yCount + this.gapSize;
  canvasWidth = (this.gridItemWidth + this.gapSize) * this.xCount + this.gapSize;
  isRubber = false; // 是否是使用橡皮
  rectListMap = new Map(); // 小方格坐标与实例的映射
  fillRectSet = new Set(); // 已绘制的小方格位置

  constructor(canvas) {
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    this.canvas = canvas;

    const ctx = canvas.getContext('2d');
    ctx.translate(-0.5, -0.5);
    this.ctx = ctx;

    this.drawGrid();
    this.initEvent();
  }

  // 绘制网格
  drawGrid() {
    const ctx = this.ctx;

    for (let i = 0; i < this.xCount; i++) {
      for (let j = 0; j < this.yCount; j++) {
        const rect = new Rectangle(
          ctx,
          (i + 1) * this.gapSize + i * this.gridItemWidth,
          (j + 1) * this.gapSize + j * this.gridItemHeight,
          this.gridItemWidth,
          this.gridItemHeight,
        );
        rect.draw();
        this.rectListMap.set(rect.key, rect);
      }
    }
  }

  // 根据坐标数组绘制图形
  drawGraph(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return;
    arr.forEach(item => {
      const [x, y] = item.split(',').map(Number);
      const coordinates = this.positionToCoordinates(x, y);
      const [rectX, rectY] = coordinates.split(',').map(Number);
      this.drawFillRect(rectX, rectY);
    });
  }

  drawTime() {
    this.clearBoard(true);

    const date = new Date();

    // 绘制时
    const h = String(date.getHours()).padStart(2, '0');
    const [h0, h1] = h.split('');
    const [hdx, hdy] = [4, 2];

    this.drawGraph(numMap[h0].map(item => this.translatePosition(item, hdx, hdy)));
    this.drawGraph(numMap[h1].map(item => this.translatePosition(item, hdx + 4, hdy)));

    // 绘制分
    const m = String(date.getMinutes()).padStart(2, '0');
    const [m0, m1] = m.split('');
    const [mdx, mdy] = [4, 9];

    this.drawGraph(numMap[m0].map(item => this.translatePosition(item, mdx, mdy)));
    this.drawGraph(numMap[m1].map(item => this.translatePosition(item, mdx + 4, mdy)));

    // 绘制秒
    const s = String(date.getSeconds()).padStart(2, '0');
    const [s0, s1] = s.split('');
    const [sdx, sdy] = [4, 16];

    this.drawGraph(numMap[s0].map(item => this.translatePosition(item, sdx, sdy)));
    this.drawGraph(numMap[s1].map(item => this.translatePosition(item, sdx + 4, sdy)));

    setTimeout(() => {
      this.drawTime();
    }, 100);
  }

  translatePosition(posi, dx, dy) {
    const [x, y] = posi.split(',').map(Number);
    return [x + dx, y + dy].join(',');
  }

  drawFillRect(x, y) {
    const rect = this.rectListMap.get(`${x},${y}`);
    rect && rect.drawFill();
    this.collectFillRect(x, y);
  }

  clearRect(x, y) {
    const rect = this.rectListMap.get(`${x},${y}`);
    rect && rect.clearFill();
    this.removeFillRect(x, y);
  }

  clearBoard(isGradient = false) {
    this.fillRectSet.clear();
    this.rectListMap.clear();
    if (isGradient) {
      // 上一次绘制的图形在不断绘制的半透明遮罩层之下渐渐消失
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.33)';
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.drawGrid();
  }

  // 收集已绘制的方格的坐标
  collectFillRect(x, y) {
    const temp = `${x},${y}`;
    if (!this.fillRectSet.has(temp)) {
      this.fillRectSet.add(temp);
    }
  }

  removeFillRect(x, y) {
    const temp = `${x},${y}`;
    if (this.fillRectSet.has(temp)) {
      this.fillRectSet.delete(temp);
    }
  }

  getFillList() {
    const result = [];
    for (const [key, rect] of this.rectListMap.entries()) {
      if (!rect.isFill) continue;
      result.push(key.split(',').map(Number));
    }

    return result
      .sort((a, b) => {
        if (a[1] === b[1]) {
          return a[0] - b[0];
        }
        return a[1] - b[1];
      })
      .map(item => this.getPosition(...item).join(','));
  }

  /**
   * 计算触摸点是否在方格内，是的话返回方格坐标
   * @param {Number} x x轴上的第几个方格
   * @param {Number} y
   * @returns [x, y] | null
   */
  getPosition(x, y) {
    if (x < 0 || x > this.canvasWidth || y < 0 || y > this.canvasHeight) {
      return null;
    }

    const offsetX = x % (this.gridItemWidth + this.gapSize), // 距X轴最后一个完整方格的偏移量
      offsetY = y % (this.gridItemHeight + this.gapSize),
      aX = ~~(x / (this.gridItemWidth + this.gapSize)), // X轴完整的方格数
      aY = ~~(y / (this.gridItemHeight + this.gapSize));

    if (
      offsetX >= this.gapSize &&
      offsetX <= this.gapSize + this.gridItemWidth &&
      offsetY >= this.gapSize &&
      offsetY <= this.gapSize + this.gridItemHeight
    ) {
      return [aX, aY];
    }

    return null;
  }

  positionToCoordinates(x, y) {
    return `${this.gapSize + x * (this.gridItemWidth + this.gapSize)},${
      this.gapSize + y * (this.gridItemHeight + this.gapSize)
    }`;
  }

  initEvent() {
    const canvas = this.canvas;
    const cx = canvas.offsetLeft,
      cy = canvas.offsetTop;

    const draw = throttle(e => {
      e.preventDefault();

      const touche = e.changedTouches[0];
      const x = (e.x || touche.clientX || 0) - cx,
        y = (e.y || touche.clientY || 0) - cy;

      const itemRect = this.getPosition(x, y);
      if (!itemRect) return;

      const [coordinateX, coordinateY] = this.positionToCoordinates(...itemRect)
        .split(',')
        .map(Number);

      if (this.isRubber) {
        this.clearRect(coordinateX, coordinateY);
      } else {
        this.drawFillRect(coordinateX, coordinateY);
      }
    }, 0);

    canvas.addEventListener('touchmove', draw);
  }
}

class Rectangle {
  lineWidth = 1;
  boderColor = '#ccc';
  fillColor = '#409eff';
  isFill = false; // 是否填充

  constructor(ctx, x, y, width = 12, height = 12) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.key = `${x},${y}`;
    this.width = width;
    this.height = height;
  }

  draw() {
    const ctx = this.ctx;
    ctx.strokeStyle = this.boderColor;
    ctx.lineWidth = this.lineWidth;

    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  drawFill() {
    if (this.isFill) return;
    this.ctx.fillStyle = this.fillColor;
    this.ctx.fillRect(
      this.x + this.lineWidth,
      this.y + this.lineWidth,
      this.width - this.lineWidth * 2,
      this.height - this.lineWidth * 2,
    );
    this.isFill = true;
  }

  clear() {
    this.ctx.clearRect(this.x, this.y, this.width, this.height);
    this.isFill = false;
  }

  clearFill() {
    this.isFill = false;
    this.clear();
    this.draw();
  }

  isWithin(x, y) {
    return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
  }
}

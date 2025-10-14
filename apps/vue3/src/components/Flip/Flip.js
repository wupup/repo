const Flip = (function () {
  let index = 1;

  class FlipDom {
    constructor(dom, duration = 0.5) {
      this.index = index++;
      this.dom = dom;
      this.isPlaying = false;

      this.transition = typeof duration === 'number' ? `transform ${duration}s` : duration;

      this.firstPosition = {
        x: null,
        y: null,
      };

      this.transitionEndHandler = () => {
        console.log('transitionEndHandler =>> ', this.index);
        this.isPlaying = false;
        this.recordFirst();
      };
    }

    getDomPosition() {
      const rect = this.dom.getBoundingClientRect();
      return {
        x: rect.left,
        y: rect.top,
      };
    }

    recordFirst(firstPosition) {
      if (!firstPosition) {
        firstPosition = this.getDomPosition();
      }
      this.firstPosition.x = firstPosition.x;
      this.firstPosition.y = firstPosition.y;
    }

    *play() {
      if (!this.isPlaying) {
        this.dom.style.transition = 'none';
        const lastPosition = this.getDomPosition();
        const deltaX = this.firstPosition.x - lastPosition.x;
        const deltaY = this.firstPosition.y - lastPosition.y;

        if (!deltaX && !deltaY) {
          return;
        }

        this.dom.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

        yield 'moveToFirstPosition';

        this.isPlaying = true;
      }

      this.dom.style.transition = this.transition;
      this.dom.style.transform = 'none';

      clearTimeout(this.timer);
      this.timer = setTimeout(
        () => {
          this.isPlaying = false;
        },
        this.transition * 1000 + 100,
      );

      // this.dom.removeEventListener("transitionend", this.transitionEndHandler);
      // this.dom.addEventListener("transitionend", this.transitionEndHandler, {
      //   once: true
      // });
    }
  }

  class Flip {
    constructor(doms, duration = 0.5) {
      this.doms = doms;
      this.duration = duration;
      this.flipDomsMap = new Map();

      this.recordFirst(doms);
    }

    recordFirst(doms) {
      doms.forEach(dom => {
        if (!this.flipDomsMap.has(dom)) {
          this.flipDomsMap.set(dom, new FlipDom(dom, this.duration));
        }
        const flipDom = this.flipDomsMap.get(dom);
        flipDom.recordFirst();
      });
    }

    addDom(dom, firstPosition) {
      if (!this.flipDomsMap.has(dom)) {
        this.flipDomsMap.set(dom, new FlipDom(dom, this.duration));
      }
      this.flipDomsMap.get(dom).recordFirst(firstPosition);
    }

    play(doms) {
      if (!doms) {
        doms = this.doms;
      } else if (!Array.isArray(doms)) {
        doms = [doms];
      }

      const playGenerators = [];
      doms.forEach(dom => {
        if (this.flipDomsMap.has(dom)) {
          const flipDom = this.flipDomsMap.get(dom);
          const ret = flipDom.play();
          if (ret) {
            playGenerators.push(ret);
          }
        }
      });

      if (playGenerators.length === 0) {
        return;
      }

      let allDone = false;
      while (!allDone) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        document.body.offsetHeight; // Trigger reflow
        allDone = true;
        for (let i = 0; i < playGenerators.length; i++) {
          const result = playGenerators[i].next();
          if (!result.done) {
            allDone = false;
          }
        }
      }
    }
  }

  return Flip;
})();

export default Flip;

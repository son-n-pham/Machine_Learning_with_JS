class SketchPad {
  /**
   * Constructor for creating a canvas of a specified size and adding it to the provided container.
   *
   * @param {Object} container - The HTML element to which the canvas will be added
   * @param {number} [size=400] - The size of the canvas (default is 400)
   */
  constructor(container, size = 400) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = size;
    this.canvas.height = size;
    this.canvas.style = `
      background-color: #fff;
      box-shadow: 0 0 10px 2px #000;
    `;
    container.appendChild(this.canvas);

    const lineBreak = document.createElement('br');
    container.appendChild(lineBreak);

    this.undoBtn = document.createElement('button');
    this.undoBtn.innerHTML = 'UNDO';
    container.appendChild(this.undoBtn);

    this.ctx = this.canvas.getContext('2d');

    this.reset();

    this.#addEventListener();
  }

  reset() {
    this.paths = [];
    this.isDrawing = false;
    this.#reDraw();
  }
  #addEventListener() {
    this.canvas.onmousedown = e => {
      const mouse = this.#getMouse(e);
      this.paths.push([mouse]);
      this.isDrawing = true;
    };

    this.canvas.onmousemove = e => {
      if (this.isDrawing) {
        const mouse = this.#getMouse(e);
        const lastPath = this.paths[this.paths.length - 1];
        lastPath.push(mouse);
        this.#reDraw();
      }
    };

    this.canvas.onmouseup = e => {
      this.isDrawing = false;
    };

    this.canvas.ontouchstart = e => {
      const loc = e.touches[0];
      this.canvas.onmousedown(loc);
    };
    this.canvas.ontouchmove = e => {
      const loc = e.touches[0];
      this.canvas.onmousemove(loc);
    };
    this.canvas.ontouchend = e => {
      this.canvas.onmouseup();
    };

    this.undoBtn.onclick = () => {
      this.paths.pop();
      this.#reDraw();
    };
  }

  #reDraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    draw.paths(this.ctx, this.paths);

    if (this.paths.length > 0) {
      this.undoBtn.disabled = false;
    } else {
      this.undoBtn.disabled = true;
    }
  }
  #getMouse = e => {
    const rect = this.canvas.getBoundingClientRect();
    const mouse = [
      Math.round(e.clientX - rect.left),
      Math.round(e.clientY - rect.top),
    ];
    return mouse;
  };
}

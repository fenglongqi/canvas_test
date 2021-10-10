class Painting {
  constructor(id, width, height) {
    this.basePoint = { x: 0, y: 0 };
    this.ctx = null;
    this.canvas = null;
    this.isMouseDown = false;

    this.initCanvas(id, width, height);
  }

  initCanvas(id, width, height) {
    this.canvas = document.getElementById(id);
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.resetCanvas();
  }

  resetCanvas() {
    const ctx = this.ctx;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    ctx.strokeStyle = "#fff";
  }

  getBasePoint() {
    return {
      x: this.basePoint.x,
      y: this.basePoint.y,
    };
  }

  setBasePoint(x, y) {
    this.basePoint.x = x;
    this.basePoint.y = y;
  }

  getIsMouseDown() {
    return this.isMouseDown;
  }

  setMouseDownTure() {
    this.isMouseDown = true;
  }

  setMouseDownFalse() {
    this.isMouseDown = false;
  }

  addCanvasListener() {
    const _this = this;

    if (_this.canvas.ontouchstart === void 0) {
      _this.canvas.addEventListener("mousedown", function (event) {
        _this.setBasePoint(event.layerX, event.layerY);
        _this.setMouseDownTure();

        _this.mouseDownHandle &&
          _this.mouseDownHandle(event.layerX, event.layerY);
      });

      _this.canvas.addEventListener("mouseup", function () {
        _this.setMouseDownFalse();
      });

      _this.canvas.addEventListener("mouseleave", function () {
        _this.setMouseDownFalse();
      });

      _this.canvas.addEventListener("mousemove", function (event) {
        if (_this.isMouseDown) {
          _this.printLine(event.layerX, event.layerY);

          _this.mouseMoveHandle &&
            _this.mouseMoveHandle(event.layerX, event.layerY);
        }
      });
    } else {
      _this.canvas.addEventListener("touchstart", function (event) {
        _this.setBasePoint(event.layerX, event.layerY);
        _this.setMouseDownTure();

        _this.mouseDownHandle &&
          _this.mouseDownHandle(event.layerX, event.layerY);
      });

      _this.canvas.addEventListener("touchlend", function () {
        _this.setMouseDownFalse();
      });

      _this.canvas.addEventListener("touchmove", function (event) {
        if (_this.isMouseDown) {
          _this.printLine(event.layerX, event.layerY);

          _this.mouseMoveHandle &&
            _this.mouseMoveHandle(event.layerX, event.layerY);
        }
      });
    }
  }

  printLine(x, y) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(x, y);

    ctx.lineTo(this.basePoint.x, this.basePoint.y);
    this.setBasePoint(x, y);

    ctx.stroke();
    ctx.closePath();
  }
}

class Painting {
  constructor(id, width, height) {
    this.basePoint = { x: 0, y: 0 };
    this.ctx = null;
    this.canvas = null;
    this.isMouseDown = false;
    this.historyStack = []
    this.nowStack = {
      points: [],
      strokeStyle: '#fff'
    }

    this.initCanvas(id, width, height);
  }

  initCanvas(id, width, height) {
    this.canvas = document.getElementById(id);
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.resetCanvas();
    this.ctx.strokeStyle = "#fff"
  }

  resetCanvas() {
    const ctx = this.ctx;
    ctx.lineJoin = ctx.lineCap = 'round'
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
  }

  clearCanvas() {
    this.resetCanvas()
    this.setHistoryStack([])
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
    this.historyStack.push(this.nowStack)
    this.nowStack = { points: [], strokeStyle: this.ctx.strokeStyle}
  }

  addPointToStack(x, y) {
    this.nowStack.points.push({x, y})
  }

  goBackStack() {
    if ( this.historyStack.length > 0) {
      this.gobackRander()
    }
  }

  gobackRander () {
    this.resetCanvas()
    const ctx = this.ctx
    ctx.save()
    this.historyStack.forEach(line => {
      ctx.strokeStyle = line.strokeStyle
      line.points.forEach(({x, y}, index) => {
        if (index > 0) {
          this.setBasePoint(line.points[index-1].x, line.points[index-1].y);
          this.printLine(x, y)
        }
      })
    })
    ctx.restore()
  }

  setHistoryStack(historyStack) {
    this.historyStack = historyStack
  }

  

  addCanvasListener() {
    const _this = this;

    if (_this.canvas.ontouchstart === void 0) {
      _this.canvas.addEventListener("mousedown", function (event) {
        _this.setBasePoint(event.layerX, event.layerY);
        _this.addPointToStack(event.layerX, event.layerY)
        _this.setMouseDownTure();

        _this.mouseDownHandle &&
          _this.mouseDownHandle(event.layerX, event.layerY);
      });

      _this.canvas.addEventListener("mouseup", function () {
        _this.setMouseDownFalse();
      });

      _this.canvas.addEventListener("mousemove", function (event) {
        if (_this.isMouseDown) {
          _this.printLine(event.layerX, event.layerY);
          _this.addPointToStack(event.layerX, event.layerY)
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
    ctx.moveTo(this.basePoint.x, this.basePoint.y);
    ctx.lineTo(x, y)
    this.setBasePoint(x, y);

    ctx.stroke();
    ctx.closePath();
  }

  setLineColor (color) {
    this.ctx.strokeStyle = color ||  "#fff";
    this.nowStack.strokeStyle = color || "#fff";
  }
}

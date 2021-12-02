document.body.addEventListener(
  "touchmove",
  function (e) {
    e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
  },
  { passive: false }
);

// socket链接
var socket = io('/draw');

socket.on("connect", () => {
  sendWorkbachWidth();
});

socket.on('go back one step', (lines) => {
  painting.setHistoryStack(lines)
  painting.gobackRander(lines)
})

socket.on("set base point info", function (point) {
  painting.setBasePoint(point.x, point.y);
});

socket.on("set point info", function (point, lineStyle, screenSize) {
  painting.printLine({x: point.x, y: point.y, lineStyle, screenSize});
});

socket.on("reset screen", function () {
  painting.clearCanvas();
});

class Workbench extends Painting {
  constructor(id, width, height) {
    super(id, width, height);
    this.addCanvasListener();
  }

  mouseDownHandle(x, y, lineStyle) {
    const screenSize = {
      width:  window.innerWidth,
      height: window.innerHeight
    }
    socket.emit("get base point info", { x, y }, lineStyle, screenSize);
    sendWorkbachWidth();
  }

  mouseMoveHandle(x, y) {
    socket.emit("get point info", { x, y });
  }

  goBackStack() {
    socket.emit('go back one step')
  }

  setLineColor(color) {
    this.ctx.strokeStyle = color ||  "#fff";
    this.lineStyle.strokeStyle = color || "#fff";
  }
}

const painting = new Workbench("canvas", window.innerWidth, window.innerHeight);

function bindAction() {
  const clearBtn = document.getElementById("clear");

  clearBtn.addEventListener("click", function () {
    painting.clearCanvas();

    socket.emit("reset canvas");
  });

  clearBtn.addEventListener("touchstart", function () {
    painting.clearCanvas();

    socket.emit("reset canvas");
  });


  // 回退按钮
  const goBackBtn = document.getElementById('goback');

  goBackBtn.addEventListener("click", function () {
    painting.goBackStack()

  })

  goBackBtn.addEventListener("touchstart", function () {
    painting.goBackStack()

  })

  const lineColorControl = document.getElementById('line-color')

  lineColorControl.addEventListener('change', function (e) {
    console.log(e.target.value)
    painting.setLineColor(e.target.value)
  })
}

function sendWorkbachWidth() {
  socket.emit("set workbench width", window.innerWidth, window.innerHeight);
}

bindAction();
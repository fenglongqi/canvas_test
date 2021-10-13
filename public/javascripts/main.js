document.body.addEventListener(
  "touchmove",
  function (e) {
    e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
  },
  { passive: false }
);

// socket链接
var socket = io();

socket.on("connect", () => {
  sendWorkbachWidth();
});

class Workbench extends Painting {
  constructor(id, width, height) {
    super(id, width, height);
    this.addCanvasListener();
  }

  mouseDownHandle(x, y) {
    socket.emit("get base point info", { x, y });
    sendWorkbachWidth();
  }

  mouseMoveHandle(x, y) {
    socket.emit("get point info", { x, y });
  }

  goBackStack() {
    if ( this.historyStack.length > 0) {
      this.historyStack.pop()
      this.gobackRander()
      socket.emit('go back one step', this.historyStack)
    }
  }

  setLineColor(color) {
    this.ctx.strokeStyle = color ||  "#fff";
    this.nowStack.strokeStyle = color || "#fff";
    socket.emit('set strok style', color)
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
    painting.setLineColor(e.target.value)
  })
}

function sendWorkbachWidth() {
  socket.emit("set workbench width", window.innerWidth, window.innerHeight);
}

bindAction();
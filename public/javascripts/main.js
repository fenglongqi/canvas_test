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
}

const painting = new Workbench("canvas", window.innerWidth, window.innerHeight);

function bindAction() {
  const clearBtn = document.getElementById("clear");

  clearBtn.addEventListener("click", function () {
    painting.resetCanvas();

    socket.emit("reset canvas");
  });

  clearBtn.addEventListener("touchstart", function () {
    painting.resetCanvas();

    socket.emit("reset canvas");
  });
}

function sendWorkbachWidth() {
  socket.emit("set workbench width", window.innerWidth, window.innerHeight);
}

bindAction();

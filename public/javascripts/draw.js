const painting = new Painting("canvas", window.innerWidth, window.innerHeight);
let workbenchWidth = window.innerWidth;
let workbenchHeight = window.workbenchHeight;
const width = window.innerWidth;
const height = window.innerHeight;

function getRadio() {
  const radio_w = width / workbenchWidth;
  const radio_h = height / workbenchHeight;
  const radio = Math.min(radio_w, radio_h);

  return radio;
}

// socket链接
var socket = io('/screen');

socket.on("connect", () => {

  socket.emit("init worckbench width");
});

socket.on("set base point info", function (point) {
  painting.setBasePoint(point.x, point.y);
});

socket.on("set point info", function (point, lineStyle, screenSize) {
  painting.printLine({x: point.x, y: point.y, lineStyle, screenSize});
});

socket.on("reset screen", function () {
  painting.clearCanvas();
});

socket.on("get workbench width", function (width, height) {
  workbenchWidth = width;
  workbenchHeight = height;
});

socket.on('go back one step', function (stack) {
  painting.setHistoryStack(stack)
  painting.gobackRander()
})


socket.on('set strok style', function (color) {
  painting.ctx.strokeStyle = color
})

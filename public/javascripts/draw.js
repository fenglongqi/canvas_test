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
var socket = io();

socket.on("connect", () => {
  socket.emit("set socket id", {
    type: "screen",
    id: socket.id,
  });

  socket.emit("init worckbench width");
});

socket.on("set base point info", function (point) {
  const radio = getRadio();
  painting.setBasePoint(point.x * radio, point.y * radio);
});

socket.on("set point info", function (point) {
  const radio = getRadio();
  painting.printLine(point.x * radio, point.y * radio);
});

socket.on("reset screen", function () {
  painting.resetCanvas();
});

socket.on("get workbench width", function (width, height) {
  console.log(width);
  workbenchWidth = width;
  workbenchHeight = height;
});

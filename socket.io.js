const { NotImplemented } = require("http-errors");
const { Server } = require("socket.io");
var socketio = {
  workbenchWidth: 0,
  workbenchHeight: 0,
};

socketio.getSoketIo = function (server) {
  let io = new Server(server);

  const nps = io.of('/draw') // 创建展示页面对应的命名空间
  nps.on('connection', function (socket) {
    console.log("draw 连接成功");

    socket.on("init worckbench width", function () {
      // 获取功能内容
      nps.emit(
        "get workbench width",
        socketio.workbenchWidth,
        socketio.workbenchHeight
      );
    });
  })

  io.on("connection", function (socket) {
    console.log("连接成功");
    socket.on("set workbench width", function (width, height) {
      socketio.workbenchWidth = width;
      socketio.workbenchHeight = height;
      nps.emit(
        "get workbench width",
        width,
        height
      );
    });

    // 获取鼠标滑动的坐标点信息
    socket.on("get point info", function (point) {
      nps.emit("set point info", point);
    });

    // 获取起始点坐标
    socket.on("get base point info", function (point) {
      nps.emit("set base point info", point);
    });

    socket.on("reset canvas", function () {
      nps.emit("reset screen");
    });

    socket.on("go back one step", function (stack) {
      nps.emit('go back one step', stack)
    })

    socket.on("set strok style", function(color) {
      nps.emit('set strok style', color)
    })
  });
};

module.exports = socketio;

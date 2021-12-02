const { NotImplemented } = require("http-errors");
const { Server, Socket } = require("socket.io");
const SocketData = require('./public/javascripts/socket/data')
var socketio = {
  workbenchWidth: 0,
  workbenchHeight: 0,
};

socketio.getSoketIo = function (server) {
  let io = new Server(server);
  const socketData = new SocketData()

  const screenNps = io.of('/screen') // 创建展示页面对应的命名空间
  screenNps.on('connection', function (socket) {
    console.log("screen 连接成功");

    socket.on("init worckbench width", function () {
      // 获取功能内容
      screenNps.emit(
        "get workbench width",
        socketio.workbenchWidth,
        socketio.workbenchHeight
      );
    });
  })

  const drawNps = io.of('/draw')

  drawNps.on("connection", function (socket) {
    console.log("draw 连接成功");
    socket.on("set workbench width", function (width, height) {
      socketio.workbenchWidth = width;
      socketio.workbenchHeight = height;
      screenNps.emit(
        "get workbench width",
        width,
        height
      );
    });

    // 获取鼠标滑动的坐标点信息
    socket.on("get point info", function (point) {
      const {lineStyle, screenSize} = socketData.addPoint(socket.id, point)
      screenNps.emit("set point info", point, lineStyle, screenSize);
      drawNps.emit("set point info", point, lineStyle, screenSize);
    });

    // 获取起始点坐标
    socket.on("get base point info", function (point, lineStyle, screenSize) {
      socketData.addLine(socket.id, lineStyle, screenSize)
      socketData.addPoint(socket.id, point)
      screenNps.emit("set base point info", point);
      drawNps.emit("set base point info", point);
    });

    socket.on("reset canvas", function () {
      socketData.clearLines()
      screenNps.emit("reset screen");
      drawNps.emit("reset screen")
    });

    socket.on("go back one step", function () {
      const lines = socketData.removeLine()
      drawNps.emit('go back one step', lines)
      screenNps.emit('go back one step', lines)
    })

    socket.on("set strok style", function(color) {
      screenNps.emit('set strok style', color)
    })
  });
};

module.exports = socketio;

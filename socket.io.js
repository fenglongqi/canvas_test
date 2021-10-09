const { Server } = require("socket.io");
var socketio = {
    idMap: new Map()
}


socketio.getSoketIo = function (server) {
    let io = new Server(server)
    io.on('connection', function (socket) {
        console.log('连接成功')

        // 获取鼠标滑动的坐标点信息
        socket.on('get point info', function (point) {
            io.to(socketio.idMap.get('screen')).emit('set point info', point)
        })


        // 获取起始点坐标
        socket.on('get base point info', function (point) {
            io.to(socketio.idMap.get('screen')).emit('set base point info', point)
        })

        // 获取客户端id 区分绘画端和呈现端
        socket.on('set socket id', function (data) {
            const { type, id } = data
            // screen || workbench
            socketio.idMap.set(type, id)
        })

        socket.on('reset canvas', function() {
            io.to(socketio.idMap.get('screen')).emit('reset screen')
        })
    })
}

module.exports = socketio

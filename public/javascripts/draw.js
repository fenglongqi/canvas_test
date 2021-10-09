const painting = new Painting('canvas')


// socket链接
var socket = io();

socket.on("connect", () => {
    socket.emit('set socket id', {
        type: 'screen',
        id: socket.id
    })
})

socket.on('set base point info', function (point) {
    painting.setBasePoint(point.x, point.y)
})

socket.on('set point info', function (point) {
    painting.printLine(point.x, point.y)
})

socket.on('reset screen', function (point) {
    painting.resetCanvas()
})
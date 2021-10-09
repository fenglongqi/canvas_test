




// socket链接
var socket = io();

socket.on("connect", () => {
    socket.emit('set socket id', {
        type: 'workbench',
        id: socket.id
    })
})


class Workbench extends Painting {
    constructor(id) {
        super(id)
        this.addCanvasListener()
    }

    mouseDownHandle(x, y) {
        socket.emit('get base point info', {x, y}) 
    }

    mouseMoveHandle(x, y) {
        socket.emit('get point info', {x, y})
    }
}



const painting = new Workbench('canvas')


function bindAction () {
    const clearBtn = document.getElementById('clear')

    clearBtn.addEventListener('click', function () {
        painting.resetCanvas()
        socket.emit('reset canvas')
    })
}


bindAction()
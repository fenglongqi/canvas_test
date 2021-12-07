/**
 * 数据处理
 */

const LINE_TYPE = 'line'
const RESET_MARK_TYPE = 'resetMark'

class Line {
    constructor(drawId, lineStyle = {}, screenSize = {
        width: 300,
        height: 300
    }) {
        this.id = '' + Date.now() +  parseInt(Math.random() * 1000)
        this.drawId = drawId
        this.points = []
        this.lineStyle = lineStyle
        this.screenSize = screenSize
        this.type = LINE_TYPE
    }

    addPoint(point) {
        this.points.push(point)
    }
}

class Point {
    constructor({x, y}) {
        this.x = x
        this.y = y
    }
}

class ResetMark {
    constructor() {
        this.type = RESET_MARK_TYPE
    }
}

class HistoryStack {
    constructor() {
        this.stack = []
    }

    push(item) {
        this.stack.push(item)
    }

    pop() {
        return this.stack.pop()
    }

    goback() {
        this.pop()

        return this.getCurrentLines()
    }
    getCurrentLines() {
        const resetMarkIndex = this.stack.map(item => item.type).lastIndexOf(RESET_MARK_TYPE)

        return this.stack.filter((item, index) => resetMarkIndex < index)
    }
}

module.exports = class SocketData {
    constructor() {
        this.lines = []
        this.activeLines = new Map()
        this.history = new HistoryStack() // 历史记录
    }

    addLine(drawId, lineStyle, screenSize) {
        if (drawId) {
            const line = new Line(drawId, lineStyle, screenSize)
            this.activeLines.set(drawId, line)
            this.lines.push(line)
            this.history.push(line)
        } else {
            throw Error('drawId 不能为空')
        }
    }

    addPoint(drawId, point) {
        const activeLine = this.activeLines.get(drawId)
        if (activeLine) {
            activeLine.addPoint(new Point(point))
            return activeLine 
        }
    }

    goback() {
        return this.history.goback()
    }

    clearLines() {
        this.lines = []
    }
    resetCanvas () {
        this.history.push(new ResetMark())
    }
}


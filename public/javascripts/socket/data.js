/**
 * 数据处理
 */

// 1.要对点的信息根据id进行存储到各个点当中
// 2.

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
    }

    addPoint(point) {
        this.points.push(point)
    }
}

class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

module.exports = class SocketData {
    constructor() {
        this.lines = []
        this.activeLines = new Map()
        this.history = [] // 历史记录
    }

    addLine(drawId, lineStyle, screenSize) {
        if (drawId) {
            const line = new Line(drawId, lineStyle, screenSize)
            this.activeLines.set(drawId, line)
            this.lines.push(line)
        } else {
            throw Error('drawId 不能为空')
        }
    }

    addPoint(drawId, point) {
        const activeLine = this.activeLines.get(drawId)
        if (activeLine) {
            activeLine.addPoint(point)
            return activeLine 
        }
    }

    removeLine(drawId) {
        // const activeLine = this.activeLines.get(drawId)
        if (drawId) {
            const index = this.lines.map((item) => item.drawId).lastIndexOf(drawId)

            if (index > -1) {
                this.lines.splice(index, 1)
            }
    
            this.activeLines.set(drawId, null)
        } else {
            if (this.lines.length > 0) {
                this.lines.pop()
            }
        }
        return this.lines
    }

    clearLines() {
        this.lines = []
    }
}


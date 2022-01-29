const bench = require('nanobench')

class Either {
    #value

    constructor(value) {
        this.#value = value
    }

    isLeft() {
        return false
    }

    isRight() {
        return false
    }

    getValue() {
        return this.#value
    }
}

class Left extends Either {
    constructor(value) {
        super(value)
    }

    isLeft() {
        return true
    }
}

class Right extends Either {
    constructor(value) {
        super(value)
    }

    isRight() {
        return true
    }
}


const retLeft = () => {
    return new Left("Gotcha")
}

const retRight = () => {
    return new Left("Gotcha")
}

module.exports = () => {
    bench('Testing Success Right',  (b) => {
        for (var i = 0; i < 200000; i++) {
            if (retRight().isRight()){
                // Do Nothing
            }
        }

        b.end()
    })

    bench('Testing Fail Right',  (b) => {
        for (var i = 0; i < 200000; i++) {
            if (retLeft().isRight()){
                // Do Nothing
            }
        }

        b.end()
    })

    bench('Testing Success Left',  (b) => {
        for (var i = 0; i < 200000; i++) {
            if (retLeft().isLeft()){
                // Do Nothing
            }
        }

        b.end()
    })

    bench('Testing Fail Left',  (b) => {
        for (var i = 0; i < 200000; i++) {
            if (retRight().isLeft()){
                // Do Nothing
            }
        }

        b.end()
    })
}
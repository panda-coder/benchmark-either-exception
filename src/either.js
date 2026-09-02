
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


const retLeft = (val = "Error occurred") => {
    return new Left(val)
}

const retRight = (val = "Operation successful") => {
    return new Right(val)
}

module.exports = {
    Either,
    Left,
    Right,
    retLeft,
    retRight
}
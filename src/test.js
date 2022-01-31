const assert = require('assert')

const {
    Left,
    Right
} = require('./either')

const retLeft = (value) => {
    return new Left(value)
}

const retRight = (value) => {
    return new Right(value)
}

const doTestLeft = () => {
    const testLeft = retLeft("1")

    assert.equal(testLeft.isLeft(), true)
    assert.equal(testLeft.isRight(), false)
}

const doTestRight = () => {
    const testRight = retRight("1")

    assert.equal(testRight.isLeft(), false)
    assert.equal(testRight.isRight(), true)
}

doTestLeft()
doTestRight()







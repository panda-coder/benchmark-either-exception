const assert = require('assert')

const {
    retLeft,
    retRight
} = require('./either')

describe('Either class basic tests', () => {
    it('should correctly identify Left', () => {
        const testLeft = retLeft("1")
        assert.strictEqual(testLeft.isLeft(), true)
        assert.strictEqual(testLeft.isRight(), false)
    })

    it('should correctly identify Right', () => {
        const testRight = retRight("1")
        assert.strictEqual(testRight.isLeft(), false)
        assert.strictEqual(testRight.isRight(), true)
    })
})

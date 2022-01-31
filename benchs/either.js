const bench = require('nanobench')

const {
    retLeft,
    retRight
} = require('../src/either')

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
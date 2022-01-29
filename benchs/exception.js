const bench = require('nanobench')

class AnyError extends Error {

}

module.exports = () => {
    bench('Simple Throw exception',  (b) => {
        for (var i = 0; i < 200000; i++) {
            try{
                throw "Error"
            } catch(e) {
                // Do nothing
            }
        }

        b.end()
    })

    bench('Obj Throw exception',  (b) => {
        for (var i = 0; i < 200000; i++) {
            try{
                throw {msg: "Error"}
            } catch(e) {
                // Do nothing
            }
        }

        b.end()
    })

    bench('Error Throw exception',  (b) => {
        for (var i = 0; i < 200000; i++) {
            try{
                throw Error("Error")
            } catch(e) {
                // Do nothing
            }
        }

        b.end()
    })

    bench('Any Throw exception',  (b) => {
        for (var i = 0; i < 200000; i++) {
            try{
                throw AnyError("Error")
            } catch(e) {
                // Do nothing
            }
        }

        b.end()
    })
    
}
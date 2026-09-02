const { retLeft, retRight } = require('../src/either')

class CustomAppError extends Error {
    constructor(message) {
        super(message)
        this.name = "CustomAppError"
    }
}

function runGC() {
    if (global.gc) {
        global.gc()
    }
}

function measureMemory(name, fn, iterations = 200000) {
    runGC()
    const memBefore = process.memoryUsage()
    const startHeap = memBefore.heapUsed

    const startTime = process.hrtime.bigint()

    for (let i = 0; i < iterations; i++) {
        fn()
    }

    const endTime = process.hrtime.bigint()
    const memAfter = process.memoryUsage()
    const endHeap = memAfter.heapUsed

    const durationMs = Number(endTime - startTime) / 1e6
    const heapDiffBytes = endHeap - startHeap
    const bytesPerOp = heapDiffBytes > 0 ? (heapDiffBytes / iterations).toFixed(2) : 0

    console.log(`\n--- ${name} ---`)
    console.log(`Iterations       : ${iterations.toLocaleString()}`)
    console.log(`Execution Time   : ${durationMs.toFixed(2)} ms`)
    console.log(`Heap Before      : ${(startHeap / 1024 / 1024).toFixed(2)} MB`)
    console.log(`Heap After       : ${(endHeap / 1024 / 1024).toFixed(2)} MB`)
    console.log(`Heap Delta       : ${(heapDiffBytes / 1024).toFixed(2)} KB`)
    console.log(`Allocated/Op     : ${bytesPerOp} bytes/op`)
    console.log(`RSS Process      : ${(memAfter.rss / 1024 / 1024).toFixed(2)} MB`)
}

console.log("=== Node.js Memory Allocation Benchmark ===")

measureMemory("Either Flow - Success (Right)", () => {
    const res = retRight("Success data")
    if (res.isRight()) {
        const val = res.getValue()
    }
})

measureMemory("Either Flow - Error (Left)", () => {
    const res = retLeft("Error message")
    if (res.isLeft()) {
        const val = res.getValue()
    }
})

measureMemory("Exception Flow - Success (No Throw)", () => {
    try {
        const val = "Success data"
    } catch (e) {
        // Do nothing
    }
})

measureMemory("Exception Flow - Error (Throw & Catch)", () => {
    try {
        throw new CustomAppError("Error message")
    } catch (e) {
        const val = e.message
    }
})

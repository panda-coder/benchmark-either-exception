const express = require('express')
const { retLeft, retRight } = require('./either')

const app = express()
app.use(express.json())

class CustomAppError extends Error {
    constructor(message) {
        super(message)
        this.name = "CustomAppError"
    }
}

// Memory profiling middleware tracking request memory
app.use((req, res, next) => {
    req.memBefore = process.memoryUsage().heapUsed
    next()
})

// Service logic simulation
function processEitherSuccess() {
    return retRight("Either success data")
}

function processEitherError() {
    return retLeft("Either error message")
}

function processExceptionSuccess() {
    return "Exception success data"
}

function processExceptionError() {
    throw new CustomAppError("Exception error message")
}

// -------------------------------------------------------------
// METRICS ENDPOINT (Exposes RAM / Heap Usage of the process)
// -------------------------------------------------------------
app.get('/api/metrics/memory', (req, res) => {
    const mem = process.memoryUsage()
    res.json({
        rss: `${(mem.rss / 1024 / 1024).toFixed(2)} MB`,
        heapTotal: `${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        external: `${(mem.external / 1024 / 1024).toFixed(2)} MB`,
        arrayBuffers: `${(mem.arrayBuffers / 1024 / 1024).toFixed(2)} MB`,
        rawBytes: mem
    })
})

// -------------------------------------------------------------
// 1. EITHER FLOW ENDPOINTS (No exceptions thrown)
// -------------------------------------------------------------
app.get('/api/either/success', (req, res) => {
    const result = processEitherSuccess()
    if (result.isRight()) {
        return res.status(200).json({ status: 'success', data: result.getValue() })
    }
    return res.status(400).json({ status: 'error', message: result.getValue() })
})

app.get('/api/either/error', (req, res) => {
    const result = processEitherError()
    if (result.isLeft()) {
        return res.status(400).json({ status: 'error', message: result.getValue() })
    }
    return res.status(200).json({ status: 'success', data: result.getValue() })
})

// -------------------------------------------------------------
// 2. EXCEPTION FLOW ENDPOINTS (Throw and catch exceptions)
// -------------------------------------------------------------
app.get('/api/exception/success', (req, res, next) => {
    try {
        const data = processExceptionSuccess()
        return res.status(200).json({ status: 'success', data })
    } catch (err) {
        next(err)
    }
})

app.get('/api/exception/error', (req, res, next) => {
    try {
        processExceptionError()
        return res.status(200).json({ status: 'success', data: "Ok" })
    } catch (err) {
        next(err)
    }
})

// Global Exception Handler Middleware
app.use((err, req, res, next) => {
    return res.status(400).json({ status: 'error', message: err.message || 'Internal Error' })
})

module.exports = app

const request = require('supertest')
const app = require('../src/app')

describe('Benchmark API Endpoints', () => {
    describe('Either Flow Endpoints (No Exceptions)', () => {
        it('GET /api/either/success should return 200 and success status', async () => {
            const res = await request(app).get('/api/either/success')
            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual({
                status: 'success',
                data: 'Either success data'
            })
        })

        it('GET /api/either/error should return 400 and error status without throwing exception', async () => {
            const res = await request(app).get('/api/either/error')
            expect(res.statusCode).toEqual(400)
            expect(res.body).toEqual({
                status: 'error',
                message: 'Either error message'
            })
        })
    })

    describe('Exception Flow Endpoints (Throw & Catch)', () => {
        it('GET /api/exception/success should return 200 and success status', async () => {
            const res = await request(app).get('/api/exception/success')
            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual({
                status: 'success',
                data: 'Exception success data'
            })
        })

        it('GET /api/exception/error should catch thrown exception and return 400', async () => {
            const res = await request(app).get('/api/exception/error')
            expect(res.statusCode).toEqual(400)
            expect(res.body).toEqual({
                status: 'error',
                message: 'Exception error message'
            })
        })
    })
})

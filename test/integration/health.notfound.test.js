const request = require('supertest')
const app = require('../../src/app')

describe('POST /api/health/data', () => {
    test('Debe devolver 404 si el dispositivo no existe', async () => {
        const response = await request(app)
            .post('/api/health/data')
            .send({
                device_serial: 'NO_EXISTE',
                heart_rate: 80,
                blood_oxygen: 98,
                temperature: 36,
                fall_detected: false
            })

        expect(response.statusCode).toBe(404)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe('Dispositivo no registrado')
    })
})
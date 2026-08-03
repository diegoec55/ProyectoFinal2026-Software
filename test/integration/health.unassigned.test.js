const request = require('supertest')
const app = require('../../src/app')

describe('POST /api/health/data', () => {
    test('Debe devolver 400 si el dispositivo no tiene un paciente asignado', async () => {
        const response = await request(app)
            .post('/api/health/data')
            .send({
                device_serial: 'DASF0424AFDC',
                heart_rate: 80,
                blood_oxygen: 98,
                temperature: 36,
                fall_detected: false
            })

        expect(response.statusCode).toBe(400)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe('El dispositivo no tiene un paciente asignado')
    })
})
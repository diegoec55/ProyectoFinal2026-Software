const request = require('supertest');
const app = require('../../src/app');

describe('GET /api/health/user/:id', () => {

    test('Debe devolver el historial de un paciente', async () => {

        // Arrange
        await request(app)
            .post('/api/health/data')
            .send({
                device_serial: 'F0E20834E3EC',
                heart_rate: 78,
                blood_oxygen: 98,
                temperature: 36.4,
                fall_detected: false
            });

        // Act
        const response = await request(app)
            .get('/api/health/user/2');

        // Assert
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].user_id).toBe(2);
    });
});
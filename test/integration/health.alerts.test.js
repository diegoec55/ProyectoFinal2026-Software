const request = require('supertest');
const app = require('../../src/app');

describe('GET /api/health/alerts/falls', () => {
    test('Debe devolver únicamente las alertas de caídas', async () => {

        // Arrange
        await request(app)
            .post('/api/health/data')
            .send({
                device_serial: 'F0E20834E3EC',
                heart_rate: 70,
                blood_oxygen: 98,
                temperature: 36.5,
                fall_detected: true
            });

        // Act
        const response = await request(app)
            .get('/api/health/alerts/falls');

        // Assert
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].fall_detected).toBe(true);
    });
});
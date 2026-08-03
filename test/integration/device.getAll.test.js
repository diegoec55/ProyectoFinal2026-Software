const request = require('supertest');
const app = require('../../src/app');

describe('GET /api/devices', () => {
    test('Debe devolver todos los dispositivos', async () => {

        // Arrange (el setup ya creó un dispositivo)
        // Act
        const response = await request(app)
            .get('/api/devices');

        // Assert
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('serial_number');
        expect(response.body[0]).toHaveProperty('status');
    });
});
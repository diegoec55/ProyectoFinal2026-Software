const request = require('supertest');
const app = require('../../src/app');

describe('GET /api/health/user/:id', () => {

    test('debe devolver un historial de mediciones', async () => {
        const response = await request(app)
            .get('/api/health/user/2');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

        if (response.body.length > 0) {
            expect(response.body[0]).toHaveProperty('heart_rate');
            expect(response.body[0]).toHaveProperty('blood_oxygen');
            expect(response.body[0]).toHaveProperty('fall_detected');
            expect(response.body[0]).toHaveProperty('createdAt');
        }
    });
});
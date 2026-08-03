const request = require('supertest');
const app = require('../../src/app');

describe('GET /api/carers', () => {
    test('debe responder correctamente', async () => {
        const response = await request(app)
            .get('/api/carers');
            
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
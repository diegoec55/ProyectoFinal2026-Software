const request = require('supertest');
const app = require('../../src/app');

describe('GET /api/devices/:id', () => {

    test('Debe devolver 404 cuando el dispositivo no existe', async () => {

        const response = await request(app)
            .get('/api/devices/999');

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Dispositivo no encontrado');
    });
});
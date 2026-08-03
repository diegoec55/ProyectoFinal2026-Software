const request = require('supertest');
const app = require('../../src/app');

describe('PUT /api/devices/:id/assign', () => {
    test('Debe devolver 404 si el dispositivo no existe', async () => {

        const response = await request(app)
            .put('/api/devices/999/assign')
            .send({
                user_id: 2
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message)
            .toBe('Dispositivo no encontrado');
    });
});
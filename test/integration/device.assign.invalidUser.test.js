const request = require('supertest');
const app = require('../../src/app');

describe('PUT /api/devices/:id/assign', () => {
    test('Debe devolver 404 si el paciente no existe', async () => {

        const response = await request(app)
            .put('/api/devices/2/assign')
            .send({
                user_id: 999
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Paciente no encontrado');
    });
});
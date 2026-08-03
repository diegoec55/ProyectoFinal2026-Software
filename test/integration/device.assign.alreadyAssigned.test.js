const request = require('supertest');
const app = require('../../src/app');

describe('PUT /api/devices/:id/assign', () => {
    test('Debe devolver 400 si el dispositivo ya está asignado', async () => {

        const response = await request(app)
            .put('/api/devices/1/assign')
            .send({
                user_id: 1
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message)
            .toBe('El dispositivo ya está asignado a otro paciente.');
    });
});
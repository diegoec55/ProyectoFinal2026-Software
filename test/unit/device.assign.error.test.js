jest.mock('../../src/models', () => ({
    Device: {
        findByPk: jest.fn().mockRejectedValue(new Error())
    },
    User: {}
}));

const request = require('supertest');
const app = require('../../src/app');

describe('PUT /api/devices/:id/assign', () => {
    test('Debe devolver 500 cuando ocurre un error', async () => {

        const response = await request(app)
            .put('/api/devices/1/assign')
            .send({
                user_id: 2
            });

        expect(response.statusCode).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message)
            .toBe('Error al asignar dispositivo');
    });
});
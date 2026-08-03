jest.mock('../../src/models', () => ({
    Device: {
        findByPk: jest.fn().mockRejectedValue(new Error('Error BD')),
        findOne: jest.fn()
    },
    User: {}
}));

const request = require('supertest');
const app = require('../../src/app');

describe('PUT /api/devices/:id', () => {
    test('Debe devolver 500 cuando ocurre un error interno', async () => {

        const response = await request(app)
            .put('/api/devices/1')
            .send({
                name: 'Nuevo'
            });

        expect(response.statusCode).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message)
            .toBe('Error al actualizar el dispositivo');
    });
});
jest.mock('../../src/models', () => ({
    Device: {
        findByPk: jest.fn().mockRejectedValue(new Error('Error BD'))
    },
    User: {}
}));

const request = require('supertest');
const app = require('../../src/app');

describe('PUT /api/devices/:id/unassign', () => {
    test('Debe devolver 500 cuando ocurre un error interno', async () => {

        const response = await request(app)
            .put('/api/devices/1/unassign');

        expect(response.statusCode).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Error al desasignar dispositivo');
    });
});
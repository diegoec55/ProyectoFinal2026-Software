jest.mock('../../src/models', () => ({
    Device: {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockRejectedValue(new Error('Error BD'))
    },
    User: {findByPk: jest.fn().mockResolvedValue(null)}
}));

const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/devices', () => {
    test('Debe devolver 500 cuando ocurre un error interno', async () => {

        const response = await request(app)
            .post('/api/devices')
            .send({
                serial_number: 'ABC123',
                name: 'ESP'
            });

        expect(response.statusCode).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Error al crear el dispositivo');
    });
});
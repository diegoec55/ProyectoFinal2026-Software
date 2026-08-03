const request = require('supertest');
const app = require('../../src/app');

describe('PUT /api/devices/:id', () => {
    test('Debe devolver 400 si el número de serie ya pertenece a otro dispositivo', async () => {

        const response = await request(app)
            .put('/api/devices/1')
            .send({
                serial_number: 'ESP000002'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('El número de serie ya está registrado');
    });
});
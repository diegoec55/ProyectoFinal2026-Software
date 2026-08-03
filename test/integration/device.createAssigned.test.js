const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/devices', () => {
    test('Debe crear un dispositivo asignado a un paciente', async () => {

        const response = await request(app)
            .post('/api/devices')
            .send({
                serial_number: 'ESP777777',
                name: 'ESP Paciente',
                status: 'active',
                user_id: 2
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.user_id).toBe(2);
    });
});
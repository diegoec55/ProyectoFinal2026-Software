const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/devices', () => {
    test('Debe devolver 404 cuando el paciente no existe', async () => {

        const response = await request(app)
            .post('/api/devices')
            .send({
                serial_number: 'ESP888888',
                name: 'ESP32',
                status: 'active',
                user_id: 999
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Paciente no encontrado');
    });
});
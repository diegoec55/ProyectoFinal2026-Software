const request = require('supertest');
const app = require('../../src/app');

describe('GET /api/devices/:id', () => {
    test('Debe devolver un dispositivo existente', async () => {

        const response = await request(app)
            .get('/api/devices/1');

        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(1);
        expect(response.body.serial_number).toBe('F0E20834E3EC');
    });
});
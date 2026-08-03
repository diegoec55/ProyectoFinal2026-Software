const request = require('supertest');
const app = require('../../src/app');

describe('PUT /api/devices/:id', () => {
    test('Debe actualizar únicamente el nombre', async () => {

        const response = await request(app)
            .put('/api/devices/1')
            .send({
                name: 'Solo nombre'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe('Solo nombre');
    });
});
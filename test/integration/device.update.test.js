const request = require('supertest');
const app = require('../../src/app');

describe('PUT /api/devices/:id', () => {
    test('Debe actualizar un dispositivo', async () => {

        // Arrange
        const data = {
            serial_number: 'F0E20834E3EC',
            name: 'ESP Actualizado',
            status: 'active'
        };

        // Act
        const response = await request(app)
            .put('/api/devices/1')
            .send(data);

        // Assert
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe('ESP Actualizado');
        expect(response.body.status).toBe('active');
    });
});
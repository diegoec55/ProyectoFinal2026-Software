const request = require('supertest');
const app = require('../../src/app');

describe('PUT /api/devices/:id/assign', () => {

    test('Debe asignar un dispositivo a un paciente', async () => {

        // Arrange

        // Act
        const response = await request(app)
            .put('/api/devices/2/assign')
            .send({
                user_id: 2
            });

        // Assert
        expect(response.statusCode).toBe(200);
        expect(response.body.message)
            .toBe('Dispositivo asignado correctamente');

        expect(response.body.device.user_id).toBe(2);
        expect(response.body.device.status).toBe('active');
    });
});
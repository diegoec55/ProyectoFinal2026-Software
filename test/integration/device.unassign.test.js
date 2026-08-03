const request = require('supertest');
const app = require('../../src/app');

describe('PUT /api/devices/:id/unassign', () => {
    test('Debe desasignar un dispositivo', async () => {

        // Arrange
        // El dispositivo 1 está asignado al usuario 2

        // Act
        const response = await request(app)
            .put('/api/devices/1/unassign');

        // Assert
        expect(response.statusCode).toBe(200);
        expect(response.body.message)
            .toBe('Dispositivo desasignado');
    });
});
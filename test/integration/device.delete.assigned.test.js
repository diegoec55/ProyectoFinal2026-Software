const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /api/devices/:id', () => {
    test('Debe impedir eliminar un dispositivo asignado a un paciente', async () => {

        // Arrange
        const deviceId = 1;

        // Act
        const response = await request(app)
            .delete(`/api/devices/${deviceId}`);

        // Assert
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message)
            .toBe('Primero desasigne el dispositivo del paciente.');
    });
});
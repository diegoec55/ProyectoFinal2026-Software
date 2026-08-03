const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /api/devices/:id', () => {

    test('Debe eliminar un dispositivo sin paciente asignado', async () => {

        // Arrange
        const deviceId = 2;

        // Act
        const response = await request(app)
            .delete(`/api/devices/${deviceId}`);

        // Assert
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Dispositivo eliminado correctamente');

        // Verificamos que realmente ya no exista
        const secondResponse = await request(app).get(`/api/devices/${deviceId}`);
        expect(secondResponse.statusCode).toBe(404);
    });
});
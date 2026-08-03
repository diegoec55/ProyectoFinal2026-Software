const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /api/devices/:id', () => {
    test('Debe devolver 404 si el dispositivo no existe', async () => {

        // Arrange
        const deviceId = 999;

        // Act
        const response = await request(app).delete(`/api/devices/${deviceId}`);

        // Assert
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Dispositivo no encontrado');
    });
});
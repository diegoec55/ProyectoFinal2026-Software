jest.mock('../../src/models', () => ({
    Device: {
        findByPk: jest.fn()
            .mockRejectedValue(new Error('Error de base de datos'))
    },
    User: {}
}));

const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /api/devices/:id', () => {
    test('Debe devolver 500 cuando ocurre un error interno', async () => {

        // Arrange
        const deviceId = 1;

        // Act
        const response = await request(app)
            .delete(`/api/devices/${deviceId}`);

        // Assert
        expect(response.statusCode).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message)
            .toBe('Error al eliminar el dispositivo');
    });
});
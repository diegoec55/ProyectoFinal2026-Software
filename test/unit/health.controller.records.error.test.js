const request = require('supertest');
const app = require('../../src/app');

const { HealthRecord } = require('../../src/models');

describe('GET /api/health/user/:id', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('Debe devolver 500 cuando ocurre un error al obtener los registros', async () => {

        // Arrange
        jest.spyOn(HealthRecord, 'findAll')
            .mockRejectedValue(new Error('Error de base de datos'));

        // Act
        const response = await request(app)
            .get('/api/health/user/2');

        // Assert
        expect(response.statusCode).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Error al obtener registros');
    });
});
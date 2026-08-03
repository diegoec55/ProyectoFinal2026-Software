const request = require('supertest');
const app = require('../../src/app');

const { Device } = require('../../src/models');

describe('POST /api/health/data - Error interno', () => {
    test('Debe devolver 500 cuando ocurre un error interno', async () => {

        // Arrange
        jest.spyOn(Device, 'findOne')
            .mockRejectedValue(new Error('Error de base de datos'));

        // Act
        const response = await request(app)
            .post('/api/health/data')
            .send({
                device_serial: 'F0E20834E3EC',
                heart_rate: 75,
                blood_oxygen: 98,
                temperature: 36.5,
                fall_detected: false
            });

        // Assert
        expect(response.statusCode).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message)
            .toBe('Error al guardar medición');
        Device.findOne.mockRestore();
    });
});
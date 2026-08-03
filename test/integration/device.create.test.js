const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/devices', () => {
    test('Debe crear un dispositivo nuevo', async () => {

        // Arrange
        const newDevice = {
            serial_number: 'ESP999999',
            name: 'ESP32 Nuevo',
            status: 'unassigned'
        };

        // Act
        const response = await request(app)
            .post('/api/devices')
            .send(newDevice);

        // Assert
        expect(response.statusCode).toBe(201);
        expect(response.body.serial_number).toBe('ESP999999');
        expect(response.body.name).toBe('ESP32 Nuevo');
        expect(response.body.status).toBe('unassigned');
    });
});
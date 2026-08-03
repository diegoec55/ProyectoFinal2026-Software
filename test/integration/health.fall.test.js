jest.mock('../../src/services/notification.service', () => ({
    sendWhatsApp: jest.fn().mockResolvedValue(true)
}));

const request = require('supertest');
const app = require('../../src/app');
const notificationService = require('../../src/services/notification.service');

describe('POST /api/health/data - caída', () => {
    test('Debe enviar una notificación cuando detecta una caída', async () => {

        //Arrange
        const data = {
            device_serial: 'F0E20834E3EC',
            heart_rate: 75,
            blood_oxygen: 98,
            temperature: 36.5,
            fall_detected: true,
            acc_x: 3,
            acc_y: 5,
            acc_z: 7,
            acc_magnitude: 9
        };

        //Act
        const response = await request(app)
            .post('/api/health/data')
            .send(data);

        //Assert
        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(notificationService.sendWhatsApp).toHaveBeenCalledTimes(1);
    })
})
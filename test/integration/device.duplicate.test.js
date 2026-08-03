const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/devices', () => {

    test('Debe devolver 400 si el número de serie ya existe', async () => {

        // Act
        const response = await request(app)
            .post('/api/devices')
            .send({
                serial_number: 'F0E20834E3EC',
                name: 'Otro ESP',
                status: 'active'
            });

        // Assert
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('El número de serie ya está registrado');
    });
});
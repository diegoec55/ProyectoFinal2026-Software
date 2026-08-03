const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/health/data', () => {
    test('debe guardar correctamente una medición', async () => {
        // ---------- Arrange ----------
        const nuevaMedicion = {
            device_serial: "F0E20834E3EC",
            heart_rate: 75,
            blood_oxygen: 98,
            temperature: 36.5,
            fall_detected: false,
            acc_x: 0,
            acc_y: 0,
            acc_z: 1,
            acc_magnitude: 1
        };

        // ---------- Act ----------
        const response = await request(app)
            .post('/api/health/data')
            .send(nuevaMedicion);

        // ---------- Assert ----------
        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.record).toHaveProperty('id');
        expect(response.body.record.heart_rate).toBe(75);
        expect(response.body.record.blood_oxygen).toBe(98);
        expect(response.body.record.fall_detected).toBe(false);
    });
});
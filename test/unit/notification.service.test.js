const axios = require('axios');
const notificationService = require('../../src/services/notification.service');

jest.mock('axios');

describe('notification.service', () => {
    beforeEach(() => {
        process.env.PHONE_API_KEY = '123456';
    });

    test('debe enviar un mensaje correctamente', async () => {
        axios.get.mockResolvedValue({
            data: 'OK'
        });

        const result = await notificationService.sendWhatsApp(
            '3411234567',
            'Mensaje de prueba'
        );
        expect(axios.get).toHaveBeenCalled();
        expect(result).toBe('OK');
    });
});
const request = require('supertest');
const app = require('../../src/app');

describe('GET /', () => {
    test('debe responder con login.html', async () => {
        const response = await request(app)
            .get('/');
        expect(response.statusCode).toBe(200);
    });
});
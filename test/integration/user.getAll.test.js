const request = require('supertest')
const app = require('../../src/app')

describe('GET /api/users', () => {
    test('Debe devolver todos los usuarios', async () => {

        // Arrange
        // Los usuarios ya se cargan desde testSeed.js

        // Act
        const response = await request(app).get('/api/users')

        // Assert
        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body.length).toBeGreaterThan(0)
        response.body.forEach(user => {expect(user.password).toBeUndefined()})
    })
})
const request = require('supertest')
const app = require('../../src/app')

describe('GET /api/users/:id', () => {
    test('Debe devolver un usuario existente', async () => {

        // Arrange
        const userId = 2

        // Act
        const response = await request(app)
            .get(`/api/users/${userId}`)

        // Assert
        expect(response.statusCode).toBe(200)
        expect(response.body.id).toBe(2)
        expect(response.body.email).toBe('juan@test.com')
        // La contraseña no debe exponerse
        expect(response.body.password).toBeUndefined()
    })
})
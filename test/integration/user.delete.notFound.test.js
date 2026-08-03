const request = require('supertest')
const app = require('../../src/app')

describe('PUT /api/users/:id/deactivate', () => {

    test('Debe devolver 404 si el usuario no existe', async () => {

        // Arrange
        const userId = 999

        // Act
        const response = await request(app)
            .put(`/api/users/${userId}/deactivate`)

        // Assert
        expect(response.statusCode).toBe(404)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe('Usuario no encontrado')
    })
})
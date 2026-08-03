jest.mock('../../src/models', () => ({
    User: {
        findByPk: jest.fn().mockResolvedValue(null)
    },
    Illness: {}
}))

const request = require('supertest')
const app = require('../../src/app')

describe('PUT /api/users/:id/password', () => {
    test('Debe devolver 404 si el usuario no existe', async () => {

        // Arrange
        const passwordData = {
            currentPassword: '1234',
            newPassword: '5678'
        }

        // Act
        const response = await request(app)
            .put('/api/users/999/password')
            .send(passwordData)

        // Assert
        expect(response.statusCode).toBe(404)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe('Usuario no encontrado')
    })
})
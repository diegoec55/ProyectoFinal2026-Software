jest.mock('../../src/models', () => ({
    User: {
        findByPk: jest.fn()
    },
    Illness: {}
}))

const request = require('supertest')
const app = require('../../src/app')
const { User } = require('../../src/models')

describe('PUT /api/users/:id/password', () => {

    test('Debe devolver 400 si la contraseña actual es incorrecta', async () => {

        // Arrange
        const mockUser = {
            validPassword: jest.fn().mockResolvedValue(false),
            save: jest.fn()
        }

        User.findByPk.mockResolvedValue(mockUser)

        // Act
        const response = await request(app)
            .put('/api/users/2/password')
            .send({
                currentPassword: 'incorrecta',
                newPassword: '5678'
            })

        // Assert
        expect(response.statusCode).toBe(400)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe('La contraseña actual es incorrecta')
        expect(mockUser.save).not.toHaveBeenCalled()
    })
})
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

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('Debe cambiar la contraseña correctamente', async () => {

        // Arrange
        const mockUser = {
            password: 'anterior',
            validPassword: jest.fn().mockResolvedValue(true),
            save: jest.fn().mockResolvedValue(true)
        }

        User.findByPk.mockResolvedValue(mockUser)

        const passwordData = {
            currentPassword: '1234',
            newPassword: '5678'
        }

        // Act
        const response = await request(app)
            .put('/api/users/2/password')
            .send(passwordData)

        // Assert
        expect(response.statusCode).toBe(200)
        expect(mockUser.validPassword).toHaveBeenCalledWith('1234')
        expect(mockUser.password).toBe('5678')
        expect(mockUser.save).toHaveBeenCalledTimes(1)
        expect(response.body.message).toBe('Contraseña actualizada correctamente')
    })
})
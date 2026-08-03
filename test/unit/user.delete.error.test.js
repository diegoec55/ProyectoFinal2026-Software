jest.mock('../../src/models', () => ({
    User: {
        findByPk: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn()
    },
    Illness: {}
}))

jest.mock('../../src/config/database', () => ({
    sequelize: {
        transaction: jest.fn()
    }
}))

const request = require('supertest')
const app = require('../../src/app')
const { User } = require('../../src/models')
const { sequelize } = require('../../src/config/database')

describe('PUT /api/users/:id/deactivate - error interno', () => {

    test('Debe devolver 500 y hacer rollback si ocurre un error', async () => {

        // Arrange
        const transaction = {
            commit: jest.fn(),
            rollback: jest.fn()
        }

        sequelize.transaction.mockResolvedValue(transaction)

        User.findByPk.mockRejectedValue(
            new Error('Error de base de datos')
        )

        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})

        // Act
        const response = await request(app)
            .put('/api/users/2/deactivate')

        // Assert
        expect(response.statusCode).toBe(500)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe('Error del servidor')
        expect(transaction.rollback).toHaveBeenCalledTimes(1)
        expect(transaction.commit).not.toHaveBeenCalled()
        consoleErrorSpy.mockRestore()
    })
})
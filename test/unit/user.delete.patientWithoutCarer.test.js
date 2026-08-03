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

describe('PUT /api/users/:id/deactivate - paciente sin cuidador', () => {

    test('Debe dar de baja al paciente aunque no tenga cuidador', async () => {

        // Arrange
        const transaction = {
            commit: jest.fn(),
            rollback: jest.fn()
        }

        sequelize.transaction.mockResolvedValue(transaction)

        const mockUser = {
            id: 3,
            name: 'Paciente',
            lastName: 'Prueba',
            email: 'paciente@test.com',
            password: '1234',
            dni: '12345678',
            phone: null,
            role: 'user',
            carerId: null,
            isActive: true,
            deletedAt: null,
            save: jest.fn().mockResolvedValue(true)
        }

        User.findByPk.mockResolvedValue(mockUser)
        User.findOne.mockResolvedValue(null)

        // Act
        const response = await request(app)
            .put('/api/users/3/deactivate')

        // Assert
        expect(response.statusCode).toBe(200)

        expect(User.findOne).toHaveBeenCalledWith({
            where: {
                id: null
            },
            transaction
        })

        expect(mockUser.save).toHaveBeenCalledWith({transaction})
        expect(transaction.commit).toHaveBeenCalledTimes(1)
        expect(transaction.rollback).not.toHaveBeenCalled()
        expect(mockUser.name).toBe('Usuario #3')
        expect(mockUser.isActive).toBe(false)
    })
})
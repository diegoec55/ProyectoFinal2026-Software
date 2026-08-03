const request = require('supertest')
const app = require('../../src/app')
const { User } = require('../../src/models')

describe('PUT /api/users/:id/deactivate - paciente', () => {

    test('Debe dar de baja y anonimizar un paciente', async () => {

        // Arrange
        const userId = 2

        // Act
        const response = await request(app)
            .put(`/api/users/${userId}/deactivate`)

        // Assert
        expect(response.statusCode).toBe(200)
        expect(response.body.message)
            .toBe('Cuenta eliminada correctamente')

        const deletedUser = await User.findByPk(userId)

        expect(deletedUser.name).toBe('Usuario #2')
        expect(deletedUser.lastName).toBe('Eliminado')
        expect(deletedUser.email).toBe('deleted_2@deleted.local')
        expect(deletedUser.dni).toBeNull()
        expect(deletedUser.phone).toBeNull()
        expect(deletedUser.carerId).toBeNull()
        expect(deletedUser.isActive).toBe(false)
        expect(deletedUser.deletedAt).not.toBeNull()
    })
})
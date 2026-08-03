const request = require('supertest')
const app = require('../../src/app')
const { User } = require('../../src/models')

describe('PUT /api/users/:id/deactivate - cuidador', () => {

    test('Debe dar de baja al cuidador y desasignar sus pacientes', async () => {

        // Arrange
        const carerId = 1

        // Comprobamos el estado inicial
        const patientBefore = await User.findByPk(2)
        expect(patientBefore.carerId).toBe(1)

        // Act
        const response = await request(app).put(`/api/users/${carerId}/deactivate`)

        // Assert
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBe('Cuenta eliminada correctamente')

        const deletedCarer = await User.findByPk(carerId)
        const patientAfter = await User.findByPk(2)

        expect(deletedCarer.name).toBe('Usuario #1')
        expect(deletedCarer.lastName).toBe('Eliminado')
        expect(deletedCarer.isActive).toBe(false)
        // El paciente ya no debe tener cuidador
        expect(patientAfter.carerId).toBeNull()
    })
})
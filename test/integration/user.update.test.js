const request = require('supertest')
const app = require('../../src/app')

describe('PUT /api/users/:id', () => {

    test('Debe actualizar correctamente un usuario', async () => {

        // Arrange
        const updateData = {
            name: 'Juan Actualizado',
            lastName: 'Lopez',
            email: 'juan.actualizado@test.com',
            role: 'user',
            dni: '40111222',
            birthDate: '1990-05-10',
            phone: '3415555555'
        }

        // Act
        const response = await request(app)
            .put('/api/users/2')
            .send(updateData)

        // Assert
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBe('Usuario actualizado')
        expect(response.body.user.name).toBe('Juan Actualizado')
        expect(response.body.user.email).toBe('juan.actualizado@test.com')
        expect(response.body.user.password).toBeUndefined()
    })
})
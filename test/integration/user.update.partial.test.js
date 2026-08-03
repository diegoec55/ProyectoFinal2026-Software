const request = require('supertest')
const app = require('../../src/app')

describe('PUT /api/users/:id', () => {
    test('Debe actualizar solamente los campos enviados', async () => {

        // Arrange
        const updateData = {
            name: 'Nombre Parcial'
        }

        // Act
        const response = await request(app)
            .put('/api/users/2')
            .send(updateData)

        // Assert
        expect(response.statusCode).toBe(200)
        expect(response.body.user.name).toBe('Nombre Parcial')
        // El email original debe conservarse
        expect(response.body.user.email).toBe('juan@test.com')
    })
})
const request = require('supertest')
const app = require('../../src/app')

describe('PUT /api/users/:id', () => {
    test('Debe permitir desasignar el cuidador enviando carerId null', async () => {

        // Arrange
        const updateData = {
            carerId: null
        }

        // Act
        const response = await request(app)
            .put('/api/users/2')
            .send(updateData)

        // Assert
        expect(response.statusCode).toBe(200)
        expect(response.body.user.carerId).toBeNull()
    })
})
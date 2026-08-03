const request = require('supertest')
const app = require('../../src/app')

describe('PUT /api/users/:id', () => {
    test('Debe devolver 404 si el usuario no existe', async () => {

        // Act
        const response = await request(app)
            .put('/api/users/999')
            .send({
                name: 'Usuario inexistente'
            })

        // Assert
        expect(response.statusCode).toBe(404)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe('Usuario no encontrado')
    })
})
jest.mock('../../src/models', () => ({
    User: {
        findByPk: jest.fn()
            .mockRejectedValue(new Error('Error de base de datos'))
    },
    Illness: {}
}))

const request = require('supertest')
const app = require('../../src/app')

describe('PUT /api/users/:id', () => {
    test('Debe devolver 500 cuando ocurre un error interno', async () => {

        // Arrange
        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})

        // Act
        const response = await request(app)
            .put('/api/users/2')
            .send({
                name: 'Nuevo nombre'
            })

        // Assert
        expect(response.statusCode).toBe(500)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe('Error del servidor')
        consoleErrorSpy.mockRestore()
    })
})
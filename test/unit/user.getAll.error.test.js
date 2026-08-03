jest.mock('../../src/models', () => ({
    User: {
        findAll: jest.fn()
            .mockRejectedValue(new Error('Error de base de datos'))
    },
    Illness: {}
}))

const request = require('supertest')
const app = require('../../src/app')

describe('GET /api/users', () => {
    test('Debe devolver 500 si ocurre un error al listar usuarios', async () => {

        // Arrange
        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})

        // Act
        const response = await request(app).get('/api/users')

        // Assert
        expect(response.statusCode).toBe(500)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe('Error del servidor al listar usuarios')
        consoleErrorSpy.mockRestore()
    })
})
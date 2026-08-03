jest.mock('../../../src/models', () => ({
    User: {
        findOne: jest.fn()
    },
    UserIllness: {}
}))

const { User } = require('../../../src/models')
const authController = require('../../../src/controllers/auth.controller')

describe('auth.controller - login', () => {

    let req
    let res

    beforeEach(() => {
        jest.clearAllMocks()

        req = {
            body: {
                email: 'juan@test.com',
                password: '1234'
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })

    test('Debe iniciar sesión con credenciales correctas', async () => {
        // Arrange
        const mockUser = {
            id: 2,
            name: 'Juan',
            lastName: 'Lopez',
            email: 'juan@test.com',
            role: 'user',
            isActive: true,
            validPassword: jest.fn().mockResolvedValue(true)
        }

        User.findOne.mockResolvedValue(mockUser)

        // Act
        await authController.login(req, res)

        // Assert
        expect(User.findOne).toHaveBeenCalledWith({
            where: {
                email: 'juan@test.com'
            }
        })

        expect(mockUser.validPassword).toHaveBeenCalledWith('1234')

        expect(res.status).toHaveBeenCalledWith(200)

        expect(res.json).toHaveBeenCalledWith({
            message: 'Login exitoso',
            user: {
                id: 2,
                name: 'Juan',
                lastName: 'Lopez',
                email: 'juan@test.com',
                role: 'user'
            }
        })
    })

    test('Debe devolver 400 si faltan email o contraseña', async () => {
        // Arrange
        req.body = {
            email: '',
            password: ''
        }

        // Act
        await authController.login(req, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(400)

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Email y contraseña son requeridos'
        })

        expect(User.findOne).not.toHaveBeenCalled()
    })

    test('Debe devolver 404 si el usuario no existe', async () => {
        // Arrange
        User.findOne.mockResolvedValue(null)

        // Act
        await authController.login(req, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(404)

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Usuario no encontrado'
        })
    })

    test('Debe devolver 403 si la cuenta está desactivada', async () => {
        // Arrange
        User.findOne.mockResolvedValue({
            isActive: false
        })

        // Act
        await authController.login(req, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(403)

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Esta cuenta fue dada de baja.'
        })
    })

    test('Debe devolver 401 si la contraseña es incorrecta', async () => {
        // Arrange
        const mockUser = {
            isActive: true,
            validPassword: jest.fn().mockResolvedValue(false)
        }

        User.findOne.mockResolvedValue(mockUser)

        // Act
        await authController.login(req, res)

        // Assert
        expect(mockUser.validPassword).toHaveBeenCalledWith('1234')

        expect(res.status).toHaveBeenCalledWith(401)

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Contraseña incorrecta'
        })
    })

    test('Debe devolver 500 si ocurre un error interno', async () => {
        // Arrange
        User.findOne.mockRejectedValue(
            new Error('Error de base de datos')
        )

        // Evita mostrar el error esperado durante el test
        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})

        // Act
        await authController.login(req, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(500)

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Error del servidor'
        })

        consoleErrorSpy.mockRestore()
    })
})
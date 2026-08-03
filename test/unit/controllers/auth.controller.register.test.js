jest.mock('../../../src/models', () => ({
    User: {
        findOne: jest.fn(),
        create: jest.fn()
    },
    UserIllness: {
        bulkCreate: jest.fn()
    }
}))

jest.mock('../../../src/config/database', () => ({
    sequelize: {
        transaction: jest.fn()
    }
}))

const { User, UserIllness } = require('../../../src/models')
const { sequelize } = require('../../../src/config/database')
const authController = require('../../../src/controllers/auth.controller')

describe('auth.controller - register', () => {

    let req
    let res
    let transaction

    beforeEach(() => {
        jest.clearAllMocks()

        transaction = {
            commit: jest.fn(),
            rollback: jest.fn()
        }

        sequelize.transaction.mockResolvedValue(transaction)

        req = {
            body: {
                name: 'Carlos',
                lastName: 'Gomez',
                dni: '40111222',
                birthDate: '1990-05-10',
                email: 'carlos@test.com',
                password: '1234',
                role: 'user',
                selectedIllnesses: []
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })

    test('Debe registrar correctamente un paciente', async () => {

        // Arrange
        User.findOne
            .mockResolvedValueOnce(null) // email no existe
            .mockResolvedValueOnce(null) // DNI no existe

        const newUser = {
            id: 10,
            name: 'Carlos',
            lastName: 'Gomez',
            email: 'carlos@test.com',
            role: 'user'
        }

        User.create.mockResolvedValue(newUser)

        // Act
        await authController.register(req, res)

        // Assert
        expect(User.findOne).toHaveBeenNthCalledWith(1, {
            where: {
                email: 'carlos@test.com'
            },
            transaction
        })

        expect(User.findOne).toHaveBeenNthCalledWith(2, {
            where: {
                dni: '40111222'
            },
            transaction
        })

        expect(User.create).toHaveBeenCalledWith({
            name: 'Carlos',
            lastName: 'Gomez',
            dni: '40111222',
            birthDate: '1990-05-10',
            email: 'carlos@test.com',
            password: '1234',
            role: 'user'
        }, {
            transaction
        })

        expect(transaction.commit).toHaveBeenCalledTimes(1)
        expect(transaction.rollback).not.toHaveBeenCalled()

        expect(res.status).toHaveBeenCalledWith(201)

        expect(res.json).toHaveBeenCalledWith({
            message: 'Usuario creado exitosamente',
            user: {
                id: 10,
                name: 'Carlos',
                lastName: 'Gomez',
                email: 'carlos@test.com',
                role: 'user'
            }
        })
    })

    test('Debe devolver 400 si faltan campos básicos', async () => {

        // Arrange
        req.body = {
            name: '',
            lastName: '',
            email: '',
            password: ''
        }

        // Act
        await authController.register(req, res)

        // Assert
        expect(transaction.rollback).toHaveBeenCalledTimes(1)

        expect(res.status).toHaveBeenCalledWith(400)

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Nombre, apellido, email y contraseña son requeridos'
        })

        expect(User.findOne).not.toHaveBeenCalled()
        expect(User.create).not.toHaveBeenCalled()
    })

    //Paciente sin DNI o fecha de nacimiento
    test('Debe devolver 400 si el paciente no ingresa DNI o fecha de nacimiento', async () => {
        // Arrange
        req.body.dni = ''
        req.body.birthDate = ''

        // Act
        await authController.register(req, res)

        // Assert
        expect(transaction.rollback).toHaveBeenCalledTimes(1)

        expect(res.status).toHaveBeenCalledWith(400)

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'El paciente debe ingresar DNI y fecha de nacimiento.'
        })
    })

    //Email repetido
    test('Debe devolver 400 si el email ya está registrado', async () => {
        // Arrange
        User.findOne.mockResolvedValue({
            id: 99,
            email: 'carlos@test.com'
        })

        // Act
        await authController.register(req, res)

        // Assert
        expect(transaction.rollback).toHaveBeenCalledTimes(1)

        expect(res.status).toHaveBeenCalledWith(400)

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'El email ya se encuentra registrado.'
        })

        expect(User.create).not.toHaveBeenCalled()
    })

    //DNI repetido
    test('Debe devolver 400 si el DNI ya está registrado', async () => {
        // Arrange
        User.findOne
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce({
                id: 99,
                dni: '40111222'
            })

        // Act
        await authController.register(req, res)

        // Assert
        expect(transaction.rollback).toHaveBeenCalledTimes(1)

        expect(res.status).toHaveBeenCalledWith(400)

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'El DNI ya se encuentra registrado.'
        })

        expect(User.create).not.toHaveBeenCalled()
    })

    //Paciente con enfermedades
    test('Debe guardar las enfermedades seleccionadas del paciente', async () => {
        // Arrange
        req.body.selectedIllnesses = [
            {
                illnessId: 1,
                notes: 'Control periódico'
            },
            {
                illnessId: 2
            }
        ]

        User.findOne
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null)

        User.create.mockResolvedValue({
            id: 10,
            name: 'Carlos',
            lastName: 'Gomez',
            email: 'carlos@test.com',
            role: 'user'
        })

        UserIllness.bulkCreate.mockResolvedValue([])

        // Act
        await authController.register(req, res)

        // Assert
        expect(UserIllness.bulkCreate).toHaveBeenCalledWith([
            {
                user_id: 10,
                illness_id: 1,
                notes: 'Control periódico'
            },
            {
                user_id: 10,
                illness_id: 2,
                notes: ''
            }
        ], {
            transaction
        })

        expect(transaction.commit).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(201)
    })

    //Cuidador sin teléfono o DNI del paciente
    test('Debe devolver 400 si el cuidador no ingresa teléfono o DNI del paciente', async () => {
        // Arrange
        req.body = {
            name: 'Ana',
            lastName: 'Perez',
            email: 'ana@test.com',
            password: '1234',
            role: 'carer',
            phone: '',
            patientDni: ''
        }

        // Act
        await authController.register(req, res)

        // Assert
        expect(transaction.rollback).toHaveBeenCalledTimes(1)

        expect(res.status).toHaveBeenCalledWith(400)

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'El cuidador debe ingresar teléfono y DNI del paciente.'
        })
    })

    //Paciente asociado inexistente
    test('Debe devolver 400 si no existe el paciente indicado por el cuidador', async () => {
        // Arrange
        req.body = {
            name: 'Ana',
            lastName: 'Perez',
            email: 'ana@test.com',
            password: '1234',
            role: 'carer',
            phone: '3411234567',
            patientDni: '99999999'
        }

        User.findOne
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null)

        // Act
        await authController.register(req, res)

        // Assert
        expect(transaction.rollback).toHaveBeenCalledTimes(1)

        expect(res.status).toHaveBeenCalledWith(400)

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'No existe un paciente con ese DNI.'
        })
    })

    //Paciente ya tiene cuidador
    test('Debe devolver 400 si el paciente ya tiene cuidador', async () => {
        // Arrange
        req.body = {
            name: 'Ana',
            lastName: 'Perez',
            email: 'ana@test.com',
            password: '1234',
            role: 'carer',
            phone: '3411234567',
            patientDni: '40111222'
        }

        User.findOne
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce({
                id: 2,
                dni: '40111222',
                role: 'user',
                carerId: 8
            })

        // Act
        await authController.register(req, res)

        // Assert
        expect(transaction.rollback).toHaveBeenCalledTimes(1)

        expect(res.status).toHaveBeenCalledWith(400)

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Ese paciente ya tiene un cuidador asignado.'
        })
    })

    //Registro exitoso de cuidador
    test('Debe registrar correctamente un cuidador y asignarlo al paciente', async () => {
        // Arrange
        req.body = {
            name: 'Ana',
            lastName: 'Perez',
            email: 'ana@test.com',
            password: '1234',
            role: 'carer',
            phone: '3411234567',
            patientDni: '40111222'
        }

        const patient = {
            id: 2,
            carerId: null,
            save: jest.fn().mockResolvedValue(true)
        }

        const newCarer = {
            id: 20,
            name: 'Ana',
            lastName: 'Perez',
            email: 'ana@test.com',
            role: 'carer'
        }

        User.findOne
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(patient)

        User.create.mockResolvedValue(newCarer)

        // Act
        await authController.register(req, res)

        // Assert
        expect(User.create).toHaveBeenCalledWith({
            name: 'Ana',
            lastName: 'Perez',
            dni: null,
            birthDate: null,
            email: 'ana@test.com',
            password: '1234',
            role: 'carer',
            phone: '3411234567'
        }, {
            transaction
        })

        expect(patient.carerId).toBe(20)

        expect(patient.save).toHaveBeenCalledWith({
            transaction
        })

        expect(transaction.commit).toHaveBeenCalledTimes(1)

        expect(res.status).toHaveBeenCalledWith(201)
    })

    //Error interno y rollback
    test('Debe devolver 500 y hacer rollback si ocurre un error interno', async () => {
        // Arrange
        User.findOne.mockRejectedValue(
            new Error('Error de base de datos')
        )

        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})

        // Act
        await authController.register(req, res)

        // Assert
        expect(transaction.rollback).toHaveBeenCalledTimes(1)

        expect(res.status).toHaveBeenCalledWith(500)

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Error del servidor'
        })

        consoleErrorSpy.mockRestore()
    })
})
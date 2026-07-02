const User = require('./User')
const HealthRecord = require('./HealthRecord')
const Illness = require('./Illness')
const UserIllness = require('./UserIllness')

// Relación Paciente - Cuidador (Autorelación)
// Un cuidador puede tener muchos pacientes
// Un paciente tiene un único cuidador

// Relacion Autoreferencia del cuidador (Carer) - Se ejecuta sobre la misma tabla
// Relación Paciente - Cuidador
User.belongsTo(User, { 
    foreignKey: 'carerId', 
    as: 'carer' 
})

User.hasMany(User, {
    foreignKey: 'carerId',
    as: 'patients'
})

// Relacion con HealthRecord - apunta al objeto del Modelo User
// Un usuario tiene muchos registros de salud
User.hasMany(HealthRecord, {
    foreignKey: 'user_id',
    as: 'records',
    onDelete: 'CASCADE'
})

HealthRecord.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
})

// Relación User - Illness (Muchos a Muchos)
// Un usuario puede tener muchas enfermedades
// Una enfermedad puede pertenecer a muchos usuarios
// ======================================================

User.belongsToMany(Illness, {
    through: UserIllness,
    foreignKey: 'user_id',
    otherKey: 'illness_id',
    as: 'illnesses'
})

Illness.belongsToMany(User, {
    through: UserIllness,
    foreignKey: 'illness_id',
    otherKey: 'user_id',
    as: 'users'
})

// ======================================================

module.exports = {User, HealthRecord, Illness, UserIllness}

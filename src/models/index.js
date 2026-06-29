const User = require('./User')
const HealthRecord = require('./HealthRecord')

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
User.hasMany(HealthRecord, {
    foreignKey: 'user_id',
    as: 'records',
    onDelete: 'CASCADE'
})

HealthRecord.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
})

module.exports = {
    User,
    HealthRecord
}

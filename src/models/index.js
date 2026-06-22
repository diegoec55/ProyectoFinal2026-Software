const User = require('./User')
const HealthRecord = require('./HealthRecord')

User.hasMany(HealthRecord, {
    foreignKey: 'user_id',
    as: 'records'
})

HealthRecord.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
})

// NUEVA RELACIÓN: Autoreferencia para el cuidador asignado
User.belongsTo(User, { 
    foreignKey: 'caregiverId', 
    as: 'assignedCaregiver' 
})

// Opcional: Si querés saber a qué usuarios cuida un cuidador específico
User.hasMany(User, {
    foreignKey: 'caregiverId',
    as: 'patients'
})

module.exports = {
    User,
    HealthRecord
}

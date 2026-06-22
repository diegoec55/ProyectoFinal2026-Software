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
    foreignKey: 'carerId', 
    as: 'assignedCarer' 
})

// Opcional: Si querés saber a qué usuarios cuida un cuidador específico
User.hasMany(User, {
    foreignKey: 'carerId',
    as: 'patients'
})

module.exports = {
    User,
    HealthRecord
}

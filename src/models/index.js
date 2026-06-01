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

module.exports = {
    User,
    HealthRecord
}
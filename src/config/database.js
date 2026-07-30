const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Configuración de la conexión con Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,      // Nombre de la base de datos
    process.env.DB_USER,      // Usuario de MySQL
    process.env.DB_PASSWORD,  // Contraseña de MySQL
    {
        host: process.env.DB_HOST,      // Host (localhost por defecto)
        port: process.env.DB_PORT,      // Puerto (3306 por defecto)
        dialect: 'mysql',               // Especifica que usamos MySQL
        logging: console.log,           // Muestra las consultas SQL en consola (opcional)
        define: {
            timestamps: true,             // Agrega createdAt y updatedAt automáticamente
            underscored: true,            // Usa snake_case en la base de datos
        },
    }
);

// Probar la conexión a la base de datos
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✓ Conexión a MySQL establecida correctamente');
    } catch (error) {
        console.error('✗ Error al conectar a MySQL:', error.message);
        process.exit(1);
    }
};

// ======================================================
// Seed de la base de datos
// ======================================================

// Cargar datos iniciales (seed) para la tabla User e illnesses
const seedDatabase = async ({User,Illness,Device,HealthRecord}) => {
    // Solo ejecutar en desarrollo
    // if (process.env.NODE_ENV !== 'development') {
    //     return;
    // }
        console.log("Iniciando seed");
        
    try {
        // Leer archivos JSON
        const userSeedPath = path.join(__dirname, '../seed/userSeedData.json')
        const illnessSeedPath = path.join(__dirname, '../seed/illnessSeedData.json')
        const deviceSeedPath = path.join(__dirname, '../seed/deviceSeedData.json')
        const healthSeedPath = path.join(__dirname, '../seed/healthRecordSeedData.json')

        const users = JSON.parse(fs.readFileSync(userSeedPath, 'utf-8'));
        const illnessData = JSON.parse(fs.readFileSync(illnessSeedPath, 'utf8'))
        const devices = JSON.parse(fs.readFileSync(deviceSeedPath, 'utf8'))
        const healthRecords = JSON.parse(fs.readFileSync(healthSeedPath, 'utf8'))
        console.log({
    User: !!User,
    Illness: !!Illness,
    Device: !!Device,
    HealthRecord: !!HealthRecord
})
        // Desactivar claves foraneas para evitar error de carga
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
        try {
            // Limpiar tabla User
            await HealthRecord.destroy({ where: {}, truncate: true, force: true})
            await Device.destroy({ where: {}, truncate: true, force: true})
            await Illness.destroy({ where: {}, truncate: true, force: true});
            await User.destroy({ where: {}, truncate: true, force: true });
        } finally {
            // Reactivar claves foráneas
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
        }
        console.log('🗑️  Tablas de la DB limpiadas');


        // Cargar enfermedades
        await Illness.bulkCreate(illnessData)
        //console.log(`✓ ${illnessData.length} enfermedades cargadas`)
        console.log(`✓ enfermedades cargadas`)

        // Cargar usuarios
        await User.bulkCreate(users, {individualHooks: true});
        //console.log(`✓ ${users.length} usuarios cargados`);
        console.log(`✓ usuarios cargados`);
        
        // cargar dispositivos
        await Device.bulkCreate(devices)
        console.log(`✓ dispositivos cargados`)

        // cargar health.record de un paciente
        await HealthRecord.bulkCreate(healthRecords)
        console.log(`✓ healthRecords cargados`)

        console.log('Seed finalizado correctamente')

    } catch (error) {
        console.error('✗ Error al ejecutar seed:', error.message);
    }
};

module.exports = { sequelize, testConnection, seedDatabase };
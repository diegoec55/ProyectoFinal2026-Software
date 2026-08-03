const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config({
    path:
        process.env.NODE_ENV === 'test'
            ? '.env.test'
            : '.env'
});

let sequelize;

// Configuración según el ambiente
if (process.env.NODE_ENV === 'test') {
    console.log('🧪 Base de datos SQLite en memoria');
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: console.log,
        define: {
            timestamps: true,
            underscored: true
        }
    });
} else {
    console.log('💾 Base de datos MySQL');
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: 'mysql',
            logging: console.log,
            define: {
                timestamps: true,
                underscored: true
            }
        }
    );
}

// Probar la conexión a la base de datos
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log(`✓ Conexión establecida (${process.env.NODE_ENV})`);
    } catch (error) {
        console.error(`✗ Error de conexión (${process.env.NODE_ENV})`, error.message);
        process.exit(1);
    }
};

// ======================================================
// Seed de desarrollo
// ======================================================
const seedDatabase = async ({User,Illness,Device,HealthRecord}) => {
    // Nunca ejecutar el seed durante los tests
    if (process.env.NODE_ENV === 'test') {
        return;
    }
    // Solo ejecutar en desarrollo
    // if (process.env.NODE_ENV !== 'development') {
    //     return;
    // }
        console.log("Iniciando seed");
        
    try {

        const users = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, '../seed/userSeedData.json'),
                'utf8'
            )
        );

        const illnesses = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, '../seed/illnessSeedData.json'),
                'utf8'
            )
        );

        const devices = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, '../seed/deviceSeedData.json'),
                'utf8'
            )
        );

        const healthRecords = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, '../seed/healthRecordSeedData.json'),
                'utf8'
            )
        );

        // Solo MySQL necesita esto
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        try {
            await HealthRecord.destroy({
                where: {},
                truncate: true,
                force: true
            });

            await Device.destroy({
                where: {},
                truncate: true,
                force: true
            });

            await Illness.destroy({
                where: {},
                truncate: true,
                force: true
            });

            await User.destroy({
                where: {},
                truncate: true,
                force: true
            });

        } finally {
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        }

        console.log('🗑️ Base limpiada');

        await Illness.bulkCreate(illnesses);
        console.log('✓ Enfermedades cargadas');

        await User.bulkCreate(users, {
            individualHooks: true
        });
        console.log('✓ Usuarios cargados');

        await Device.bulkCreate(devices);
        console.log('✓ Dispositivos cargados');

        await HealthRecord.bulkCreate(healthRecords);
        console.log('✓ Historial cargado');

        console.log('✓ Seed finalizado');

    } catch (error) {
        console.error('Error en seed:', error.message);
    }
};

module.exports = { sequelize, testConnection, seedDatabase };
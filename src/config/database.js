const { Sequelize } = require('sequelize');
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

module.exports = { sequelize, testConnection };
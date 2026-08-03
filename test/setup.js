const { sequelize } = require('../src/config/database');
const seedTestDatabase = require('./helpers/testSeed');

beforeAll(async () => {

    await sequelize.sync({ force: true });
    await seedTestDatabase();
});

afterAll(async () => {
    await sequelize.close();
});
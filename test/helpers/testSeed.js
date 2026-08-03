const { User, Device } = require('../../src/models');

async function seedTestDatabase() {

    await User.create({
        id: 1,
        name: "Flor",
        lastName: "Perez",
        email: "flor@test.com",
        password: "1234",
        role: "carer",
        phone: "3411234567"
    });

    await User.create({
        id: 2,
        name: "Juan",
        lastName: "Lopez",
        email: "juan@test.com",
        password: "1234",
        role: "user",
        carerId: 1
    });

    await Device.create({
        serial_number: "F0E20834E3EC",
        name: "ESP32 Test",
        status: "active",
        user_id: 2
    });

    await Device.create({
        serial_number: "DASF0424AFDC",
        name: "ESP32 Libre",
        status: "unassigned",
        user_id: null
    });

    await Device.create({
        serial_number: "ESP000002",
        name: "ESP Test 2",
        status: "unassigned"
    });
}

module.exports = seedTestDatabase;
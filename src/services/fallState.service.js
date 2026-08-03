const fallState = {};

exports.shouldNotify = (deviceId, currentState) => {

    const previousState = fallState[deviceId] ?? false;

    // Detecta transición FALSE -> TRUE
    if (!previousState && currentState) {
        fallState[deviceId] = true;
        return true;
    }

    // Cuando vuelve a FALSE, reiniciamos
    if (!currentState) {
        fallState[deviceId] = false;
    }
    return false;
};

// Solo para testing
exports.reset = () => {
    Object.keys(fallState).forEach(key => delete fallState[key]);
};
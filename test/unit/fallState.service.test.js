const fallStateService = require('../../src/services/fallState.service');

describe('FallStateService', () => {
    beforeEach(() => {
        fallStateService.reset();
    });

    // Arrange
    const deviceId = 1

    test('Debe notificar la primera caída', () => {
        // Act
        const result = fallStateService.shouldNotify(1, true);
        // Assert
        expect(result).toBe(true);
    });
});
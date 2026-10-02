const { runAllFlowTests } = require('../test-flows');

describe('Full Application Flow Tests with Mock JSON Database', () => {
  it('should initialize mock DB with JSON structure, test all application flows, and delete DB afterwards', async () => {
    await expect(runAllFlowTests()).resolves.not.toThrow();
  }, 30000);
});

describe('zazu.json', () => {
  test('is valid', () => {
    // eslint-disable-next-line global-require, import/no-unresolved
    const config = require('../zazu.json');
    expect(config).toBeInstanceOf(Object);
  });
});

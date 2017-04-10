const config = require('../zazu.json')

describe('zazu.json', () => {
  test('is valid', () => {
    expect(config).toBeInstanceOf(Object)
  })
})

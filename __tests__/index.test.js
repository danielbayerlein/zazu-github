const index = require('../src/')
const github = require('../src/github')

describe('index.js', () => {
  beforeEach(() => {
    github.search = jest.fn()
    index()('preact')
  })

  afterEach(() => jest.resetAllMocks())

  test('call github.search with "preact"', () => {
    expect(github.search).toBeCalledWith('preact')
  })
})

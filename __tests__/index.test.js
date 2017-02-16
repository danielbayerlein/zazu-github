const index = require('../src/');
const github = require('../src/github');

describe('index.js', () => {
  beforeEach(() => {
    github.search = jest.fn();
    index()('honeycomb');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('call github.search with "honeycomb"', () => {
    expect(github.search).toBeCalledWith('honeycomb');
  });
});

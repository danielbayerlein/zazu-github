const index = require('../src/');
const github = require('../src/github');

describe('index.js', () => {
  beforeEach(() => {
    github.search = jest.fn();
    index()('zazu');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('called github.search with zazu', () => {
    expect(github.search).toBeCalledWith('zazu');
  });
});

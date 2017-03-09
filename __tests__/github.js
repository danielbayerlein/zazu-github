describe('github.js', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('search', () => {
    let got;
    let github;

    beforeEach(() => {
      jest.mock('got');
      got = require('got'); // eslint-disable-line global-require
      github = require('../src/github'); // eslint-disable-line global-require
      console.error = jest.fn(); // eslint-disable-line no-console

      got.mockImplementation(() => new Promise(resolve => resolve({
        // eslint-disable-next-line global-require
        body: require('../__mocks__/result.json'),
      })));
    });

    test('call got with url and options', () => (
      github.search('honeycomb')
        .then(() => {
          expect(got).toHaveBeenCalledWith(
            'https://api.github.com/search/repositories',
            {
              query: {
                q: 'honeycomb',
                per_page: 10,
              },
              json: true,
              headers: {
                accept: 'application/vnd.github.v3+json',
              },
            },
          );
        })
    ));

    test('returns an array', () => (
      github.search('honeycomb')
        .then((packages) => {
          expect(packages).toBeInstanceOf(Array);
        })
      ));

    test('returns the expected title', () => (
      github.search('honeycomb')
        .then((packages) => {
          expect(packages[0].title).toBe('altamiracorp/honeycomb');
        })
      ));

    test('returns the expected value', () => (
      github.search('honeycomb')
        .then((packages) => {
          expect(packages[0].value).toBe(
            'https://github.com/altamiracorp/honeycomb',
          );
        })
      ));

    test('returns the expected subtitle', () => (
      github.search('honeycomb')
        .then((packages) => {
          expect(packages[0].subtitle).toBe('MySql storage engine for the cloud');
        })
    ));

    test('call console.error with an error message', () => {
      const body = `
        {
          "message": "Validation Failed",
          "errors": [
            {
              "resource": "Search",
              "field": "q",
              "code": "missing"
            }
          ],
          "documentation_url": "https://developer.github.com/v3/search"
        }
      `;

      got.mockImplementation(() => new Promise((resolve, reject) => reject({
        response: { body },
      })));

      return github.search('honeycomb')
        .then(() => {
          // eslint-disable-next-line no-console
          expect(console.error).toHaveBeenCalledWith(body);
        });
    });
  });

  describe('integration', () => {
    // eslint-disable-next-line global-require
    const github = require('../src/github');
    const searchResult = github.search('honeycomb');

    test('returns an array', () => (
      searchResult.then((packages) => {
        expect(packages).toBeInstanceOf(Array);
      })
    ));

    test('returns an object with a title', () => (
      searchResult.then((packages) => {
        expect(packages[0].title).toBeDefined();
      })
    ));

    test('returns an object with a value', () => (
      searchResult.then((packages) => {
        expect(packages[0].value).toBeDefined();
      })
    ));

    test('returns an object with a subtitle', () => (
      searchResult.then((packages) => {
        expect(packages[0].subtitle).toBeDefined();
      })
    ));
  });
});

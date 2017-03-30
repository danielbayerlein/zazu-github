/* eslint global-require: 0 */

describe('github.js', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('search', () => {
    let got;
    let github;
    let cache;

    const emoji = require('node-emoji');
    const mockResult = require('../__mocks__/result.json').items.map(repository => ({
      id: repository.full_name,
      title: repository.full_name,
      value: repository.html_url,
      subtitle: emoji.emojify(repository.description),
    }));

    beforeEach(() => {
      jest.mock('got');
      got = require('got');

      jest.mock('cache-conf');
      cache = { get: jest.fn(), isExpired: jest.fn(), set: jest.fn() };
      require('cache-conf').mockImplementation(() => cache);

      github = require('../src/github');

      got.mockImplementation(() => new Promise(resolve => resolve({
        body: require('../__mocks__/result.json'),
      })));
    });

    test('call got with url and options', () => (
      github.search('preact')
        .then(() => {
          expect(got).toHaveBeenCalledWith(
            'https://api.github.com/search/repositories',
            {
              query: {
                q: 'preact',
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
      github.search('preact')
        .then((repositories) => {
          expect(repositories).toBeInstanceOf(Array);
        })
      ));

    test('returns the expected id', () => (
      github.search('preact')
        .then((repositories) => {
          expect(repositories[0].id).toBe('developit/preact');
        })
      ));

    test('returns the expected title', () => (
      github.search('preact')
        .then((repositories) => {
          expect(repositories[0].title).toBe('developit/preact');
        })
      ));

    test('returns the expected value', () => (
      github.search('preact')
        .then((repositories) => {
          expect(repositories[0].value).toBe('https://github.com/developit/preact');
        })
      ));

    test('returns the expected subtitle', () => (
      github.search('preact')
        .then((repositories) => {
          expect(repositories[0].subtitle).toBe(
            '⚛️ Fast 3kb React alternative with the same ES6 API. Components & Virtual DOM.',
          );
        })
    ));

    test('returns the expected error', () => {
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

      return github.search('preact')
        .catch((repositories) => {
          expect(repositories.response.body).toBe(body);
        });
    });

    test('call cache.get with the expected arguments', () => (
      github.search('preact')
        .then(() => {
          expect(cache.get).toBeCalledWith(
            'zazu-github.preact',
            { ignoreMaxAge: true },
          );
        })
    ));

    test('call cache.set with the expected arguments', () => (
      github.search('preact')
        .then(() => {
          expect(cache.set).toBeCalledWith(
            'zazu-github.preact',
            mockResult,
            { maxAge: 3600000 },
          );
        })
    ));

    test('call cache.isExpired with the expected argument', () => {
      cache.get = jest.fn(() => mockResult);

      return github.search('preact')
        .then(() => {
          expect(cache.isExpired).toBeCalledWith('zazu-github.preact');
        });
    });

    test('returns the cache result', () => {
      cache.isExpired = jest.fn(() => false);
      cache.get = jest.fn(() => mockResult);

      return github.search('preact')
        .then((repositories) => {
          expect(repositories).toEqual(mockResult);
        });
    });

    test('returns the cache result when an error occurs', () => {
      cache.isExpired = jest.fn(() => true);
      cache.get = jest.fn(() => mockResult);
      got.mockImplementation(() => new Promise((resolve, reject) => reject()));

      return github.search('preact')
        .then((repositories) => {
          expect(repositories).toEqual(mockResult);
        });
    });
  });

  describe('integration', () => {
    jest.mock('cache-conf');

    const github = require('../src/github');
    const searchResult = github.search('preact');

    test('returns an array', () => (
      searchResult.then((repositories) => {
        expect(repositories).toBeInstanceOf(Array);
      })
    ));

    test('returns an object with a id', () => (
      searchResult.then((repositories) => {
        expect(repositories[0].id).toBeDefined();
      })
    ));

    test('returns an object with a title', () => (
      searchResult.then((repositories) => {
        expect(repositories[0].title).toBeDefined();
      })
    ));

    test('returns an object with a value', () => (
      searchResult.then((repositories) => {
        expect(repositories[0].value).toBeDefined();
      })
    ));

    test('returns an object with a subtitle', () => (
      searchResult.then((repositories) => {
        expect(repositories[0].subtitle).toBeDefined();
      })
    ));
  });
});

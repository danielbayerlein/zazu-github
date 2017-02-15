const got = require('got');

const URL = 'https://api.github.com/search/repositories';
const RESULT_ITEMS = 10;

module.exports.search = (query) => {
  const options = {
    json: true,
    query: {
      q: query,
      per_page: RESULT_ITEMS,
    },
    headers: {
      accept: 'application/vnd.github.v3+json',
    },
  };

  return got(URL, options)
    .then(response => (
      response.body.items.map(repository => (
        {
          title: repository.full_name,
          value: repository.url,
          subtitle: repository.description,
        }
      ))
    ))
    .catch((error) => {
      console.error(error.response.body); // eslint-disable-line no-console
    });
};

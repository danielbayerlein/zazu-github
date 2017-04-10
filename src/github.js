const got = require('got')
const emoji = require('node-emoji')
const CacheConf = require('cache-conf')

const URL = 'https://api.github.com/search/repositories'
const RESULT_ITEMS = 10

const CACHE_CONF = {
  key: 'zazu-github', // cache key prefix
  maxAge: 3600000 // 1 hour
}

const cache = new CacheConf()

/**
 * Fetch the URL, cache the result and return it.
 * Returns the cache result if it is valid.
 *
 * @param  {string}  query Search query
 * @return {Promise}       Returns a promise that is fulfilled with the JSON result
 */
module.exports.search = (query) => {
  const options = {
    json: true,
    query: {
      q: query,
      per_page: RESULT_ITEMS
    },
    headers: {
      accept: 'application/vnd.github.v3+json'
    }
  }

  const cacheKey = `${CACHE_CONF.key}.${query}`
  const cachedResponse = cache.get(cacheKey, { ignoreMaxAge: true })

  if (cachedResponse && !cache.isExpired(cacheKey)) {
    return Promise.resolve(cachedResponse)
  }

  return new Promise((resolve, reject) => (
    got(URL, options)
      .then((response) => {
        const data = response.body.items.map((repository) => ({
          id: repository.full_name,
          title: repository.full_name,
          value: repository.html_url,
          subtitle: emoji.emojify(repository.description)
        }))

        cache.set(cacheKey, data, { maxAge: CACHE_CONF.maxAge })

        resolve(data)
      })
      .catch((err) => {
        if (cachedResponse) {
          resolve(cachedResponse)
        }

        reject(err)
      })
  ))
}

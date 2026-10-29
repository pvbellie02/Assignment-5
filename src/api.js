/*
  Name: [Pranav Bellie]
  Date: 10.29.2026
  CSC 372-01

  This file holds every request the gallery makes to the TVmaze API.
  Each request is remembered by its URL, so asking for the same data
  again (for example when React runs an effect twice in development, or
  when a visitor goes back to the gallery) reuses the earlier request
  instead of hitting TVmaze again. Failed requests are forgotten so a
  visitor can try again.
*/

let SEARCH_URL = 'https://api.tvmaze.com/search/shows?q=';
let SHOWS_URL = 'https://api.tvmaze.com/shows/';
let MAX_RESULTS = 10;

// Remembers each request's promise, keyed by URL.
let requestCache = new Map();

/**
 * Requests a URL and returns its parsed JSON. Checks the response
 * status first, and throws an error carrying the HTTP status if the
 * request was not successful.
 * @param {string} url - The URL to request.
 * @return {Promise<*>} The parsed JSON data.
 */
async function fetchJson(url) {
  let res = await fetch(url);
  if (!res.ok) {
    let error = new Error('Request failed with status ' + res.status);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

/**
 * Requests a URL, or reuses the earlier request for the same URL. A
 * request that fails is removed from the cache so it can be retried.
 * @param {string} url - The URL to request.
 * @return {Promise<*>} The parsed JSON data.
 */
function cachedFetchJson(url) {
  if (requestCache.has(url)) {
    return requestCache.get(url);
  }
  let promise = fetchJson(url).catch(function (error) {
    requestCache.delete(url);
    throw error;
  });
  requestCache.set(url, promise);
  return promise;
}

/**
 * Searches TVmaze for shows. TVmaze wraps each show in an object with a
 * score, so this unwraps them, drops anything without a numeric id, and
 * keeps at most 10 shows in the order TVmaze ranked them.
 * @param {string} term - The text to search for.
 * @return {Promise<Array<Object>>} The matching show objects.
 */
export async function searchShows(term) {
  let data = await cachedFetchJson(SEARCH_URL + encodeURIComponent(term));
  if (!Array.isArray(data)) {
    return [];
  }
  return data
    .filter(function (result) {
      return result && result.show && typeof result.show.id === 'number';
    })
    .slice(0, MAX_RESULTS)
    .map(function (result) {
      return result.show;
    });
}

/**
 * Gets a single show by its TVmaze id.
 * @param {string|number} id - The TVmaze show id.
 * @return {Promise<Object>} The show object.
 */
export function fetchShow(id) {
  return cachedFetchJson(SHOWS_URL + encodeURIComponent(id));
}

/**
 * Gets a show's main cast. Each entry has a person and a character.
 * @param {string|number} id - The TVmaze show id.
 * @return {Promise<Array<Object>>} The cast entries.
 */
export async function fetchCast(id) {
  let data = await cachedFetchJson(SHOWS_URL + encodeURIComponent(id) + '/cast');
  return Array.isArray(data) ? data : [];
}

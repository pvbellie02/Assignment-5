/*
  Name: [Pranav Bellie]
  Date: 10.29.2026
  CSC 372-01

  This file holds the helper functions for the TVmaze React gallery:
  removing HTML from summaries, formatting dates and ratings, and
  turning missing data into "Not available". None of these functions
  touch React, so every component can share them.
*/

export let NOT_AVAILABLE = 'Not available';

/**
 * Removes HTML markup from a string and returns plain, readable text.
 * DOMParser builds a separate document that never runs scripts, and
 * textContent returns only the text without any tags.
 * @param {string} html - A string that may contain HTML tags.
 * @return {string} The text with markup removed and whitespace tidied.
 */
export function stripHtml(html) {
  let doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script, style').forEach(function (element) {
    element.remove();
  });
  return doc.body.textContent.replace(/\s+/g, ' ').trim();
}

/**
 * Shortens text to a maximum length, cutting at a word boundary and
 * adding an ellipsis when something was removed.
 * @param {string} text - The text to shorten.
 * @param {number} maxLength - The most characters to keep.
 * @return {string} The original text, or a shortened version of it.
 */
export function shortenText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  let cut = text.slice(0, maxLength);
  let lastSpace = cut.lastIndexOf(' ');
  if (lastSpace > 0) {
    cut = cut.slice(0, lastSpace);
  }
  return cut + '\u2026';
}

/**
 * Gets a show's summary as plain text, optionally shortened.
 * @param {Object} show - A show object from TVmaze.
 * @param {number} [maxLength] - The most characters to keep. Leave it
 *     out to keep the whole summary.
 * @return {string} The cleaned summary or "Not available".
 */
export function formatSummary(show, maxLength) {
  if (typeof show.summary !== 'string') {
    return NOT_AVAILABLE;
  }
  let text = stripHtml(show.summary);
  if (text === '') {
    return NOT_AVAILABLE;
  }
  if (maxLength === undefined) {
    return text;
  }
  return shortenText(text, maxLength);
}

/**
 * Formats a premiere date such as "2011-04-17" as "April 17, 2011".
 * The date is read as UTC and displayed as UTC so it never shifts a day
 * in time zones behind UTC.
 * @param {string} dateString - A YYYY-MM-DD date from TVmaze.
 * @return {string} The formatted date or "Not available".
 */
export function formatPremiere(dateString) {
  if (typeof dateString !== 'string') {
    return NOT_AVAILABLE;
  }
  let date = new Date(dateString + 'T00:00:00Z');
  if (isNaN(date.getTime())) {
    return NOT_AVAILABLE;
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
}

/**
 * Formats the show record's last-updated time. TVmaze gives this as a
 * Unix timestamp in seconds, and it is shown in the visitor's own time
 * zone.
 * @param {number} timestamp - Seconds since January 1, 1970 (UTC).
 * @return {string} The formatted date and time or "Not available".
 */
export function formatUpdated(timestamp) {
  if (typeof timestamp !== 'number') {
    return NOT_AVAILABLE;
  }
  let date = new Date(timestamp * 1000);
  if (isNaN(date.getTime())) {
    return NOT_AVAILABLE;
  }
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });
}

/**
 * Formats a show's genres as a comma-separated list.
 * @param {Array<string>} genres - The genres from TVmaze.
 * @return {string} The genres or "Not available".
 */
export function formatGenres(genres) {
  if (Array.isArray(genres) && genres.length > 0) {
    return genres.join(', ');
  }
  return NOT_AVAILABLE;
}

/**
 * Formats a show's average rating out of 10.
 * @param {Object} rating - The rating object from TVmaze, { average }.
 * @return {string} The rating (such as "8.4 / 10") or "Not available".
 */
export function formatRating(rating) {
  if (rating && typeof rating.average === 'number') {
    return rating.average + ' / 10';
  }
  return NOT_AVAILABLE;
}

/**
 * Gets a show's name, with a fallback if it is missing.
 * @param {Object} show - A show object from TVmaze.
 * @return {string} The show name or "Untitled show".
 */
export function getShowName(show) {
  if (typeof show.name === 'string' && show.name.trim() !== '') {
    return show.name;
  }
  return 'Untitled show';
}

/**
 * Finds a poster image URL for a show, switching http to https so the
 * image still loads on an https page.
 * @param {Object} show - A show object from TVmaze.
 * @return {string} The poster URL, or an empty string if there is none.
 */
export function getPosterUrl(show) {
  if (!show.image) {
    return '';
  }
  let url = show.image.medium || show.image.original;
  if (typeof url !== 'string') {
    return '';
  }
  return url.replace('http://', 'https://');
}

/**
 * Gets the link to a show's page on TVmaze, upgraded to https. Only
 * http and https links are accepted.
 * @param {Object} show - A show object from TVmaze.
 * @return {string} The URL, or an empty string if there is none.
 */
export function getTvmazeUrl(show) {
  if (typeof show.url !== 'string' || !show.url.startsWith('http')) {
    return '';
  }
  return show.url.replace('http://', 'https://');
}

/**
 * Gets the network or streaming channel a show airs on.
 * @param {Object} show - A show object from TVmaze.
 * @return {string} The network or channel name, or "Not available".
 */
export function getNetworkName(show) {
  if (show.network && typeof show.network.name === 'string') {
    return show.network.name;
  }
  if (show.webChannel && typeof show.webChannel.name === 'string') {
    return show.webChannel.name;
  }
  return NOT_AVAILABLE;
}

/**
 * Gets a show's status (such as "Ended" or "Running").
 * @param {Object} show - A show object from TVmaze.
 * @return {string} The status or "Not available".
 */
export function formatStatus(show) {
  if (typeof show.status === 'string' && show.status !== '') {
    return show.status;
  }
  return NOT_AVAILABLE;
}

/**
 * Checks that a value from the URL looks like a TVmaze show id, which
 * is a whole number with no other characters.
 * @param {string} id - The id taken from the URL.
 * @return {boolean} True if the id is made only of digits.
 */
export function isValidShowId(id) {
  return typeof id === 'string' && /^\d+$/.test(id);
}

/**
 * Turns a failed request into a message a visitor can understand.
 * @param {Error} error - The error thrown by the api functions.
 * @return {string} A user-friendly error message.
 */
export function describeError(error) {
  if (error.status === 429) {
    return 'TVmaze is limiting requests right now. Please wait about 10 seconds and try again.';
  }
  if (error.status) {
    return 'TVmaze returned an error (status ' + error.status + '). Please try again later.';
  }
  return 'Something went wrong while contacting TVmaze. Check your internet connection and try again.';
}

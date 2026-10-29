/*
  Name: [Pranav Bellie]
  Date: 10.29.2026
  CSC 372-01

  This file holds the App component. App owns the search state (the
  submitted search, the request status, and the results) and runs the
  search inside an effect. It lives here, above the routes, so the
  results are still there when a visitor opens a show's detail page and
  comes back. It also draws the shared header and footer and sets up
  the two routes.
*/

import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { searchShows } from './api.js';
import { describeError } from './utils.js';
import GalleryPage from './components/gallery-page.jsx';
import ShowDetail from './components/show-detail.jsx';
import NotFound from './components/not-found.jsx';

let DEFAULT_SEARCH = 'star trek';

/**
 * The root component. Holds the state that the search form, the results
 * summary, and the show list all depend on.
 * @return {JSX.Element} The whole app: header, routes, and footer.
 */
function App() {
  // The id changes on every submit, so searching the same term again
  // still runs the effect (the api cache keeps that from re-requesting).
  let [search, setSearch] = useState({ term: DEFAULT_SEARCH, id: 0 });
  // One of: 'loading', 'error', 'empty', 'no-results', 'success'
  let [status, setStatus] = useState('loading');
  let [shows, setShows] = useState([]);
  let [errorMessage, setErrorMessage] = useState('');

  useEffect(function () {
    if (search.term === '') {
      setShows([]);
      setStatus('empty');
      return undefined;
    }

    let cancelled = false;
    setShows([]);
    setStatus('loading');

    searchShows(search.term)
      .then(function (results) {
        if (cancelled) {
          return;
        }
        setShows(results);
        setStatus(results.length === 0 ? 'no-results' : 'success');
      })
      .catch(function (error) {
        if (cancelled) {
          return;
        }
        setErrorMessage(describeError(error));
        setStatus('error');
      });

    // If a newer search starts (or the component unmounts), ignore this
    // search's result so an old response can never replace a new one.
    return function () {
      cancelled = true;
    };
  }, [search]);

  /**
   * Starts a new search. Passed down to the search form as a prop.
   * @param {string} text - The text the visitor typed.
   */
  function handleSearch(text) {
    setSearch(function (previous) {
      return { term: text.trim(), id: previous.id + 1 };
    });
  }

  return (
    <>
      <header id="site-header">
        <Link id="site-title" to="/">TVmaze Show Gallery</Link>
      </header>

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <GalleryPage
                searchTerm={search.term}
                status={status}
                shows={shows}
                errorMessage={errorMessage}
                onSearch={handleSearch}
              />
            }
          />
          <Route path="/shows/:id" element={<ShowDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer id="site-footer">
        <p>
          Show data provided by{' '}
          <a href="https://www.tvmaze.com/" target="_blank" rel="noopener noreferrer">TVmaze.com</a>
          , licensed under{' '}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>.
        </p>
      </footer>
    </>
  );
}

export default App;

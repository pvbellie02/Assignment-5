/*
  Name: [Pranav Bellie]
  Date: 10.29.2026
  CSC 372-01

  This file holds the GalleryPage component, the page shown at "/". It
  has no state of its own. It is the common parent that receives the
  search state from App and hands the right pieces to the search form,
  the results summary, and the show list.
*/

import SearchForm from './search-form.jsx';
import ResultsSummary from './results-summary.jsx';
import ShowList from './show-list.jsx';

/**
 * The gallery page: heading, search form, results summary, and cards.
 * @param {Object} props - The component props.
 * @param {string} props.searchTerm - The search that is currently shown.
 * @param {string} props.status - 'loading', 'error', 'empty',
 *     'no-results', or 'success'.
 * @param {Array<Object>} props.shows - The shows to display.
 * @param {string} props.errorMessage - The message to show on error.
 * @param {function(string): void} props.onSearch - Called with the typed
 *     text when the form is submitted.
 * @return {JSX.Element} The gallery page.
 */
function GalleryPage({ searchTerm, status, shows, errorMessage, onSearch }) {
  return (
    <>
      <h1>TVmaze Show Gallery</h1>
      <p id="page-intro">Search for a TV show by title or keyword to see its details and main cast.</p>

      <SearchForm
        initialValue={searchTerm}
        onSearch={onSearch}
        disabled={status === 'loading'}
      />
      <ResultsSummary searchTerm={searchTerm} count={shows.length} status={status} />
      <ShowList shows={shows} status={status} errorMessage={errorMessage} />
    </>
  );
}

export default GalleryPage;

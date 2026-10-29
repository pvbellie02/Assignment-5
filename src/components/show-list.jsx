/*
  Name: [Pranav Bellie]
  Date: 10.29.2026
  CSC 372-01

  This file holds the ShowList component. It decides what the gallery
  area looks like for each status (loading, error, empty search, no
  results, or results) and renders one ShowCard per show with map().
*/

import ShowCard from './show-card.jsx';

/**
 * The gallery area. Shows a message for every status except 'success',
 * where it shows the cards inside a flex container.
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.shows - The shows to display.
 * @param {string} props.status - 'loading', 'error', 'empty',
 *     'no-results', or 'success'.
 * @param {string} props.errorMessage - The message to show on error.
 * @return {JSX.Element} The message or the gallery of cards.
 */
function ShowList({ shows, status, errorMessage }) {
  if (status === 'loading') {
    return <p className="message" role="status">Searching TVmaze&hellip;</p>;
  }

  if (status === 'error') {
    return <p className="message message-error" role="alert">{errorMessage}</p>;
  }

  if (status === 'empty') {
    return (
      <p className="message message-error" role="alert">
        Please enter a show title or keyword to search.
      </p>
    );
  }

  if (status === 'no-results') {
    return (
      <p className="message message-error" role="alert">
        No shows found. Try a different title or keyword.
      </p>
    );
  }

  return (
    <section id="show-gallery" aria-label="Search results">
      {shows.map(function (show) {
        return <ShowCard key={show.id} show={show} />;
      })}
    </section>
  );
}

export default ShowList;

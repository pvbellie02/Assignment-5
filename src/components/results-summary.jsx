/*
  Name: [Pranav Bellie]
  Date: 10.29.2026
  CSC 372-01

  This file holds the ResultsSummary component. It shows how many
  results there are and which search term they are for. It does not own
  the input, so it only works because the state was lifted up to App and
  passed down to it as props.
*/

/**
 * A one-line summary such as: Showing 10 results for "star trek".
 * Stays empty while loading, on errors, and for an empty search.
 * @param {Object} props - The component props.
 * @param {string} props.searchTerm - The search term being shown.
 * @param {number} props.count - How many shows are displayed.
 * @param {string} props.status - 'loading', 'error', 'empty',
 *     'no-results', or 'success'.
 * @return {JSX.Element} The summary paragraph.
 */
function ResultsSummary({ searchTerm, count, status }) {
  let text = '';
  if (status === 'success' || status === 'no-results') {
    let noun = count === 1 ? 'result' : 'results';
    text = 'Showing ' + count + ' ' + noun + ' for \u201C' + searchTerm + '\u201D.';
  }

  return <p id="results-summary" role="status">{text}</p>;
}

export default ResultsSummary;

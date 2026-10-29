/*
  Name: [Pranav Bellie]
  Date: 10.29.2026
  CSC 372-01

  This file holds the TvmazeLink component, the link from a show to its
  page on TVmaze. It is used on both the gallery cards and the detail
  page.
*/

import { getShowName, getTvmazeUrl, NOT_AVAILABLE } from '../utils.js';

/**
 * A link to a show's TVmaze page that opens in a new tab, or a plain
 * "Not available" line if the show has no usable URL.
 * @param {Object} props - The component props.
 * @param {Object} props.show - A show object from TVmaze.
 * @return {JSX.Element} A link or a paragraph.
 */
function TvmazeLink({ show }) {
  let url = getTvmazeUrl(show);

  if (url === '') {
    return <p><strong>TVmaze page:</strong> {NOT_AVAILABLE}</p>;
  }

  return (
    <a className="tvmaze-link" href={url} target="_blank" rel="noopener noreferrer">
      View {getShowName(show)} on TVmaze
    </a>
  );
}

export default TvmazeLink;

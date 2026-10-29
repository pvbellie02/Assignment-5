/*
  Name: [Pranav Bellie]
  Date: 10.29.2026
  CSC 372-01

  This file holds the Poster component. It shows a show's poster with
  useful alternative text, or a "No poster available" box when the show
  has no poster or the image fails to load, so a broken image icon is
  never shown.
*/

import { useState } from 'react';
import { getPosterUrl, getShowName } from '../utils.js';

/**
 * A show's poster image, or a placeholder box.
 * @param {Object} props - The component props.
 * @param {Object} props.show - A show object from TVmaze.
 * @return {JSX.Element} An img element or a placeholder div.
 */
function Poster({ show }) {
  let [failed, setFailed] = useState(false);
  let url = getPosterUrl(show);

  /**
   * Remembers that the image could not be loaded.
   */
  function handleError() {
    setFailed(true);
  }

  if (url === '' || failed) {
    return <div className="poster-placeholder">No poster available</div>;
  }

  return (
    <img
      className="poster"
      src={url}
      alt={'Poster for ' + getShowName(show)}
      loading="lazy"
      onError={handleError}
    />
  );
}

export default Poster;

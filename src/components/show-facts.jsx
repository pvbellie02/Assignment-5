/*
  Name: [Pranav Bellie]
  Date: 10.29.2026
  CSC 372-01

  This file holds the ShowFacts component. It lists the facts shared by
  the gallery cards and the detail page (premiere date, genres, rating,
  and when the record was last updated). The detail page also asks for
  the extra facts: status and network or streaming channel.
*/

import {
  formatPremiere,
  formatGenres,
  formatRating,
  formatUpdated,
  formatStatus,
  getNetworkName
} from '../utils.js';

/**
 * A group of labeled facts about a show. Missing data shows as
 * "Not available".
 * @param {Object} props - The component props.
 * @param {Object} props.show - A show object from TVmaze.
 * @param {boolean} [props.extended] - True to also show the status and
 *     the network or streaming channel.
 * @return {JSX.Element} The facts.
 */
function ShowFacts({ show, extended }) {
  return (
    <div className="show-facts">
      <p><strong>Premiered:</strong> {formatPremiere(show.premiered)}</p>
      <p><strong>Genres:</strong> {formatGenres(show.genres)}</p>
      <p><strong>Average rating:</strong> {formatRating(show.rating)}</p>
      {extended && (
        <>
          <p><strong>Status:</strong> {formatStatus(show)}</p>
          <p><strong>Network or channel:</strong> {getNetworkName(show)}</p>
        </>
      )}
      <p><strong>Record last updated:</strong> {formatUpdated(show.updated)}</p>
    </div>
  );
}

export default ShowFacts;

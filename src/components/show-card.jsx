/*
  Name: [Pranav Bellie]
  Date: 10.29.2026
  CSC 372-01

  This file holds the ShowCard component. Each card shows one show and
  makes its own second request, for the show's main cast, inside its own
  effect. The card keeps its own cast status, so if that request fails
  only this card's cast area shows a message and the rest of the gallery
  is unaffected.
*/

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCast } from '../api.js';
import { describeError, formatSummary, getShowName } from '../utils.js';
import Poster from './poster.jsx';
import ShowFacts from './show-facts.jsx';
import CastList from './cast-list.jsx';
import TvmazeLink from './tvmaze-link.jsx';

let MAX_CAST_ON_CARD = 5;
let MAX_SUMMARY_LENGTH = 220;

/**
 * One show's card in the gallery.
 * @param {Object} props - The component props.
 * @param {Object} props.show - A show object from TVmaze.
 * @return {JSX.Element} The card.
 */
function ShowCard({ show }) {
  let [cast, setCast] = useState([]);
  // One of: 'loading', 'error', 'success'
  let [castStatus, setCastStatus] = useState('loading');
  let [castError, setCastError] = useState('');

  useEffect(function () {
    let cancelled = false;
    setCastStatus('loading');

    fetchCast(show.id)
      .then(function (entries) {
        if (cancelled) {
          return;
        }
        setCast(entries);
        setCastStatus('success');
      })
      .catch(function (error) {
        if (cancelled) {
          return;
        }
        setCastError('Cast could not be loaded. ' + describeError(error));
        setCastStatus('error');
      });

    // Ignore the result if the card goes away before the request ends.
    return function () {
      cancelled = true;
    };
  }, [show.id]);

  return (
    <article className="show-card">
      <Poster show={show} />

      <div className="show-card-body">
        <h2>
          <Link to={'/shows/' + show.id}>{getShowName(show)}</Link>
        </h2>

        <ShowFacts show={show} />

        <p className="show-summary">{formatSummary(show, MAX_SUMMARY_LENGTH)}</p>

        <h3>Main cast</h3>
        {castStatus === 'loading' && <p className="message">Loading cast&hellip;</p>}
        {castStatus === 'error' && <p className="message message-error">{castError}</p>}
        {castStatus === 'success' && <CastList members={cast} limit={MAX_CAST_ON_CARD} />}

        <TvmazeLink show={show} />
      </div>
    </article>
  );
}

export default ShowCard;

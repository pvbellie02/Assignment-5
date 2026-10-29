/*
  Name: [Pranav Bellie]
  Date: 10.29.2026
  CSC 372-01

  This file holds the ShowDetail component, the page shown at
  "/shows/:id". It reads the id from the URL with useParams and loads
  the show and its cast in two effects, so opening the URL directly or
  refreshing the page still shows the right show. It handles an invalid
  id, a show that does not exist, and failed requests with messages.
*/

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchShow, fetchCast } from '../api.js';
import {
  describeError,
  formatSummary,
  getShowName,
  isValidShowId
} from '../utils.js';
import Poster from './poster.jsx';
import ShowFacts from './show-facts.jsx';
import CastList from './cast-list.jsx';
import TvmazeLink from './tvmaze-link.jsx';

let MAX_CAST_ON_DETAIL = 15;

/**
 * The detail page for a single show.
 * @return {JSX.Element} The page.
 */
function ShowDetail() {
  let { id } = useParams();
  let validId = isValidShowId(id);

  let [show, setShow] = useState(null);
  // One of: 'loading', 'error', 'success'
  let [showStatus, setShowStatus] = useState('loading');
  let [showError, setShowError] = useState('');

  let [cast, setCast] = useState([]);
  // One of: 'loading', 'error', 'success'
  let [castStatus, setCastStatus] = useState('loading');
  let [castError, setCastError] = useState('');

  // Request 1: the show itself.
  useEffect(function () {
    if (!validId) {
      return undefined;
    }

    let cancelled = false;
    setShowStatus('loading');

    fetchShow(id)
      .then(function (data) {
        if (cancelled) {
          return;
        }
        if (!data || typeof data.id !== 'number') {
          setShowError('That show could not be displayed.');
          setShowStatus('error');
          return;
        }
        setShow(data);
        setShowStatus('success');
      })
      .catch(function (error) {
        if (cancelled) {
          return;
        }
        if (error.status === 404) {
          setShowError('We could not find a show with the ID \u201C' + id + '\u201D.');
        } else {
          setShowError(describeError(error));
        }
        setShowStatus('error');
      });

    return function () {
      cancelled = true;
    };
  }, [id, validId]);

  // Request 2: the show's cast.
  useEffect(function () {
    if (!validId) {
      return undefined;
    }

    let cancelled = false;
    setCastStatus('loading');

    fetchCast(id)
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

    return function () {
      cancelled = true;
    };
  }, [id, validId]);

  let backLink = <Link id="back-link" to="/">&larr; Back to the gallery</Link>;

  if (!validId) {
    return (
      <>
        {backLink}
        <p className="message message-error" role="alert">
          {'\u201C' + id + '\u201D'} is not a valid show ID. Show IDs are whole numbers, like 1 or 169.
        </p>
      </>
    );
  }

  if (showStatus === 'loading') {
    return (
      <>
        {backLink}
        <p className="message" role="status">Loading show&hellip;</p>
      </>
    );
  }

  if (showStatus === 'error') {
    return (
      <>
        {backLink}
        <p className="message message-error" role="alert">{showError}</p>
      </>
    );
  }

  return (
    <>
      {backLink}
      <article id="show-detail">
        <Poster show={show} />

        <div id="show-detail-body">
          <h1>{getShowName(show)}</h1>
          <ShowFacts show={show} extended={true} />
          <p className="show-summary">{formatSummary(show)}</p>

          <h2>Main cast</h2>
          {castStatus === 'loading' && <p className="message">Loading cast&hellip;</p>}
          {castStatus === 'error' && <p className="message message-error">{castError}</p>}
          {castStatus === 'success' && <CastList members={cast} limit={MAX_CAST_ON_DETAIL} />}

          <TvmazeLink show={show} />
        </div>
      </article>
    </>
  );
}

export default ShowDetail;

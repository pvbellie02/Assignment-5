/*
  Name: [Pranav Bellie]
  Date: 10.29.2026
  CSC 372-01

  This file holds the NotFound component, shown for any URL that does
  not match a route.
*/

import { Link } from 'react-router-dom';

/**
 * A friendly message for unknown URLs, with a link home.
 * @return {JSX.Element} The page.
 */
function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <p className="message message-error">There is nothing at this address.</p>
      <Link to="/">Go to the gallery</Link>
    </>
  );
}

export default NotFound;

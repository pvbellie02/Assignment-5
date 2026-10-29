/*
  Name: [Pranav Bellie]
  Date: 10.29.2026
  CSC 372-01

  This file holds the SearchForm component. It is a controlled form:
  React state holds what is typed in the input, and the input's value
  always comes from that state. On submit it hands the text up to its
  parent through the onSearch prop.
*/

import { useState } from 'react';

/**
 * The search form. It owns only the text being typed. The search itself
 * (requests, results, status) belongs to App.
 * @param {Object} props - The component props.
 * @param {string} props.initialValue - The text to start with, so the
 *     input shows the current search when the visitor comes back from a
 *     detail page.
 * @param {function(string): void} props.onSearch - Called with the typed
 *     text when the form is submitted.
 * @param {boolean} props.disabled - True while a search is running.
 * @return {JSX.Element} The form.
 */
function SearchForm({ initialValue, onSearch, disabled }) {
  let [inputValue, setInputValue] = useState(initialValue);

  /**
   * Keeps the state in sync with the input as the visitor types.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
   */
  function handleChange(event) {
    setInputValue(event.target.value);
  }

  /**
   * Stops the browser from reloading the page and sends the text up.
   * @param {React.FormEvent<HTMLFormElement>} event - The submit event.
   */
  function handleSubmit(event) {
    event.preventDefault();
    onSearch(inputValue);
  }

  return (
    <form id="search-form" onSubmit={handleSubmit}>
      <label htmlFor="search-input">Show title or keyword</label>
      <input
        type="search"
        id="search-input"
        name="q"
        autoComplete="off"
        value={inputValue}
        onChange={handleChange}
      />
      <button type="submit" id="search-button" disabled={disabled}>Search</button>
    </form>
  );
}

export default SearchForm;

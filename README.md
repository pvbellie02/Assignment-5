# TVmaze Show Gallery (React)

A React single-page app, built with Vite, that searches the free
[TVmaze API](https://www.tvmaze.com/api) for TV shows. The gallery page
(`/`) shows up to 10 matching shows as Flexbox cards, each with its main
cast loaded by a second request. Clicking a show opens its detail page
(`/shows/:id`) with the full cast, status, and network or streaming
channel. This is a rebuild of my vanilla JavaScript TVmaze gallery.

## How to run

You need Node.js 20.19 or newer (or 22.12 or newer).

```
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

Show data provided by [TVmaze.com](https://www.tvmaze.com/), licensed
under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

## Where each required React concept appears

| # | Concept | Where it appears |
|---|---------|------------------|
| 1 | Components and props | One component per file in `src/components/`, plus `src/app.jsx`. `App` passes props to `GalleryPage`, which passes them to `SearchForm`, `ResultsSummary`, and `ShowList`. `ShowList` renders `ShowCard`, which uses `Poster`, `ShowFacts`, `CastList`, and `TvmazeLink`. `ShowDetail` and `NotFound` are the other pages. |
| 2 | Lists and keys | `src/components/show-list.jsx` (`shows.map` with `key={show.id}`) and `src/components/cast-list.jsx` (`members.map` with a key built from the person id and character id) |
| 3 | Conditional rendering | `src/components/show-list.jsx` (loading, error, empty search, no results, results), `src/components/show-card.jsx` (cast loading, error, success), and `src/components/show-detail.jsx` (invalid id, loading, error, success) |
| 4 | Controlled form | `src/components/search-form.jsx` (`value` and `onChange` on the input, `onSubmit` with `preventDefault()`) |
| 5 | State | `src/app.jsx` (`search`, `status`, `shows`, `errorMessage`), `src/components/search-form.jsx` (`inputValue`), `src/components/show-card.jsx` (`cast`, `castStatus`, `castError`), and `src/components/show-detail.jsx` |
| 6 | Effects and fetch | `src/app.jsx` (effect for the default search and every new search), `src/components/show-card.jsx` (effect for each card's cast request, dependency `show.id`), and `src/components/show-detail.jsx` (effects for the show and its cast). The `res.ok` check before `res.json()` is in `fetchJson` in `src/api.js`. |
| 7 | Lifted state | The search state lives in `src/app.jsx` and is passed through `src/components/gallery-page.jsx` to `src/components/search-form.jsx` and `src/components/results-summary.jsx`, which shows the result count and search term without owning the input |
| 8 | Routing | `src/main.jsx` (`BrowserRouter`), `src/app.jsx` (`Routes` and `Route` for `/`, `/shows/:id`, and a catch-all), `Link` in `src/components/show-card.jsx` and `src/components/show-detail.jsx`, and `useParams` in `src/components/show-detail.jsx` |

Other files: `src/utils.js` holds the helper functions (HTML stripping,
date formatting, and "Not available" fallbacks). `src/api.js` holds the
requests and a small cache so the same URL is never requested twice
(this keeps React StrictMode's double effect run and going back from a
detail page from using up TVmaze's rate limit). `src/styles.css` holds
all of the styles.

## Reflection

The biggest thing React did for me was get rid of the manual DOM work. In the vanilla version I had to build every card with createElement, clear the gallery, and remember to update the status message myself. Now I just change state and React redraws the right parts. Conditional rendering for loading, error, and empty states was way easier to read than a bunch of if statements poking at the DOM. What was harder was understanding useEffect: the cast request, the cleanup flag, and StrictMode running effects twice took me a while, and I added a small request cache so the double run doesn't spam TVmaze and hit the rate limit. The search state (submitted term, status, and results) lives in App. I put it there instead of GalleryPage because App stays mounted when you go to a detail page, so the results are still there when you click back and nothing gets fetched again. The form's typed text lives in SearchForm since only the form needs it, and each ShowCard keeps its own cast state so one failed request can't break the others.

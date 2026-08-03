import { useEffect, useMemo, useRef, useState } from 'react';
import {
  getAllCanes,
  getHeightGuide,
  getCollectionWoodOptions,
  caneMatchesWood,
  parseHeightInches,
} from '../data';
import { CaneGrid } from '../components/CaneCard';
import Button from '../components/Button';
import '../components/CaneMedia.css';

const PAGE_SIZE = 10;

const HEIGHT_RANGES = [
  { value: '', label: 'Any height' },
  { value: 'under-38', label: 'Under 38"', min: 0, max: 38 },
  { value: '38-39', label: '38" – 39"', min: 38, max: 39 },
  { value: '39-40', label: '39" – 40"', min: 39, max: 40 },
  { value: 'over-40', label: 'Over 40"', min: 40, max: Infinity },
];

const AVAILABILITY = [
  { value: '', label: 'All' },
  { value: 'Available', label: 'Available' },
  { value: 'Sold', label: 'Sold' },
];

const TYPES = [
  { value: '', label: 'All types' },
  { value: 'staff', label: 'Staff' },
  { value: 'special', label: 'Special' },
  { value: 'onePiece', label: 'One piece' },
];

function matchesHeightRange(cane, rangeValue) {
  if (!rangeValue) return true;
  const range = HEIGHT_RANGES.find((r) => r.value === rangeValue);
  if (!range || range.min == null) return true;
  const inches = parseHeightInches(cane.height);
  if (inches == null) return false;
  return inches >= range.min && inches < range.max;
}

function matchesType(cane, type) {
  if (!type) return true;
  if (type === 'staff') return cane.kind === 'Staff' || cane.status === 'Staff';
  if (type === 'special') return cane.kind === 'Special';
  if (type === 'onePiece') return Boolean(cane.onePiece);
  return true;
}

function matchesSearch(cane, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [cane.name, cane.wood, cane.height, cane.finish, cane.description]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

export default function CollectionPage() {
  const allCanes = useMemo(
    () => getAllCanes().filter((c) => c.status !== 'Display'),
    [],
  );
  const woodOptions = useMemo(() => getCollectionWoodOptions(), []);
  const guide = getHeightGuide();
  const gridRef = useRef(null);

  const [guideOpen, setGuideOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [wood, setWood] = useState('');
  const [height, setHeight] = useState('');
  const [availability, setAvailability] = useState('Available');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!guideOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setGuideOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [guideOpen]);

  const filtered = useMemo(() => {
    return allCanes.filter((cane) => {
      if (availability && (cane.status || 'Available') !== availability) return false;
      if (!matchesSearch(cane, search)) return false;
      if (!caneMatchesWood(cane, wood)) return false;
      if (!matchesHeightRange(cane, height)) return false;
      if (!matchesType(cane, type)) return false;
      return true;
    });
  }, [allCanes, search, wood, height, availability, type]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageCanes = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, wood, height, availability, type]);

  const goToPage = (next) => {
    const clamped = Math.max(1, Math.min(totalPages, next));
    setPage(clamped);
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    wood !== '' ||
    height !== '' ||
    type !== '' ||
    availability !== 'Available';

  const clearFilters = () => {
    setSearch('');
    setWood('');
    setHeight('');
    setAvailability('Available');
    setType('');
  };

  const showingFrom = filtered.length === 0 ? 0 : pageStart + 1;
  const showingTo = Math.min(pageStart + PAGE_SIZE, filtered.length);

  return (
    <section className="section depth-section">
      <div className="container">
        <h1 className="sr-only">Collection</h1>

        <div className="collection-toolbar" ref={gridRef}>
          <div className="collection-results-meta">
            <p className="collection-results-count">
              {filtered.length === 0
                ? 'No canes match these filters'
                : `Showing ${showingFrom}–${showingTo} of ${filtered.length}`}
            </p>
            <div className="collection-results-actions">
              {hasActiveFilters && (
                <button type="button" className="collection-clear" onClick={clearFilters}>
                  Clear
                </button>
              )}
              <Button type="button" variant="secondary" size="sm" onClick={() => setGuideOpen(true)}>
                Height Guide
              </Button>
              <button
                type="button"
                className={`collection-filter-toggle${filtersOpen ? ' is-open' : ''}${hasActiveFilters ? ' has-filters' : ''}`}
                onClick={() => setFiltersOpen((open) => !open)}
                aria-expanded={filtersOpen}
                aria-controls="collection-filters-panel"
              >
                Filters
                {hasActiveFilters ? <span className="collection-filter-dot" aria-hidden="true" /> : null}
              </button>
            </div>
          </div>

          {filtersOpen && (
            <div
              id="collection-filters-panel"
              className="collection-filters-panel"
              role="region"
              aria-label="Collection filters"
            >
              <div className="collection-filters">
                <label className="collection-filter collection-filter--search">
                  <span className="collection-filter-label">Search</span>
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Name or wood…"
                    autoComplete="off"
                  />
                </label>

                <label className="collection-filter">
                  <span className="collection-filter-label">Wood</span>
                  <select value={wood} onChange={(e) => setWood(e.target.value)}>
                    <option value="">Any wood</option>
                    {woodOptions.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="collection-filter">
                  <span className="collection-filter-label">Height</span>
                  <select value={height} onChange={(e) => setHeight(e.target.value)}>
                    {HEIGHT_RANGES.map((range) => (
                      <option key={range.value || 'any'} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="collection-filter">
                  <span className="collection-filter-label">Availability</span>
                  <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
                    {AVAILABILITY.map((opt) => (
                      <option key={opt.value || 'all'} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="collection-filter">
                  <span className="collection-filter-label">Type</span>
                  <select value={type} onChange={(e) => setType(e.target.value)}>
                    {TYPES.map((opt) => (
                      <option key={opt.value || 'all'} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          )}
        </div>

        {allCanes.length === 0 ? (
          <p className="empty-state">No canes yet. Add entries to src/data/canes.json.</p>
        ) : filtered.length === 0 ? (
          <p className="empty-state">Try a different wood, height, or search term.</p>
        ) : (
          <>
            <CaneGrid canes={pageCanes} />
            {totalPages > 1 && (
              <nav className="collection-pagination" aria-label="Collection pages">
                <button
                  type="button"
                  className="collection-page-btn"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </button>
                <div className="collection-page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`collection-page-num${n === currentPage ? ' is-active' : ''}`}
                      onClick={() => goToPage(n)}
                      aria-current={n === currentPage ? 'page' : undefined}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="collection-page-btn"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
      </div>

      {guideOpen && (
        <div
          className="inquiry-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="height-guide-title"
        >
          <button
            type="button"
            className="inquiry-modal-backdrop"
            aria-label="Close height guide"
            onClick={() => setGuideOpen(false)}
          />
          <div className="inquiry-modal-panel height-guide-panel">
            <button
              type="button"
              className="inquiry-modal-close"
              aria-label="Close"
              onClick={() => setGuideOpen(false)}
            >
              &times;
            </button>
            <h2 id="height-guide-title" className="height-guide-title">
              {guide.title}
            </h2>
            <p className="height-guide-intro">{guide.intro}</p>
            <div className="height-guide-table-wrap">
              <table className="height-guide-table">
                <thead>
                  <tr>
                    <th scope="col">Your height</th>
                    <th scope="col">Cane length</th>
                  </tr>
                </thead>
                <tbody>
                  {guide.rows.map((row) => (
                    <tr key={row.personHeight}>
                      <td>{row.personHeight}</td>
                      <td>{row.caneLength}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {guide.note && <p className="height-guide-note">{guide.note}</p>}
            <Button type="button" variant="primary" onClick={() => setGuideOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

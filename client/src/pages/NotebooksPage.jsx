import { useDeferredValue, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listNotebooks } from "../api/notebooks.js";
import EmptyState from "../components/EmptyState.jsx";
import NotebookCard from "../components/NotebookCard.jsx";
import SearchBar from "../components/SearchBar.jsx";

export default function NotebooksPage() {
  const [notebooks, setNotebooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let mounted = true;

    const loadNotebooks = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await listNotebooks({ search: deferredSearch });

        if (mounted) {
          setNotebooks(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadNotebooks();

    return () => {
      mounted = false;
    };
  }, [deferredSearch]);

  return (
    <div className="stack-lg">
      <section className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Notebooks</p>
          <h1>Build longer-form notes like your own reference docs.</h1>
          <p className="section-heading__text">
            Use notebooks for procedures, verification steps, image-backed
            reference notes, and exportable writeups you want to keep.
          </p>
        </div>
        <Link to="/notebooks/new" className="button button--primary">
          New Notebook
        </Link>
      </section>

      <section className="panel stack-md">
        <div className="toolbar toolbar--single">
          <SearchBar
            label="Search notebooks"
            placeholder="Search by notebook title, summary, or chapter content"
            value={search}
            onChange={setSearch}
          />
        </div>

        {error ? <p className="status status--error">{error}</p> : null}
        {loading ? <p className="status">Loading notebooks...</p> : null}

        {!loading && notebooks.length > 0 ? (
          <div className="grid grid--two">
            {notebooks.map((notebook) => (
              <NotebookCard key={notebook._id} notebook={notebook} />
            ))}
          </div>
        ) : null}

        {!loading && !error && notebooks.length === 0 ? (
          <EmptyState
            title="No notebooks found"
            description="Create your first notebook to start organizing longer notes into chapters."
            actionLabel="Create Notebook"
            actionTo="/notebooks/new"
          />
        ) : null}
      </section>
    </div>
  );
}

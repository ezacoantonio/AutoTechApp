import { useDeferredValue, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCaseNotes } from "../api/caseNotes.js";
import CaseNoteCard from "../components/CaseNoteCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import SearchBar from "../components/SearchBar.jsx";

export default function CaseNotesPage() {
  const [caseNotes, setCaseNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let mounted = true;

    const loadCaseNotes = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await listCaseNotes({
          search: deferredSearch,
        });

        if (mounted) {
          setCaseNotes(data);
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

    loadCaseNotes();

    return () => {
      mounted = false;
    };
  }, [deferredSearch]);

  return (
    <div className="stack-lg">
      <section className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Diagnostic Case Notes</p>
          <h1>Keep your real repair lessons together.</h1>
          <p className="section-heading__text">
            Capture the vehicle, problem, cause, fix, and lesson learned so each
            job becomes useful study material later.
          </p>
        </div>
        <Link to="/case-notes/new" className="button button--primary">
          New Case Note
        </Link>
      </section>

      <section className="panel stack-md">
        <div className="toolbar toolbar--single">
          <SearchBar
            label="Search case notes"
            placeholder="Search by vehicle, problem, cause, or fix"
            value={search}
            onChange={setSearch}
          />
        </div>

        {error ? <p className="status status--error">{error}</p> : null}
        {loading ? <p className="status">Loading case notes...</p> : null}

        {!loading && caseNotes.length > 0 ? (
          <div className="grid grid--two">
            {caseNotes.map((caseNote) => (
              <CaseNoteCard key={caseNote._id} caseNote={caseNote} />
            ))}
          </div>
        ) : null}

        {!loading && !error && caseNotes.length === 0 ? (
          <EmptyState
            title="No case notes found"
            description="Start building your own diagnostic memory bank by saving the first case you want to remember."
            actionLabel="Create Case Note"
            actionTo="/case-notes/new"
          />
        ) : null}
      </section>
    </div>
  );
}

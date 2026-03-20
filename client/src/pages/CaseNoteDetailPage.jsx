import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteCaseNote, getCaseNote } from "../api/caseNotes.js";
import StudySection from "../components/StudySection.jsx";
import { formatDate } from "../utils/date.js";

export default function CaseNoteDetailPage() {
  const { caseNoteId } = useParams();
  const navigate = useNavigate();
  const [caseNote, setCaseNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadCaseNote = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getCaseNote(caseNoteId);

        if (mounted) {
          setCaseNote(data);
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

    loadCaseNote();

    return () => {
      mounted = false;
    };
  }, [caseNoteId]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete the case note for "${caseNote.problem}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");
      await deleteCaseNote(caseNoteId);
      navigate("/case-notes");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (loading) {
    return <p className="status">Loading case note...</p>;
  }

  if (error) {
    return <p className="status status--error">{error}</p>;
  }

  if (!caseNote) {
    return <p className="status">Case note not found.</p>;
  }

  return (
    <div className="stack-lg">
      <section className="topic-hero">
        <Link to="/case-notes" className="inline-link">
          Back to case notes
        </Link>
        <p className="topic-hero__eyebrow">{caseNote.vehicle}</p>
        <h1>{caseNote.problem}</h1>
        <p className="topic-hero__meta">Updated {formatDate(caseNote.updatedAt)}</p>
        <div className="hero__actions">
          <Link
            to={`/case-notes/${caseNote._id}/edit`}
            className="button button--ghost"
          >
            Edit Case Note
          </Link>
          <button
            type="button"
            className="button button--danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Case Note"}
          </button>
        </div>
      </section>

      <section className="study-layout">
        <StudySection title="Cause" content={caseNote.cause} />
        <StudySection title="Fix" content={caseNote.fix} />
        <StudySection title="Lesson Learned" content={caseNote.lessonLearned} />
      </section>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCaseNote, updateCaseNote } from "../api/caseNotes.js";
import CaseNoteEditor from "../components/CaseNoteEditor.jsx";

export default function EditCaseNotePage() {
  const { caseNoteId } = useParams();
  const navigate = useNavigate();
  const [caseNote, setCaseNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleSubmit = async (payload) => {
    const updatedCaseNote = await updateCaseNote(caseNoteId, payload);
    navigate(`/case-notes/${updatedCaseNote._id}`);
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
      <section className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Edit Case Note</p>
          <h1>Update this diagnostic case note.</h1>
          <p className="section-heading__text">
            Keep the repair story accurate so it stays useful as future study
            material and a quick field reference.
          </p>
        </div>
      </section>

      <CaseNoteEditor
        initialCaseNote={caseNote}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/case-notes/${caseNoteId}`)}
        submitLabel="Save Changes"
        submittingLabel="Saving Changes..."
      />
    </div>
  );
}

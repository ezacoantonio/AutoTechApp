import { useNavigate, useSearchParams } from "react-router-dom";
import { createCaseNote } from "../api/caseNotes.js";
import CaseNoteEditor from "../components/CaseNoteEditor.jsx";
import { getRoadmapStepIdsFromSearchParams } from "../utils/roadmap.js";

export default function NewCaseNotePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRoadmapStepIds = getRoadmapStepIdsFromSearchParams(searchParams);

  const handleSubmit = async (payload) => {
    const caseNote = await createCaseNote(payload);
    navigate(`/case-notes/${caseNote._id}`);
  };

  return (
    <div className="stack-lg">
      <section className="section-heading">
        <div>
          <p className="section-heading__eyebrow">New Case Note</p>
          <h1>Capture the diagnostic lesson while it is fresh.</h1>
          <p className="section-heading__text">
            This form stays intentionally simple so it is easy to save a useful
            note in a minute or two.
          </p>
        </div>
      </section>

      <CaseNoteEditor
        initialRoadmapStepIds={initialRoadmapStepIds}
        onSubmit={handleSubmit}
        submitLabel="Save Case Note"
        submittingLabel="Saving..."
      />
    </div>
  );
}

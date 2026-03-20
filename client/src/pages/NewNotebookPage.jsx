import { useNavigate, useSearchParams } from "react-router-dom";
import { createNotebook } from "../api/notebooks.js";
import NotebookEditor from "../components/NotebookEditor.jsx";
import { getRoadmapStepIdsFromSearchParams } from "../utils/roadmap.js";

export default function NewNotebookPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRoadmapStepIds = getRoadmapStepIdsFromSearchParams(searchParams);

  const handleSubmit = async (payload) => {
    const notebook = await createNotebook(payload);
    navigate(`/notebooks/${notebook._id}`);
  };

  return (
    <div className="stack-lg">
      <section className="section-heading section-heading--hero">
        <div>
          <p className="section-heading__eyebrow">New Notebook</p>
          <h1>Start a notebook that reads like your own shop manual.</h1>
          <p className="section-heading__text">
            Use notebooks for longer diagnostic writeups, repeatable procedures,
            chapter-based reference notes, and image-backed documentation.
          </p>
        </div>
      </section>

      <NotebookEditor
        initialRoadmapStepIds={initialRoadmapStepIds}
        onSubmit={handleSubmit}
        submitLabel="Save Notebook"
        submittingLabel="Saving Notebook..."
      />
    </div>
  );
}

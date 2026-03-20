import { useEffect, useState } from "react";
import FormField from "./FormField.jsx";

const createCaseNoteForm = (caseNote = null) => ({
  vehicle: caseNote?.vehicle || "",
  problem: caseNote?.problem || "",
  cause: caseNote?.cause || "",
  fix: caseNote?.fix || "",
  lessonLearned: caseNote?.lessonLearned || "",
});

export default function CaseNoteEditor({
  initialCaseNote = null,
  onSubmit,
  onCancel,
  submitLabel = "Save Case Note",
  submittingLabel = "Saving...",
}) {
  const [form, setForm] = useState(() => createCaseNoteForm(initialCaseNote));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(createCaseNoteForm(initialCaseNote));
    setError("");
  }, [initialCaseNote]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      {error ? <p className="status status--error">{error}</p> : null}

      {onCancel ? (
        <div className="form-actions form-actions--split">
          <button
            type="button"
            className="button button--ghost"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      ) : null}

      <FormField label="Vehicle" htmlFor="vehicle" required>
        <input
          id="vehicle"
          className="input"
          value={form.vehicle}
          onChange={(event) => updateField("vehicle", event.target.value)}
          placeholder="Example: 2015 Toyota Corolla 1.8L"
          required
        />
      </FormField>

      <FormField label="Problem" htmlFor="problem" required>
        <textarea
          id="problem"
          className="textarea"
          value={form.problem}
          onChange={(event) => updateField("problem", event.target.value)}
          rows={3}
          required
        />
      </FormField>

      <FormField label="Cause" htmlFor="cause" required>
        <textarea
          id="cause"
          className="textarea"
          value={form.cause}
          onChange={(event) => updateField("cause", event.target.value)}
          rows={3}
          required
        />
      </FormField>

      <FormField label="Fix" htmlFor="fix" required>
        <textarea
          id="fix"
          className="textarea"
          value={form.fix}
          onChange={(event) => updateField("fix", event.target.value)}
          rows={3}
          required
        />
      </FormField>

      <FormField label="Lesson Learned" htmlFor="lessonLearned" required>
        <textarea
          id="lessonLearned"
          className="textarea"
          value={form.lessonLearned}
          onChange={(event) => updateField("lessonLearned", event.target.value)}
          rows={4}
          required
        />
      </FormField>

      <div className="form-actions">
        <button
          type="submit"
          className="button button--primary"
          disabled={submitting}
        >
          {submitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}

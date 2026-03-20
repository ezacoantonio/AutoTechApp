import { useEffect, useState } from "react";
import { uploadImageToCloudinary } from "../api/uploads.js";
import {
  buildNotebookPayload,
  createNotebookChapter,
  createNotebookForm,
} from "../utils/notebooks.js";
import FormField from "./FormField.jsx";
import RoadmapStepPicker from "./RoadmapStepPicker.jsx";

export default function NotebookEditor({
  initialNotebook = null,
  initialRoadmapStepIds = [],
  onSubmit,
  onCancel,
  submitLabel = "Save Notebook",
  submittingLabel = "Saving...",
  cancelLabel = "Cancel",
}) {
  const [form, setForm] = useState(() => {
    const nextForm = createNotebookForm(initialNotebook);

    if (!initialNotebook && initialRoadmapStepIds.length > 0) {
      nextForm.roadmapStepIds = [...initialRoadmapStepIds];
    }

    return nextForm;
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const nextForm = createNotebookForm(initialNotebook);

    if (!initialNotebook && initialRoadmapStepIds.length > 0) {
      nextForm.roadmapStepIds = [...initialRoadmapStepIds];
    }

    setForm(nextForm);
    setError("");
  }, [initialNotebook, initialRoadmapStepIds]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateChapter = (chapterId, field, value) => {
    setForm((current) => ({
      ...current,
      chapters: current.chapters.map((chapter) =>
        chapter.localId === chapterId
          ? {
              ...chapter,
              [field]: value,
            }
          : chapter
      ),
    }));
  };

  const updateChapterImage = (chapterId, imagePatch) => {
    setForm((current) => ({
      ...current,
      chapters: current.chapters.map((chapter) =>
        chapter.localId === chapterId
          ? {
              ...chapter,
              image: {
                ...chapter.image,
                ...imagePatch,
              },
            }
          : chapter
      ),
    }));
  };

  const addChapter = () => {
    setForm((current) => ({
      ...current,
      chapters: [...current.chapters, createNotebookChapter()],
    }));
  };

  const removeChapter = (chapterId) => {
    setForm((current) => ({
      ...current,
      chapters: current.chapters.filter((chapter) => chapter.localId !== chapterId),
    }));
  };

  const clearChapterImage = (chapterId) => {
    updateChapterImage(chapterId, {
      url: "",
      publicId: "",
      width: null,
      height: null,
      format: "",
      originalFilename: "",
    });
    updateChapter(chapterId, "uploadStatus", "idle");
    updateChapter(chapterId, "uploadError", "");
  };

  const handleImageUpload = async (chapterId, file) => {
    if (!file) {
      return;
    }

    updateChapter(chapterId, "uploadStatus", "uploading");
    updateChapter(chapterId, "uploadError", "");

    try {
      const uploadedImage = await uploadImageToCloudinary(
        file,
        "mechanic-mindset/notebooks"
      );

      updateChapterImage(chapterId, uploadedImage);
      updateChapter(chapterId, "uploadStatus", "done");
    } catch (err) {
      updateChapter(chapterId, "uploadStatus", "error");
      updateChapter(chapterId, "uploadError", err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      await onSubmit(buildNotebookPayload(form));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form-card notebook-editor" onSubmit={handleSubmit}>
      {error ? <p className="status status--error">{error}</p> : null}

      <section className="document-header">
        <div className="document-header__copy">
          <p className="section-heading__eyebrow">Notebook Editor</p>
          <h2>Write this like a field-ready reference doc.</h2>
          <p className="section-heading__text">
            Add short summary context, then build each chapter note with text and
            optional images you can update or remove later.
          </p>
        </div>
        <div className="document-header__actions">
          <button type="button" className="button button--ghost" onClick={addChapter}>
            Add Chapter Note
          </button>
          {onCancel ? (
            <button type="button" className="button button--ghost" onClick={onCancel}>
              {cancelLabel}
            </button>
          ) : null}
          <button
            type="submit"
            className="button button--primary"
            disabled={submitting}
          >
            {submitting ? submittingLabel : submitLabel}
          </button>
        </div>
      </section>

      <div className="grid grid--two">
        <FormField label="Notebook Title" htmlFor="notebookTitle" required>
          <input
            id="notebookTitle"
            className="input input--title"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Example: BMW Verification Notebook"
            required
          />
        </FormField>

        <FormField
          label="Summary"
          htmlFor="notebookSummary"
          hint="Optional. Use this like a short cover-page summary."
        >
          <textarea
            id="notebookSummary"
            className="textarea textarea--compact"
            rows={3}
            value={form.summary}
            onChange={(event) => updateField("summary", event.target.value)}
            placeholder="What is this notebook for?"
          />
        </FormField>
      </div>

      <RoadmapStepPicker
        value={form.roadmapStepIds}
        onChange={(nextValue) => updateField("roadmapStepIds", nextValue)}
      />

      {form.chapters.length > 0 ? (
        <div className="stack-md">
          {form.chapters.map((chapter, index) => (
            <section
              key={chapter.localId}
              className="study-section chapter-editor chapter-editor--document"
            >
              <div className="chapter-editor__header">
                <div>
                  <p className="section-heading__eyebrow">Chapter Note {index + 1}</p>
                  <h3 className="study-section__title">
                    {chapter.title || "Untitled Chapter"}
                  </h3>
                </div>
                <div className="chapter-editor__actions">
                  {chapter.image.url ? (
                    <button
                      type="button"
                      className="button button--ghost"
                      onClick={() => clearChapterImage(chapter.localId)}
                    >
                      Remove Image
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="button button--danger"
                    onClick={() => removeChapter(chapter.localId)}
                  >
                    Delete Note
                  </button>
                </div>
              </div>

              <div className="stack-md">
                <FormField
                  label="Chapter Title"
                  htmlFor={`chapter-title-${chapter.localId}`}
                  required
                >
                  <input
                    id={`chapter-title-${chapter.localId}`}
                    className="input"
                    value={chapter.title}
                    onChange={(event) =>
                      updateChapter(chapter.localId, "title", event.target.value)
                    }
                    placeholder="Example: Voltage Drop Routine"
                    required
                  />
                </FormField>

                <FormField
                  label="Chapter Content"
                  htmlFor={`chapter-content-${chapter.localId}`}
                  required
                  hint="Use this like a running note. Paste steps, bullet lists, readings, or observations."
                >
                  <textarea
                    id={`chapter-content-${chapter.localId}`}
                    className="textarea textarea--document"
                    rows={8}
                    value={chapter.content}
                    onChange={(event) =>
                      updateChapter(chapter.localId, "content", event.target.value)
                    }
                    placeholder="Write the note details here..."
                    required
                  />
                </FormField>

                <FormField
                  label="Image"
                  htmlFor={`chapter-image-${chapter.localId}`}
                  hint="Optional. Add a wiring image, scan capture, connector photo, or diagram."
                >
                  <div className="upload-field">
                    <input
                      id={`chapter-image-${chapter.localId}`}
                      type="file"
                      accept="image/*"
                      className="input"
                      onChange={(event) =>
                        handleImageUpload(
                          chapter.localId,
                          event.target.files?.[0] || null
                        )
                      }
                    />
                    {chapter.uploadStatus === "uploading" ? (
                      <p className="status">Uploading image...</p>
                    ) : null}
                    {chapter.uploadError ? (
                      <p className="status status--error">{chapter.uploadError}</p>
                    ) : null}
                    {chapter.image.url ? (
                      <div className="chapter-card__media">
                        <img
                          src={chapter.image.url}
                          alt={chapter.image.originalFilename || chapter.title}
                          className="chapter-card__image"
                        />
                      </div>
                    ) : null}
                  </div>
                </FormField>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <section className="empty-state empty-state--soft">
          <p className="section-heading__eyebrow">Notebook Body</p>
          <h2>No chapter notes yet.</h2>
          <p>Add your first chapter note to start writing this notebook.</p>
          <button type="button" className="button button--primary" onClick={addChapter}>
            Add First Chapter Note
          </button>
        </section>
      )}
    </form>
  );
}

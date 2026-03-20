import { startTransition, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteNotebook,
  getNotebook,
  updateNotebook,
} from "../api/notebooks.js";
import NotebookEditor from "../components/NotebookEditor.jsx";
import { formatDate } from "../utils/date.js";
import { exportNotebookAsMarkdown } from "../utils/notebooks.js";

export default function NotebookDetailPage() {
  const { notebookId } = useParams();
  const navigate = useNavigate();
  const [notebook, setNotebook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadNotebook = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getNotebook(notebookId);

        if (mounted) {
          setNotebook(data);
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

    loadNotebook();

    return () => {
      mounted = false;
    };
  }, [notebookId]);

  const handleSave = async (payload) => {
    const updatedNotebook = await updateNotebook(notebookId, payload);

    startTransition(() => {
      setNotebook(updatedNotebook);
      setEditing(false);
      setStatusMessage("Notebook saved.");
    });
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this notebook? This will permanently remove it from the notebook list."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");
      await deleteNotebook(notebookId);
      navigate("/notebooks");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    if (!notebook) {
      return;
    }

    exportNotebookAsMarkdown(notebook);
    setStatusMessage("Notebook exported as a Markdown file.");
  };

  if (loading) {
    return <p className="status">Loading notebook...</p>;
  }

  if (error && !notebook) {
    return <p className="status status--error">{error}</p>;
  }

  if (!notebook) {
    return <p className="status">Notebook not found.</p>;
  }

  return (
    <div className="stack-lg">
      <section className="topic-hero topic-hero--document">
        <div className="topic-hero__topline">
          <Link to="/notebooks" className="inline-link">
            Back to notebooks
          </Link>
          <span className="meta-chip meta-chip--muted">Notebook</span>
        </div>

        <div className="topic-hero__main">
          <div>
            <p className="topic-hero__eyebrow">Reference Notebook</p>
            <h1>{notebook.title}</h1>
            <p className="topic-hero__meta">
              Updated {formatDate(notebook.updatedAt)} | {notebook.chapters.length}{" "}
              chapter notes
            </p>
            {notebook.summary ? (
              <p className="section-heading__text">{notebook.summary}</p>
            ) : (
              <p className="section-heading__text">
                Use this notebook like a long-form reference doc for procedures,
                diagrams, checks, and lessons you want to keep.
              </p>
            )}
          </div>

          <div className="toolbar-actions">
            {editing ? (
              <button
                type="button"
                className="button button--ghost"
                onClick={() => {
                  setEditing(false);
                  setStatusMessage("");
                }}
              >
                Exit Edit Mode
              </button>
            ) : (
              <button
                type="button"
                className="button button--ghost"
                onClick={() => setEditing(true)}
              >
                Edit Notebook
              </button>
            )}
            <button
              type="button"
              className="button button--ghost"
              onClick={handleExport}
            >
              Export Markdown
            </button>
            <button
              type="button"
              className="button button--danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Notebook"}
            </button>
          </div>
        </div>
      </section>

      {statusMessage ? <p className="status status--success">{statusMessage}</p> : null}
      {error && notebook ? <p className="status status--error">{error}</p> : null}

      {editing ? (
        <NotebookEditor
          initialNotebook={notebook}
          onSubmit={handleSave}
          onCancel={() => {
            setEditing(false);
            setStatusMessage("");
          }}
          submitLabel="Save Changes"
          submittingLabel="Saving Changes..."
          cancelLabel="Cancel Editing"
        />
      ) : (
        <section className="stack-md notebook-reading-list">
          {notebook.chapters.length > 0 ? (
            notebook.chapters.map((chapter, index) => (
              <article
                key={chapter._id || index}
                className="study-section chapter-card chapter-card--document"
              >
                <div className="chapter-card__header">
                  <p className="card__eyebrow">Chapter Note {index + 1}</p>
                  <h2 className="study-section__title">{chapter.title}</h2>
                </div>
                <p className="study-section__content">{chapter.content}</p>
                {chapter.image?.url ? (
                  <div className="chapter-card__media">
                    <img
                      src={chapter.image.url}
                      alt={chapter.image.originalFilename || chapter.title}
                      className="chapter-card__image"
                    />
                  </div>
                ) : null}
              </article>
            ))
          ) : (
            <section className="empty-state empty-state--soft">
              <p className="section-heading__eyebrow">Notebook Body</p>
              <h2>This notebook is empty.</h2>
              <p>Switch to edit mode to add your first chapter note.</p>
              <button
                type="button"
                className="button button--primary"
                onClick={() => setEditing(true)}
              >
                Start Writing
              </button>
            </section>
          )}
        </section>
      )}
    </div>
  );
}

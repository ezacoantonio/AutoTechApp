import { Link } from "react-router-dom";
import { formatDate } from "../utils/date.js";

export default function NotebookCard({ notebook }) {
  return (
    <article className="card card--clickable">
      <div className="card__eyebrow">Notebook</div>
      <h3 className="card__title">
        <Link to={`/notebooks/${notebook._id}`} className="card__title-link">
          {notebook.title}
        </Link>
      </h3>
      <p className="card__body">
        {notebook.summary ||
          "Editable notebook with chapter notes, optional images, and export-ready content."}
      </p>
      <div className="meta-row">
        <span className="meta-chip">{notebook.chapters.length} chapters</span>
      </div>
      <div className="card__meta">Updated {formatDate(notebook.updatedAt)}</div>
    </article>
  );
}

import { Link } from "react-router-dom";
import { formatDate } from "../utils/date.js";

export default function CaseNoteCard({ caseNote }) {
  return (
    <article className="card card--clickable">
      <div className="card__eyebrow">{caseNote.vehicle}</div>
      <h3 className="card__title">
        <Link to={`/case-notes/${caseNote._id}`} className="card__title-link">
          {caseNote.problem}
        </Link>
      </h3>
      <p className="card__body">{caseNote.lessonLearned}</p>
      <div className="card__meta">Updated {formatDate(caseNote.updatedAt)}</div>
    </article>
  );
}

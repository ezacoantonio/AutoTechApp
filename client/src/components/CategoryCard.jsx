import { formatDate } from "../utils/date.js";

export default function CategoryCard({ category, onDelete, deleting }) {
  return (
    <article className="card card--stacked">
      <div className="card__eyebrow">Category</div>
      <h3 className="card__title">{category.name}</h3>
      <p className="card__body">
        {category.description || "No description added yet."}
      </p>
      <div className="meta-row">
        <span className="meta-chip">{category.activeTopicCount} active topics</span>
        {category.deletedTopicCount ? (
          <span className="meta-chip meta-chip--muted">
            {category.deletedTopicCount} deleted topics
          </span>
        ) : null}
      </div>
      <div className="card__meta">Updated {formatDate(category.updatedAt)}</div>
      <div className="card__actions">
        <button
          type="button"
          className="button button--danger"
          onClick={() => onDelete(category)}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete Category"}
        </button>
      </div>
    </article>
  );
}


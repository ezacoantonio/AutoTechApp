import { formatDate } from "../utils/date.js";

export default function DeletedItemCard({
  item,
  type,
  onRestore,
  restoring,
}) {
  return (
    <article className="card card--stacked">
      <div className="card__eyebrow">
        Recently Deleted {type === "category" ? "Category" : "Topic"}
      </div>
      <h3 className="card__title">
        {type === "category" ? item.name : item.title}
      </h3>
      <p className="card__body">
        {type === "category"
          ? item.description || "No description saved."
          : item.whatItIs}
      </p>
      <div className="meta-row">
        {type === "category" ? (
          <span className="meta-chip">
            {item.movedTopicCount} topics moved with category
          </span>
        ) : (
          <>
            <span className="meta-chip">{item.category}</span>
            <span className="meta-chip meta-chip--muted">
              Deleted by{" "}
              {item.deletedReason === "category" ? "category" : "manual action"}
            </span>
          </>
        )}
      </div>
      <div className="card__meta">
        Deleted {item.deletedAt ? formatDate(item.deletedAt) : formatDate(item.updatedAt)}
      </div>
      <div className="card__actions">
        <button
          type="button"
          className="button button--ghost"
          onClick={() => onRestore(item)}
          disabled={restoring}
        >
          {restoring ? "Restoring..." : "Restore"}
        </button>
      </div>
    </article>
  );
}

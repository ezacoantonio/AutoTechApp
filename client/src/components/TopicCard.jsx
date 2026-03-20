import { Link } from "react-router-dom";
import { formatDate } from "../utils/date.js";

export default function TopicCard({ topic }) {
  return (
    <article className="card card--clickable">
      <div className="card__eyebrow">{topic.category}</div>
      <h3 className="card__title">
        <Link to={`/topics/${topic._id}`} className="card__title-link">
          {topic.title}
        </Link>
      </h3>
      <p className="card__body">{topic.whatItIs}</p>
      <div className="card__meta">Updated {formatDate(topic.updatedAt)}</div>
    </article>
  );
}

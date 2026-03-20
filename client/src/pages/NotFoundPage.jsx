import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="empty-state">
      <h1>Page not found</h1>
      <p>The page you requested does not exist in Mechanic Mindset.</p>
      <Link to="/" className="button button--primary">
        Return Home
      </Link>
    </div>
  );
}

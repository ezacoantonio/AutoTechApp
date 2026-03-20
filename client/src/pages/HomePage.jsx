import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCategories } from "../api/categories.js";
import { listNotebooks } from "../api/notebooks.js";
import StudyActivityDashboard from "../components/StudyActivityDashboard.jsx";
import { useActivity } from "../context/ActivityContext.jsx";

const learningLanes = [
  {
    title: "Study Topics",
    description:
      "Review systems using the same five-part diagnostic format every time.",
    to: "/topics",
  },
  {
    title: "Case Notes",
    description:
      "Capture real repairs so each job adds to your personal diagnostic memory.",
    to: "/case-notes",
  },
  {
    title: "Notebooks",
    description:
      "Build chapter-based notes with text and images for deeper reference material.",
    to: "/notebooks",
  },
  {
    title: "Recently Deleted",
    description:
      "Soft delete topics and categories so you can restore them when needed.",
    to: "/recently-deleted",
  },
];

const getLocalDateKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

const formatMinutes = (seconds) => {
  if (!seconds) {
    return "0m";
  }

  if (seconds >= 3600) {
    return `${(seconds / 3600).toFixed(seconds >= 36000 ? 0 : 1)}h`;
  }

  return `${Math.max(1, Math.round(seconds / 60))}m`;
};

export default function HomePage() {
  const { activity } = useActivity();
  const [categories, setCategories] = useState([]);
  const [notebookCount, setNotebookCount] = useState(0);
  const today = activity.daily[getLocalDateKey()] || {
    visits: 0,
    studySeconds: 0,
  };

  useEffect(() => {
    let mounted = true;

    const loadOverview = async () => {
      try {
        const [categoryData, notebookData] = await Promise.all([
          listCategories(),
          listNotebooks(),
        ]);

        if (mounted) {
          setCategories(categoryData);
          setNotebookCount(notebookData.length);
        }
      } catch {
        if (mounted) {
          setCategories([]);
          setNotebookCount(0);
        }
      }
    };

    loadOverview();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="stack-lg">
      <section className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">Personal automotive learning app</p>
          <h1>Build diagnostic thinking with a focused study rhythm.</h1>
          <p className="hero__text">
            Mechanic Mindset keeps study topics, real repair notes, and notebook
            chapters in one clean workspace built for phone and desktop, with
            lightweight tracking that helps you stay consistent over time.
          </p>
          <div className="hero__actions">
            <Link to="/topics" className="button button--primary">
              Browse Study Topics
            </Link>
            <Link to="/notebooks/new" className="button button--ghost">
              Start a Notebook
            </Link>
          </div>
        </div>

        <div className="hero__metrics">
          <div className="summary-stat">
            <span className="summary-stat__value">{categories.length}</span>
            <span className="summary-stat__label">Active categories</span>
          </div>
          <div className="summary-stat">
            <span className="summary-stat__value">{notebookCount}</span>
            <span className="summary-stat__label">Notebook documents</span>
          </div>
          <div className="summary-stat">
            <span className="summary-stat__value">{activity.totalVisits}</span>
            <span className="summary-stat__label">Tracked visits</span>
          </div>
          <div className="summary-stat">
            <span className="summary-stat__value">
              {formatMinutes(today.studySeconds)}
            </span>
            <span className="summary-stat__label">Study time today</span>
          </div>
        </div>
      </section>

      <StudyActivityDashboard activity={activity} />

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Core workflow</p>
            <h2>Use the app in connected study lanes.</h2>
            <p className="section-heading__text">
              Move between structured study topics, real repair case notes, and
              notebook references without losing your momentum.
            </p>
          </div>
        </div>

        <div className="grid grid--two">
          {learningLanes.map((item) => (
            <article key={item.title} className="feature-card feature-card--linked">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link to={item.to} className="inline-link">
                Open section
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Study categories</p>
            <h2>Focus on one system at a time.</h2>
            <p className="section-heading__text">
              Keep your categories lean so each study topic has a clear home and
              your review sessions stay fast.
            </p>
          </div>
          <Link to="/categories" className="button button--ghost">
            Manage Categories
          </Link>
        </div>

        <div className="pill-row">
          {categories.map((category) => (
            <span key={category._id} className="pill">
              {category.name}
            </span>
          ))}
          {categories.length === 0 ? (
            <span className="status">
              Add your first category to start structuring topics.
            </span>
          ) : null}
        </div>
      </section>
    </div>
  );
}

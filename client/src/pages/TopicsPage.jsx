import { useDeferredValue, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCategories } from "../api/categories.js";
import { listTopics } from "../api/topics.js";
import CategoryFilter from "../components/CategoryFilter.jsx";
import EmptyState from "../components/EmptyState.jsx";
import SearchBar from "../components/SearchBar.jsx";
import TopicCard from "../components/TopicCard.jsx";

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      try {
        const data = await listCategories();
        if (mounted) {
          setCategories(data);
        }
      } catch {
        if (mounted) {
          setCategories([]);
        }
      }
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadTopics = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await listTopics({
          search: deferredSearch,
          categoryId,
        });

        if (mounted) {
          setTopics(data);
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

    loadTopics();

    return () => {
      mounted = false;
    };
  }, [deferredSearch, categoryId]);

  return (
    <div className="stack-lg">
      <section className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Study Topics</p>
          <h1>Review one system at a time.</h1>
          <p className="section-heading__text">
            Browse, search, and create structured study notes built around
            diagnostic thinking.
          </p>
        </div>
        <div className="toolbar-actions">
          <Link to="/categories" className="button button--ghost">
            Manage Categories
          </Link>
          <Link to="/topics/new" className="button button--primary">
            New Topic
          </Link>
        </div>
      </section>

      <section className="panel stack-md">
        <div className="toolbar">
          <SearchBar
            label="Search topics"
            placeholder="Search by title, symptom, failure, or fix"
            value={search}
            onChange={setSearch}
          />
          <CategoryFilter
            categories={categories}
            value={categoryId}
            onChange={setCategoryId}
          />
        </div>

        {error ? <p className="status status--error">{error}</p> : null}
        {loading ? <p className="status">Loading topics...</p> : null}

        {!loading && topics.length > 0 ? (
          <div className="grid grid--two">
            {topics.map((topic) => (
              <TopicCard key={topic._id} topic={topic} />
            ))}
          </div>
        ) : null}

        {!loading && !error && topics.length === 0 ? (
          <EmptyState
            title="No topics found"
            description="Try a different search, change the category filter, or create your first study topic."
            actionLabel="Create Topic"
            actionTo="/topics/new"
          />
        ) : null}
      </section>
    </div>
  );
}

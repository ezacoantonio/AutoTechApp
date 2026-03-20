import { useEffect, useState } from "react";
import { restoreCategory } from "../api/categories.js";
import { listRecentlyDeleted } from "../api/recentlyDeleted.js";
import { restoreTopic } from "../api/topics.js";
import DeletedItemCard from "../components/DeletedItemCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function RecentlyDeletedPage() {
  const [deletedItems, setDeletedItems] = useState({
    categories: [],
    topics: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [restoringKey, setRestoringKey] = useState("");

  const loadDeletedItems = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await listRecentlyDeleted();
      setDeletedItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeletedItems();
  }, []);

  const handleRestoreCategory = async (category) => {
    try {
      setRestoringKey(`category-${category._id}`);
      setError("");
      const result = await restoreCategory(category._id);
      setStatus(
        `${category.name} restored. ${result.restoredTopicCount} linked topics restored with it.`
      );
      await loadDeletedItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setRestoringKey("");
    }
  };

  const handleRestoreTopic = async (topic) => {
    try {
      setRestoringKey(`topic-${topic._id}`);
      setError("");
      await restoreTopic(topic._id);
      setStatus(`${topic.title} restored.`);
      await loadDeletedItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setRestoringKey("");
    }
  };

  const nothingDeleted =
    deletedItems.categories.length === 0 && deletedItems.topics.length === 0;

  return (
    <div className="stack-lg">
      <section className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Recently Deleted</p>
          <h1>Restore deleted categories and topics.</h1>
          <p className="section-heading__text">
            Deletes are soft by default. Restore anything you still want in your
            active study system.
          </p>
        </div>
      </section>

      {error ? <p className="status status--error">{error}</p> : null}
      {status ? <p className="status">{status}</p> : null}
      {loading ? <p className="status">Loading recently deleted items...</p> : null}

      {!loading && nothingDeleted ? (
        <EmptyState
          title="Recently deleted is empty"
          description="Deleted topics and categories will appear here so they can be restored later."
        />
      ) : null}

      {!loading && deletedItems.categories.length > 0 ? (
        <section className="panel stack-md">
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">Deleted Categories</p>
              <h2>Categories waiting in restore history.</h2>
            </div>
          </div>

          <div className="grid grid--two">
            {deletedItems.categories.map((category) => (
              <DeletedItemCard
                key={category._id}
                item={category}
                type="category"
                onRestore={handleRestoreCategory}
                restoring={restoringKey === `category-${category._id}`}
              />
            ))}
          </div>
        </section>
      ) : null}

      {!loading && deletedItems.topics.length > 0 ? (
        <section className="panel stack-md">
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">Deleted Topics</p>
              <h2>Topics waiting in restore history.</h2>
            </div>
          </div>

          <div className="grid grid--two">
            {deletedItems.topics.map((topic) => (
              <DeletedItemCard
                key={topic._id}
                item={topic}
                type="topic"
                onRestore={handleRestoreTopic}
                restoring={restoringKey === `topic-${topic._id}`}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
